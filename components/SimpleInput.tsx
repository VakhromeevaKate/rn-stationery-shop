import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';

// Наследуем все стандартные пропсы TextInput, чтобы компонент был гибким
interface PasswordInputProps extends TextInputProps {}

export const SimpleInput: React.FC<PasswordInputProps> = ({ style, ...props }) => {
  const [isSecure, setIsSecure] = useState(true);

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#999"
        {...props}
      />
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
});