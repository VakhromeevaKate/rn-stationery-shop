// screens/DrugListScreen.tsx
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
import { fetchDrugs } from '../api/mockDrugsAPI';
import { Drug } from '../types/drug';
import { RootStackParamList } from '../types/navigation';
import { DrugListItem } from '../components/DrugListItem';
import EmptyState from '../components/EmptyState';

type Nav = NativeStackNavigationProp<RootStackParamList, 'DrugList'>; // Обновили имя экрана в типах

export default function DrugListScreen() {
  const navigation = useNavigation<Nav>();
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchDrugs();
        if (alive) setDrugs(data);
      } catch (e) {
        if (alive) setError('Не удалось загрузить каталог лекарств');
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
        <ActivityIndicator size="large" color="#008577" />
        <Text style={styles.hint}>Загружаем каталог лекарств…</Text>
      </View>
    );
  }

  if (error) {
    return <EmptyState title="Ошибка" subtitle={error} />;
  }

  if (drugs.length === 0) {
    return <EmptyState title="Каталог пуст" />;
  }

  return (
    <FlatList
      data={drugs}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <DrugListItem
          drug={item}
          onPress={() =>
            navigation.navigate('DrugDetails', { drugId: item.id })
          }
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingVertical: 6, backgroundColor: '#F9F9F9' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  hint: { marginTop: 8, color: '#666' },
});