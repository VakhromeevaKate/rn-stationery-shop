import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from 'react-native';
import { RootStackParamList } from '../types/navigation';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import HeaderCartButton from '../components/HeaderCartButton';
import { useAuth } from '../auth/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Показывается только для авторизованного пользователя
// (гейт по токену — в App.tsx: token ? RootNavigator : AuthScreen).
export default function RootNavigator() {
  const { signOut } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="ProductList"
          component={ProductListScreen}
          options={{
            title: 'Канцтовары',
            headerRight: () => <HeaderCartButton />,
            headerLeft: () => <Button title="Выйти" onPress={() => signOut()} />,
          }}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{
            title: 'Товар',
            headerRight: () => <HeaderCartButton />,
          }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ title: 'Корзина' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
