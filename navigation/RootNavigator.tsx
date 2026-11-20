import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import LoginScreen from '../screens/LoginScreen';
import DrugListScreen from '../screens/DrugListScreen';
import DrugDetailsScreen from '../screens/DrugDetailsScreen';
import CartScreen from '../screens/CartScreen';
import HeaderCartButton from '../components/HeaderCartButton';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#008577' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen
            name="Login"
            options={{ title: 'Вход', headerShown: false }}
          >
            {(props) => (
              <LoginScreen
                {...props}
                onLoginSuccess={() => setIsAuthenticated(true)}
              />
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen
              name="DrugList"
              component={DrugListScreen}
              options={{
                title: 'Аптека',
                headerRight: () => <HeaderCartButton />,
              }}
            />
            <Stack.Screen
              name="DrugDetails"
              component={DrugDetailsScreen}
              options={{
                title: 'Информация о препарате',
                headerRight: () => <HeaderCartButton />,
              }}
            />
            <Stack.Screen
              name="Cart"
              component={CartScreen}
              options={{ title: 'Корзина' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}