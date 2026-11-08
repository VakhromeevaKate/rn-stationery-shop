import CryptoJS from 'crypto-js';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ENCRYPTION_KEY_NAME = 'storage_encryption_key';

// Получить или создать ключ шифрования (хранится в SecureStore)
async function getEncryptionKey(): Promise<string> {
  return CryptoJS.lib.WordArray.random(32).toString();
}

// Зашифровать
export async function setEncrypted(value: unknown): Promise<string> {
  const encryptionKey = await getEncryptionKey();
  const json = JSON.stringify(value);
  return CryptoJS.AES.encrypt(json, encryptionKey).toString();
}

// Расшифровать
export async function getEncrypted(ciphertext: string): Promise<string | null> {
    if (!ciphertext) return null;
    const encryptionKey = await getEncryptionKey();
    const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey);
    const json = bytes.toString(CryptoJS.enc.Utf8);
    return json ? (JSON.parse(json) as string) : null;
}

// Зашифровать и сохранить
export async function setEncryptedItem(key: string, value: unknown): Promise<void> {
  const encryptionKey = await getEncryptionKey();
  const json = JSON.stringify(value);
  const ciphertext = CryptoJS.AES.encrypt(json, encryptionKey).toString();
  await AsyncStorage.setItem(key, ciphertext);
}

// Расшифровать и прочитать
export async function getEncryptedItem<T>(key: string): Promise<T | null> {
  const ciphertext = await AsyncStorage.getItem(key);
  if (!ciphertext) return null;
  const encryptionKey = await getEncryptionKey();
  const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey);
  const json = bytes.toString(CryptoJS.enc.Utf8);
  return json ? (JSON.parse(json) as T) : null;
}