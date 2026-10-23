// components/DrugDetailsCard.tsx
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Drug } from '../types/drug';

interface Props {
  drug: Drug;
}

export const DrugDetailsCard: React.FC<Props> = ({ drug }) => {
  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{drug.name}</Text>
        {drug.prescription_required && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>По рецепту</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.latin}>{drug.latin_name}</Text>
      <Text style={styles.category}>{drug.category}</Text>

      <View style={styles.specsContainer}>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Форма</Text>
          <Text style={styles.specValue}>{drug.form}</Text>
        </View>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Дозировка</Text>
          <Text style={styles.specValue}>{drug.dosage}</Text>
        </View>
      </View>

      <Text style={styles.manufacturer}>Производитель: <Text style={styles.bold}>{drug.manufacturer}</Text></Text>
      <Text style={styles.substance}>Активное вещество: <Text style={styles.bold}>{drug.active_substance}</Text></Text>
      
      <Text style={styles.stock}>В наличии: {drug.stock} шт.</Text>
      
      <Text style={styles.sectionTitle}>Описание</Text>
      <Text style={styles.desc}>{drug.description}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrap: { padding: 20, paddingBottom: 40, backgroundColor: '#fff' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  name: { fontSize: 24, fontWeight: '700', color: '#333', flex: 1, marginRight: 8 },
  latin: { fontSize: 16, fontStyle: 'italic', color: '#666', marginBottom: 8 },
  category: { fontSize: 14, color: '#00796B', fontWeight: '600', marginBottom: 16 },
  
  specsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  specItem: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  specLabel: { fontSize: 12, color: '#888', marginBottom: 2 },
  specValue: { fontSize: 16, fontWeight: '600', color: '#333' },

  manufacturer: { fontSize: 14, color: '#555', marginBottom: 6 },
  substance: { fontSize: 14, color: '#555', marginBottom: 12 },
  bold: { fontWeight: '600', color: '#333' },

  stock: { fontSize: 14, color: '#2E7D32', fontWeight: '600', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 8 },
  desc: { fontSize: 15, lineHeight: 22, color: '#444' },

  badge: { backgroundColor: '#FF8A65', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});