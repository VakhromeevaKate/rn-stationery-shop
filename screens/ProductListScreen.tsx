import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchProducts } from '../api/mockProductsAPI';
import { Product } from '../types/product';
import { RootStackParamList } from '../types/navigation';
import ProductListItem from '../components/ProductListItem';
import EmptyState from '../components/EmptyState';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ProductList'>;

export default function ProductListScreen() {
  const navigation = useNavigation<Nav>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchProducts();
        if (alive) setProducts(data);
      } catch (e) {
        if (alive) setError('Не удалось загрузить товары');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e88e5" />
        <Text style={styles.hint}>Загружаем каталог...</Text>
      </View>
    );
  }

  if (error) {
    return <EmptyState title="Ошибка" subtitle={error} />;
  }

  if (products.length === 0) {
    return <EmptyState title="Каталог пуст" />;
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(p) => String(p.id)}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <ProductListItem
          product={item}
          onPress={() =>
           navigation.navigate('ProductDetails', { productId: String(item.id) })
          }
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingVertical: 6 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hint: { marginTop: 8, color: '#666' },
});