# GitHub-аутентификация в «Магазине канцтоваров»
## 1. Установка пакетов
```bash
npx expo install expo-auth-session expo-crypto expo-web-browser expo-secure-store
```
## 2. GitHub OAuth App

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Заполнить:
   - **Application name:** `Stationery Shop Lab`
   - **Homepage URL:** `https://example.com`
   - **Authorization callback URL:** `stationeryshop://auth`
3. Скопировать **Client ID**. Secret не нужен.

## 3. `app.json` — добавить схему и плагин
```json
{
  "expo": {
    "scheme": "stationeryshop",
    "plugins": ["expo-secure-store"]
  }
}
```
**Пересобрать development build** (схема не подхватится через hot reload):
```bash
npx expo run:android
```
## 4. `src/auth/authService.ts`
```ts
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'github_access_token';

export const saveToken = (t: string) => SecureStore.setItemAsync(TOKEN_KEY, t);
export const getToken = () => SecureStore.getItemAsync(TOKEN_KEY);
export const removeToken = () => SecureStore.deleteItemAsync(TOKEN_KEY);
```
## 5. `src/auth/AuthContext.tsx`
```tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getToken, saveToken, removeToken } from './authService';

interface Ctx {
  token: string | null;
  isLoading: boolean;
  signIn: (t: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<Ctx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await getToken();
      setToken(stored);
      setIsLoading(false);
    })();
  }, []);

  const signIn = async (t: string) => {
    await saveToken(t);
    setToken(t);
  };

  const signOut = async () => {
    await removeToken();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside AuthProvider');
  return ctx;
};
```
## 6. `src/screens/AuthScreen.tsx`
```tsx
import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';
import { useAuth } from '../auth/AuthContext';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
};

export default function AuthScreen() {
  const { signIn } = useAuth();
  const redirectUri = makeRedirectUri({ scheme: 'stationeryshop', path: 'auth' });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'ВАШ_GITHUB_CLIENT_ID',
      scopes: ['read:user', 'user:email'],
      redirectUri,
      responseType: ResponseType.Code,
    },
    discovery,
  );

  useEffect(() => {
    if (response?.type === 'success') {
      signIn(response.params.code); // в проде — обмен на токен через бэкенд
    } else if (response?.type === 'error') {
      Alert.alert('Ошибка', response.error?.message ?? 'unknown');
    }
  }, [response]);

  return (
    <View style={styles.c}>
      <Text style={styles.t}>Магазин канцтоваров</Text>
      <Text style={styles.s}>Войдите, чтобы продолжить</Text>
      <Pressable
        style={[styles.b, !request && styles.bd]}
        disabled={!request}
        onPress={() => promptAsync()}
      >
        {request ? <Text style={styles.bt}>Войти через GitHub</Text> : <ActivityIndicator color="#fff" />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  t: { fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  s: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 32 },
  b: { backgroundColor: '#24292e', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  bd: { opacity: 0.5 },
  bt: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
```
## 7. `App.tsx` — «гейт», с которого нельзя уйти
```tsx
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from './src/auth/AuthContext';
import AuthScreen from './src/screens/AuthScreen';
import RootNavigator from './src/navigation/RootNavigator';

function Gate() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Нет токена → только AuthScreen, вне NavigationContainer.
  return token ? <RootNavigator /> : <AuthScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
```

---

## 8. Запуск и проверка
```bash
npx expo start --dev-client
```
1. Открыть приложение в эмуляторе → должен появиться экран входа.
2. Нажать «Войти через GitHub» → браузер → авторизация → возврат в приложение.
3. В консоли Metro виден `code`, в приложении — каталог.
4. Убить и перезапустить приложение → должен остаться залогиненным.

**Проверка deep link отдельно:**
```bash
adb shell am start -W -a android.intent.action.VIEW -d "stationeryshop://auth"
```

Приложение должно открыться. Если нет — схема не скомпилирована, пересоберите build.