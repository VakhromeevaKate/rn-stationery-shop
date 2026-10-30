import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import HeaderCartButton from '../components/HeaderCartButton';
import LogoutButton from '../components/LogoutButton';
import { View } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="ProductList"
          component={ProductListScreen}
          options={{
            title: 'Канцтовары',
            headerRight: () => <View style={{display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center'}}>
              <LogoutButton />
              <HeaderCartButton />
            </View>,
          }}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{
            title: 'Товар',
            headerRight: () => <View style={{display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center'}}>
              <LogoutButton />
              <HeaderCartButton />
            </View>,
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