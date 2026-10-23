# Настройка Push-уведомлений в Expo-приложении (React Native)

## 📋 Оглавление

1. [Архитектура и предварительные условия](#1-архитектура-и-предварительные-условия)
2. [Установка зависимостей](#2-установка-зависимостей)
3. [Настройка `app.json`](#3-настройка-appjson)
4. [Клиентский код: получение токена](#4-клиентский-код-получение-токена)
5. [Firebase: настройка FCM для Android](#5-firebase-настройка-fcm-для-android)
6. [Загрузка credentials в EAS](#6-загрузка-credentials-в-eas)
7. [Сборка Development Build](#7-сборка-development-build)
8. [Бэкенд на FastAPI](#8-бэкенд-на-fastapi)
9. [End-to-end тестирование](#9-end-to-end-тестирование)
10. [Проблемы и их решения](#10-проблемы-и-их-решения)
11. [Чек-лист «всё ли на месте»](#11-чек-лист-всё-ли-на-месте)

## 1. Архитектура и предварительные условия

### Как работают пуши в Expo

```
[Приложение] --получает ExpoPushToken--> [Ваш бэкенд]
     ^                                         |
     |                                         v
     |                              [Expo Push API]
     |                                    /     \
     |                                   v       v
     +--------- FCM (Android) ------------------+
     +--------- APNs (iOS) ---------------------+
```

**Ключевое:**
- Приложение **не** общается с FCM/APNs напрямую — оно получает `ExpoPushToken` и отправляет его на ваш сервер.
- Ваш сервер шлёт HTTPS-запрос на `https://exp.host/--/api/v2/push/send`, Expo сам доставляет через FCM/APNs.
- **FCM необходим на Android** как транспортный слой — без `google-services.json` токен не сгенерируется.
- Прямой интеграции с Google Firebase в коде нет, но конфиг нужен.

### Что понадобится

| Ресурс                                                      | Зачем                         |
|-------------------------------------------------------------|-------------------------------|
| Аккаунт [expo.dev](https://expo.dev)                        | EAS Build, Push API           |
| Аккаунт [firebase.google.com](https://firebase.google.com)  | FCM-транспорт для Android     |
| Физическое Android-устройство                               | Симулятор push не принимает   |
| Node.js 18+, EAS CLI                                        | Сборка development build      |
| Python 3.10+                                                | Бэкенд на FastAPI             |

## 2. Установка зависимостей

```bash
npx expo install expo-notifications expo-constants expo-device
```

**Не используйте `npm install`** — версии могут не совпасть с текущим SDK Expo.

Также понадобится `expo-dev-client` — без него `expo start` не сможет подключиться к development build:

```bash
npx expo install expo-dev-client
```

## 3. Настройка `app.json`

```json
{
  "expo": {
    "name": "stationery-shop",
    "slug": "stationery-shop",
    "plugins": ["expo-notifications"],
    "android": {
      "package": "com.vakhromeevae.stationeryshop",
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "bundleIdentifier": "com.vakhromeevae.stationeryshop"
    },
    "extra": {
      "eas": {
        "projectId": "ваш-project-id-из-eas"
      }
    }
  }
}
```

- **`projectId`** берётся из [expo.dev](https://expo.dev) (Dashboard → Project → Project ID) или создаётся через `eas init`.
- **`googleServicesFile`** появится позже, после регистрации приложения в Firebase (см. шаг 5).

## 4. Клиентский код: получение токена

### `src/services/notifications.ts`

```ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Как показывать уведомления при открытом приложении
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  // 1. Только физическое устройство
  if (!Device.isDevice) {
    console.warn('Push не работают на симуляторе');
    return null;
  }

  // 2. Android: канал уведомлений ДО запроса разрешения (Android 13+)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // 3. Разрешение
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.warn('Разрешение не получено');
    return null;
  }

  // 4. projectId
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    console.error('projectId не найден в app.json');
    return null;
  }

  // 5. ExpoPushToken
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  console.log('ExpoPushToken:', token);
  return token;
}
```

### `App.tsx`

```tsx
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from './src/services/notifications';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        // Здесь — отправка на бэкенд для сохранения
        console.log('Токен для отправки на сервер:', token);
      }
    });

    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Тап по уведомлению:', response);
        // Навигация: navigation.navigate(response.notification.request.content.data.screen)
      },
    );

    return () => sub.remove();
  }, []);

  return <RootNavigator />;
}
```

## 5. Firebase: настройка FCM для Android

Без этого шага токен **не сгенерируется** — приложение выдаст `Unable to get Firebase Messaging instance`.

### 5.1. Создать проект в Firebase

1. Открыть [console.firebase.google.com](https://console.firebase.google.com).
2. Создать новый проект (название — любое).

### 5.2. Добавить Android-приложение

1. В проекте нажать **«Add app» → Android**.
2. Указать **package name**, точно совпадающий с `app.json`:
   ```
   com.vakhromeevae.stationeryshop
   ```
3. Скачать файл **`google-services.json`**.

### 5.3. Положить файл в проект

```
rn-stationery-shop/
├── app.json
├── google-services.json   ← сюда
├── package.json
└── ...
```

Файл содержит публичные идентификаторы, его можно (и нужно) коммитить в git.

### 5.4. Добавить в `app.json`

```json
"android": {
  "package": "com.vakhromeevae.stationeryshop",
  "googleServicesFile": "./google-services.json"
}
```

## 6. Загрузка credentials в EAS

Это отдельный шаг: сервисному аккаунту Expo нужен приватный ключ, чтобы слать запросы в FCM от имени вашего Firebase-проекта.

### 6.1. Получить сервисный ключ

1. В Firebase Console → **Project Settings → Service accounts**.
2. **«Generate new private key»** → скачается JSON-файл.

> ⚠️ **Файл с приватным ключом нельзя коммитить в git.** Добавьте его в `.gitignore`.

### 6.2. Загрузить в EAS

```bash
eas credentials
```

Меню: **Android → production → Google Service Account → Manage your Google Service Account Key for Push Notifications (FCM V1) → Upload a new service account key** — указать путь к JSON-файлу.

## 7. Сборка Development Build

### 7.1. Первичная настройка EAS

```bash
npm install -g eas-cli
eas login
eas init          # создаст projectId в app.json
eas build:configure
```

### 7.2. Сборка

```bash
eas build --profile development --platform android
```

После окончания сборки — скачать APK из дашборда или из терминала по ссылке и установить на физическое устройство:

```bash
adb install path/to/build.apk
```

> 💡 **Только development build, а не Expo Go!** С SDK 53 удалённые push в Expo Go на Android не работают вовсе. На iOS нужен `eas build --profile development --platform ios` + устройство, добавленное в provisioning profile.

### 7.3. Запуск

```bash
npx expo start --dev-client
```

Сканируем QR из терминала — приложение открывается в установленном development build.

## 8. Бэкенд на FastAPI

### 8.1. `push-backend/main.py`

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests

app = FastAPI(title="Stationery Push Service")
EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"


class PushRequest(BaseModel):
    tokens: list[str]
    title: str
    body: str
    data: dict | None = None


@app.post("/push/send")
async def send_push(payload: PushRequest):
    if not payload.tokens:
        raise HTTPException(status_code=400, detail="Список токенов пуст")

    messages = [
        {
            "to": token,
            "sound": "default",
            "title": payload.title,
            "body": payload.body,
            "data": payload.data or {},
            "priority": "high",
        }
        for token in payload.tokens
    ]

    response = requests.post(
        EXPO_PUSH_URL,
        json=messages,
        headers={"Content-Type": "application/json", "Accept": "application/json"},
        timeout=10,
    )
    if response.status_code >= 400:
        raise HTTPException(status_code=502, detail=response.text)
    return {"success": True, "details": response.json()}
```

### 8.2. Запуск

```bash
cd push-backend
pip install fastapi uvicorn requests
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs).

## 9. End-to-end тестирование

1. Приложение запущено на физическом устройстве, в консоли Metro виден `ExpoPushToken[xxxxxxxxxxxx]`.
2. Скопировать токен.
3. Отправить:

```bash
curl -X POST http://localhost:8000/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "tokens": ["ExponentPushToken[ВАШ_ТОКЕН]"],
    "title": "Скидка 20% на блокноты!",
    "body": "Только сегодня — Brauberg А5 в клетку по специальной цене.",
    "data": {"screen": "ProductDetails", "productId": "2"}
  }'
```

4. В ответе — `{"success": true, "details": {...}}`, на устройстве — уведомление.

## 11. Чек-лист «всё ли на месте»

Перед запуском `npx expo start --dev-client` проверьте:

- [ ] `expo-notifications`, `expo-constants`, `expo-device`, `expo-dev-client` установлены через `npx expo install`.
- [ ] В `app.json` есть `plugins: ["expo-notifications"]`.
- [ ] В `app.json` есть `extra.eas.projectId`.
- [ ] В `app.json` есть `android.package`.
- [ ] В `app.json` есть `android.googleServicesFile: "./google-services.json"`.
- [ ] Файл `google-services.json` физически лежит в корне проекта.
- [ ] Android-приложение зарегистрировано в Firebase с **тем же** `package name`.
- [ ] Service account key загружен в EAS (`eas credentials`).
- [ ] Development build собран **после** добавления `google-services.json` — пересборка обязательна, hot reload не поможет.
- [ ] APK установлен на физическое устройство (не симулятор).
- [ ] `npx expo start --dev-client` запущен в терминале.
- [ ] В консоли Metro появился `ExpoPushToken[xxxx...]`.

Если всё отмечено — push работает. Если что-то из списка не выполнено, скорее всего, ошибка будет именно из раздела 10.

---

## 🎓 Что важно запомнить

1. **Expo Go больше не подходит для push на Android.** С SDK 53 нужен development build — это не «альтернатива», а обязательный путь.
2. **`google-services.json` и EAS credentials — это разные вещи.** Первый — конфиг для приложения (публичный). Второй — приватный ключ для сервера Expo, чтобы тот мог слать запросы в FCM.
3. **Пересборка обязательна.** Изменения в `google-services.json` или `app.json` не применяются через hot reload — их нужно «вкомпилировать» в APK.
4. **Локальная сборка из России — боль.** Если Gradle падает с `Read timed out`, не тратьте часы на зеркала — используйте `eas build`. Это тот случай, когда облако объективно удобнее.
5. **Симулятор push не принимает.** Только физическое устройство, только development build.