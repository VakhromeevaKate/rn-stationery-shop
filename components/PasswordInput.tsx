import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, TextInputProps } from 'react-native';

type PasswordInputProps = TextInputProps;

export const PasswordInput: React.FC<PasswordInputProps> = ({ style, ...props }) => {
  const [isSecure, setIsSecure] = useState(true);

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, style]}
        secureTextEntry={isSecure}
        placeholderTextColor="#999"
        autoCapitalize="none"
        {...props}
      />
      <TouchableOpacity style={styles.toggle} onPress={() => setIsSecure((prev) => !prev)}>
        <Text style={styles.toggleText}>{isSecure ? 'Показать' : 'Скрыть'}</Text>
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
  toggle: {
    paddingLeft: 10,
  },
  toggleText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
});
