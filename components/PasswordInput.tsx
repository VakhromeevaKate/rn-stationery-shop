import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
};

export default function PasswordInput({ value, onChangeText }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Введите пароль"
        placeholderTextColor="#91a39a"
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />

      <Pressable
        onPress={() => setVisible((previous) => !previous)}
        style={styles.toggle}
        accessibilityRole="button"
        accessibilityLabel={visible ? 'Скрыть пароль' : 'Показать пароль'}
      >
        <Text style={styles.toggleText}>
          {visible ? 'Скрыть' : 'Показать'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dce8e2',
    borderRadius: 14,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#173d30',
    fontSize: 15,
  },
  toggle: {
    paddingVertical: 10,
    paddingLeft: 10,
  },
  toggleText: {
    color: '#087f5b',
    fontSize: 12,
    fontWeight: '700',
  },
});