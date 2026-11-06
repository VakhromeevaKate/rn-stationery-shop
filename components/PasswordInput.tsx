import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Наследуем все стандартные пропсы TextInput, чтобы компонент был гибким
interface PasswordInputProps extends TextInputProps {}

export const PasswordInput: React.FC<PasswordInputProps> = ({ style, ...props }) => {
  const [isSecure, setIsSecure] = useState(true);

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, style]}
        secureTextEntry={isSecure}
        placeholderTextColor="#999"
        {...props} // Пробрасываем value, onChangeText, placeholder и т.д.
      />
      <TouchableOpacity style={styles.iconContainer} onPress={() => setIsSecure(!isSecure)}>
        <Ionicons
          name={isSecure ? 'eye-off' : 'eye'}
          size={24}
          color="#666"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  iconContainer: {
    padding: 5,
  },
});