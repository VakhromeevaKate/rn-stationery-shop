import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '../types/navigation';

import LoginScreen from '../screens/LoginScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';

import HeaderCartButton from '../components/HeaderCartButton';

const Stack = createNativeStackNavigator<RootStackParamList>();

function LogoutButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.logoutButton}>
      <Text style={styles.logoutText}>Выйти</Text>
    </Pressable>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#f4f8f6' },
          headerTintColor: '#173d30',
          headerTitleStyle: { fontWeight: '800' },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="ProductList"
          component={ProductListScreen}
          options={({ navigation }) => ({
            title: 'Аптека',
            headerRight: () => (
              <View style={styles.headerActions}>
                <HeaderCartButton />
                <LogoutButton
                  onPress={() =>
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Login' }],
                    })
                  }
                />
              </View>
            ),
          })}
        />

        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={({ navigation }) => ({
            title: 'О препарате',
            headerRight: () => (
              <View style={styles.headerActions}>
                <HeaderCartButton />
                <LogoutButton
                  onPress={() =>
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Login' }],
                    })
                  }
                />
              </View>
            ),
          })}
        />

        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={({ navigation }) => ({
            title: 'Корзина',
            headerRight: () => (
              <LogoutButton
                onPress={() =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  })
                }
              />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutButton: {
    backgroundColor: '#e5f2eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  logoutText: {
    color: '#087f5b',
    fontSize: 12,
    fontWeight: '800',
  },
});