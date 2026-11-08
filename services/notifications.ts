import * as Notifications from 'expo-notifications';
import * as Device from "expo-device";
import Contants from "expo-constants";
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
    if (!Device.isDevice) {
        console.warn('Пуши на симуляторах не работают!');
        return null;
    }
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: 'red',
        });
    }

    // Запрос разрешения на получение уведомлений пользователем
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.warn('Пользователь не дал разрешение на уведомления');
        return null;
    }

    // Получаем токен (ExpoPushToken)
    const projectId = Contants?.expoConfig?.extra?.eas?.projectId ?? Contants?.easConfig?.projectId;

    if (!projectId) {
        console.warn('Не найден projectId в app.json');
        return null;
    }

    const token: string = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    console.log('ExpoPushToken:', token);
    return token;
}
