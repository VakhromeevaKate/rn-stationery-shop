import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchProducts } from '../api/mockProductsAPI';
import { Product } from '../types/product';
import { RootStackParamList } from '../types/navigation';
import ProductListItem from '../components/ProductListItem';
import EmptyState from '../components/EmptyState';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ProductList'>;
const GREEN = '#087f5b';

export default function ProductListScreen() {
  const navigation = useNavigation<Nav>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Все');

  useEffect(() => {
    let alive = true;
    fetchProducts().then((data) => { if (alive) setProducts(data); })
      .catch(() => { if (alive) setError('Не удалось загрузить каталог лекарств'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const categories = useMemo(() => ['Все', ...Array.from(new Set(products.map((p) => p.category)))], [products]);
  const filtered = useMemo(() => products.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || [p.name, p.latin_name, p.active_substance, p.manufacturer, p.category].some((v) => v.toLowerCase().includes(q));
    return matchesSearch && (category === 'Все' || p.category === category);
  }), [products, search, category]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={GREEN} /><Text style={styles.hint}>Загружаем каталог…</Text></View>;
  if (error) return <EmptyState title="Ошибка" subtitle={error} />;

  return <View style={styles.screen}>
    <View style={styles.hero}>
      <Text style={styles.eyebrow}>PHARMACY • КАТАЛОГ</Text>
      <Text style={styles.heading}>Здоровье{ '\n' } начинается с заботы</Text>
      <Text style={styles.subheading}>Найдите препарат по названию или действующему веществу</Text>
      <View style={styles.searchBox}><Text style={styles.searchIcon}>⌕</Text><TextInput value={search} onChangeText={setSearch} placeholder="Название, вещество, производитель" placeholderTextColor="#82918b" style={styles.search} /></View>
      <Text style={styles.count}>{products.length} препаратов в каталоге</Text>
    </View>
    <Text style={styles.sectionTitle}>Категории</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
      {categories.map((c) => <Pressable key={c} onPress={() => setCategory(c)} style={[styles.chip, category === c && styles.chipActive]}><Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text></Pressable>)}
    </ScrollView>
    <View style={styles.resultsHead}><Text style={styles.sectionTitle}>Препараты</Text><Text style={styles.resultCount}>{filtered.length} найдено</Text></View>
    {filtered.length === 0 ? <EmptyState title="Ничего не найдено" subtitle="Попробуйте изменить запрос или категорию" /> : <FlatList data={filtered} keyExtractor={(p) => p.id} contentContainerStyle={styles.list} renderItem={({ item }) => <ProductListItem product={item} onPress={() => navigation.navigate('ProductDetails', { productId: item.id })} />} />}
  </View>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#f4f8f6' }, hero: { backgroundColor: '#e1f3eb', paddingHorizontal: 20, paddingTop: 22, paddingBottom: 18, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }, eyebrow: { color: GREEN, fontSize: 11, fontWeight: '800', letterSpacing: 2 }, heading: { color: '#163c30', fontSize: 29, lineHeight: 34, fontWeight: '800', marginTop: 10 }, subheading: { color: '#557167', fontSize: 13, lineHeight: 19, marginTop: 8 }, searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 12, marginTop: 17, height: 48 }, searchIcon: { fontSize: 26, color: GREEN, marginRight: 8 }, search: { flex: 1, fontSize: 13, color: '#173c30' }, count: { color: '#557167', fontSize: 11, marginTop: 12 }, sectionTitle: { color: '#193d31', fontSize: 17, fontWeight: '800', marginLeft: 16, marginTop: 17, marginBottom: 9 }, chips: { paddingHorizontal: 16, gap: 8, paddingBottom: 2 }, chip: { paddingHorizontal: 13, paddingVertical: 9, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#dce8e2' }, chipActive: { backgroundColor: GREEN, borderColor: GREEN }, chipText: { color: '#547066', fontSize: 12, fontWeight: '600' }, chipTextActive: { color: '#fff' }, resultsHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 16 }, resultCount: { color: '#7b9087', fontSize: 12, marginTop: 8 }, list: { paddingBottom: 20, paddingTop: 2 }, center: { flex: 1, alignItems: 'center', justifyContent: 'center' }, hint: { marginTop: 8, color: '#557167' } });
