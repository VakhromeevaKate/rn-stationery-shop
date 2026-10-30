import { Alert, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../auth/AuthContext';

export default function LogoutButton() {
  const { signOut } = useAuth();

  const handlePress = () => {
    Alert.alert(
      'Выйти из аккаунта?',
      'Корзина и локальные данные сохранятся, но для новых заказов потребуется повторный вход.',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Выйти', style: 'destructive', onPress: () => signOut() },
      ],
    );
  };

  return (
    <Pressable
      onPress={handlePress}
      style={styles.wrap}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Выйти из аккаунта"
    >
      <Ionicons name="log-out-outline" size={22} color="#e53935" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 8 },
});