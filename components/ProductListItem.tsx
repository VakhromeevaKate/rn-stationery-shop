import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../types/product';
import { useCartStore } from '../stores/cartStore';

export default function ProductListItem({ product, onPress }: { product: Product; onPress: () => void }) {
  const add = useCartStore((s) => s.add);
  return <Pressable style={styles.card} onPress={onPress}>
    <View style={styles.iconBox}><Text style={styles.pillIcon}>✚</Text><Text style={styles.form}>{product.form}</Text></View>
    <View style={styles.info}>
      <View style={styles.tags}><Text style={styles.category} numberOfLines={1}>{product.category}</Text>{product.prescription_required && <Text style={styles.rx}>РЕЦЕПТ</Text>}</View>
      <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
      <Text style={styles.substance} numberOfLines={1}>{product.active_substance} · {product.dosage}</Text>
      <Text style={styles.stock}>{product.stock > 0 ? `В наличии: ${product.stock} шт.` : 'Нет в наличии'}</Text>
      <View style={styles.bottom}><Text style={styles.price}>{product.price.toLocaleString('ru-RU')} ₽</Text><Pressable disabled={product.stock <= 0} style={[styles.addBtn, product.stock <= 0 && styles.disabled]} onPress={(e) => { e.stopPropagation(); add(product); }}><Text style={styles.addBtnText}>+</Text></Pressable></View>
    </View>
  </Pressable>;
}
const styles = StyleSheet.create({ card: { flexDirection: 'row', padding: 13, marginHorizontal: 12, marginVertical: 5, backgroundColor: '#fff', borderRadius: 17, borderWidth: 1, borderColor: '#e7efea' }, iconBox: { width: 68, height: 78, borderRadius: 13, backgroundColor: '#e7f5ed', alignItems: 'center', justifyContent: 'center', marginRight: 12 }, pillIcon: { color: '#087f5b', fontSize: 30, fontWeight: '700' }, form: { color: '#4d7967', fontSize: 9, marginTop: 4 }, info: { flex: 1 }, tags: { flexDirection: 'row', alignItems: 'center', gap: 6 }, category: { color: '#16805d', fontSize: 10, fontWeight: '700', flex: 1 }, rx: { color: '#a05c24', backgroundColor: '#fff0db', overflow: 'hidden', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2, fontSize: 8, fontWeight: '800' }, name: { color: '#193d31', fontSize: 15, fontWeight: '800', marginTop: 5 }, substance: { color: '#778a81', fontSize: 11, marginTop: 3 }, stock: { color: '#628275', fontSize: 10, marginTop: 5 }, bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 7 }, price: { color: '#087f5b', fontSize: 17, fontWeight: '800' }, addBtn: { width: 31, height: 31, borderRadius: 11, backgroundColor: '#087f5b', alignItems: 'center', justifyContent: 'center' }, disabled: { backgroundColor: '#b7c7bf' }, addBtnText: { color: '#fff', fontSize: 23, lineHeight: 25, fontWeight: '600' } });
