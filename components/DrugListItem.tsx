// components/DrugListItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Drug } from '../types/drug';

interface Props {
  drug: Drug;
  onPress: () => void;
}

export const DrugListItem: React.FC<Props> = ({ drug, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{drug.name}</Text>
        {drug.prescription_required && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Рецепт</Text>
          </View>
        )}
      </View>
      <Text style={styles.latin}>{drug.latin_name}</Text>
      <Text style={styles.info}>{drug.form} • {drug.dosage}</Text>
      <Text style={styles.category}>{drug.category}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#008577',
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  latin: { fontSize: 14, fontStyle: 'italic', color: '#666', marginBottom: 4 },
  info: { fontSize: 14, color: '#00796B', fontWeight: '600', marginBottom: 4 },
  category: { fontSize: 12, color: '#888' },
  badge: { backgroundColor: '#FF8A65', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});