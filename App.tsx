import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './navigation/RootNavigator';
import { registerForPushNotificationsAsync } from './services/notifications';
import { useEffect } from 'react';
import { addNotificationReceivedListener } from 'expo-notifications';

export default function App() {
  useEffect(() => {
    // зарегистрируем notification token:
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        console.log('Token для сервера:', token);
      }
    });

    const subscription = addNotificationReceivedListener((resp) => {
      console.log('Пользователь нажал уведомление: ', resp);
      // Здесь можно как угодно реагировать на этот
      // resp - переадресовать на нужный экран, например
    });

    return () => subscription.remove();

  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}
