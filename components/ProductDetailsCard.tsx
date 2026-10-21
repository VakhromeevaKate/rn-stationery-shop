import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Product } from '../types/product';

export default function ProductDetailsCard({ product }: { product: Product }) {
  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <View style={styles.hero}>
        <Text style={styles.heroIcon}>Rx</Text>
        <Text style={styles.heroCaption}>ИНФОРМАЦИЯ О ПРЕПАРАТЕ</Text>
      </View>

      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.latin}>{product.latin_name}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Действующее вещество</Text>
        <Text style={styles.value}>{product.active_substance}</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Форма выпуска</Text>
          <Text style={styles.value}>{product.form}</Text>
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>Дозировка</Text>
          <Text style={styles.value}>{product.dosage}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Производитель</Text>
        <Text style={styles.value}>{product.manufacturer}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Отпуск по рецепту</Text>
        <Text style={styles.value}>
          {product.prescription_required ? 'Да, требуется рецепт' : 'Без рецепта'}
        </Text>
      </View>

      <View style={styles.stockBox}>
        <Text style={styles.stockLabel}>Наличие на складе</Text>
        <Text style={styles.stock}>
          {product.stock > 0 ? `${product.stock} шт.` : 'Нет в наличии'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Описание</Text>
        <Text style={styles.desc}>{product.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f6faf7',
    flexGrow: 1,
  },
  hero: {
    height: 150,
    borderRadius: 20,
    backgroundColor: '#dff1e6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  heroIcon: {
    fontSize: 48,
    fontWeight: '800',
    color: '#23794f',
  },
  heroCaption: {
    fontSize: 10,
    fontWeight: '700',
    color: '#478363',
    letterSpacing: 1.5,
    marginTop: 8,
  },
  category: {
    fontSize: 12,
    color: '#478363',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: '#193b2c',
    marginBottom: 4,
  },
  latin: {
    fontSize: 14,
    color: '#718177',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  section: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2ebe5',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2ebe5',
  },
  half: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#718177',
    marginBottom: 5,
  },
  value: {
    fontSize: 15,
    color: '#193b2c',
    fontWeight: '600',
  },
  stockBox: {
    marginTop: 18,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#e3f3e9',
  },
  stockLabel: {
    fontSize: 12,
    color: '#478363',
    marginBottom: 5,
  },
  stock: {
    fontSize: 20,
    fontWeight: '800',
    color: '#23794f',
  },
  desc: {
    fontSize: 15,
    lineHeight: 23,
    color: '#405248',
  },
});