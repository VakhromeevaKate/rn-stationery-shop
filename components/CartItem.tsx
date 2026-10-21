import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CartLine } from '../types/product';
import { useCartStore } from '../stores/cartStore';

export default function CartItem({ line }: { line: CartLine }) {
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const remove = useCartStore((s) => s.remove);

  const product = line.product;
  const id = String(product.id);

  return (
    <View style={styles.row}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>Rx</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <Text style={styles.substance}>{product.active_substance}</Text>
        <Text style={styles.details}>
          {product.form} · {product.dosage}
        </Text>
        <Text style={styles.manufacturer}>{product.manufacturer}</Text>

        <View style={styles.controls}>
          <Pressable style={styles.qtyBtn} onPress={() => decrement(id)}>
            <Text style={styles.qtyText}>−</Text>
          </Pressable>

          <Text style={styles.qty}>{line.quantity}</Text>

          <Pressable
            style={[
              styles.qtyBtn,
              line.quantity >= product.stock && styles.disabledBtn,
            ]}
            disabled={line.quantity >= product.stock}
            onPress={() => increment(id)}
          >
            <Text style={styles.qtyText}>+</Text>
          </Pressable>

          <Pressable onPress={() => remove(id)} style={styles.remove}>
            <Text style={styles.removeText}>Удалить</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 14,
    marginHorizontal: 12,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5eee9',
  },
  icon: {
    width: 52,
    height: 58,
    borderRadius: 12,
    backgroundColor: '#e3f3e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#23794f',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#193b2c',
    marginBottom: 4,
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
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#e3f3e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBtn: {
    backgroundColor: '#d5ddd8',
  },
  qtyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#23794f',
  },
  qty: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
    color: '#193b2c',
  },
  remove: {
    marginLeft: 'auto',
  },
  removeText: {
    color: '#c0392b',
    fontSize: 12,
  },
});