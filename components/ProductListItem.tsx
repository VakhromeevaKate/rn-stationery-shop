import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../types/product';
import { useCartStore } from '../stores/cartStore';

interface Props {
  product: Product;
  onPress: () => void;
}

export default function ProductListItem({ product, onPress }: Props) {
  const add = useCartStore((s) => s.add);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>Rx</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.category}>{product.category}</Text>

        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <Text style={styles.substance} numberOfLines={1}>
          {product.active_substance}
        </Text>

        <Text style={styles.details}>
          {product.form} · {product.dosage}
        </Text>

        <Text style={styles.manufacturer} numberOfLines={1}>
          {product.manufacturer}
        </Text>

        <Text style={styles.stock}>
          {product.stock > 0
            ? `В наличии: ${product.stock} шт.`
            : 'Нет в наличии'}
        </Text>
      </View>

      <Pressable
        style={[styles.addBtn, product.stock <= 0 && styles.disabledBtn]}
        disabled={product.stock <= 0}
        onPress={(e) => {
          e.stopPropagation();
          add(product);
        }}
      >
        <Text style={styles.addBtnText}>+</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 14,
    marginHorizontal: 12,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#163c2d',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5eee9',
  },
  icon: {
    width: 54,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#e3f3e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: '#21734a',
    fontSize: 20,
    fontWeight: '800',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  category: {
    fontSize: 10,
    color: '#478363',
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#193b2c',
    marginBottom: 3,
  },
  substance: {
    fontSize: 12,
    color: '#4d6659',
    marginBottom: 3,
  },
  details: {
    fontSize: 12,
    color: '#53665b',
  },
  manufacturer: {
    fontSize: 11,
    color: '#78877e',
    marginTop: 4,
  },
  stock: {
    fontSize: 11,
    color: '#278052',
    marginTop: 5,
    fontWeight: '600',
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#23794f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBtn: {
    backgroundColor: '#aab7af',
  },
  addBtnText: {
    color: '#fff',
    fontSize: 24,
    lineHeight: 27,
    fontWeight: '600',
  },
});