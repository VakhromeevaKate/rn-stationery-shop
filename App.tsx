import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './navigation/RootNavigator';

import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from './auth/AuthContext';
import AuthScreen from './screens/AuthScreen';

export default function App() {
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

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
       <AuthProvider>
        <Gate />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
