import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { selectCartLines, useCartLines, useCartStore } from '../stores/cartStore';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import EmptyState from '../components/EmptyState';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Cart'>;

export default function CartScreen() {
  const navigation = useNavigation<Nav>();
  const lines = useCartLines();
  const clear = useCartStore((s) => s.clear);

  if (lines.length === 0) {
    return (
      <EmptyState
        title="Корзина пуста"
        subtitle="Добавьте товары из каталога"
      />
    );
  }

  const handleBuy = () => {
    // Читаем актуальное состояние из стора вне React — фишка Zustand
    const total = useCartStore.getState().lines;
    const count = Object.values(total).reduce((s, l) => s + l.quantity, 0);

    Alert.alert(
      'Спасибо за покупку! 🎉',
      `Вы заказали ${count} тов. на сумму ${Object.values(total)
        .reduce((s, l) => s + l.product.price * l.quantity, 0)} ₽.`,
      [
        {
          text: 'OK',
          onPress: () => {
            clear();
            navigation.popToTop();
          },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={lines}
        keyExtractor={(l) => l.product.id}
        renderItem={({ item }) => <CartItem line={item} />}
        contentContainerStyle={styles.list}
      />
      <View style={styles.footer}>
        <CartSummary />
        <Pressable style={styles.buyBtn} onPress={handleBuy}>
          <Text style={styles.buyBtnText}>Купить</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8f6' },
  list: { paddingVertical: 6 },
  footer: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e4eee8' },
  buyBtn: {
    backgroundColor: '#087f5b',
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buyBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});