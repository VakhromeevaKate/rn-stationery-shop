import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'github_access_token';

export const saveToken = (t: string) => Platform.OS === 'web' ? window.localStorage.setItem('TOKEN_KEY', t) : SecureStore.setItemAsync(TOKEN_KEY, t);
export const getToken = () => Platform.OS === 'web' ? window.localStorage.getItem('TOKEN_KEY') : SecureStore.getItemAsync(TOKEN_KEY);
export const removeToken = () => Platform.OS === 'web' ? window.localStorage.removeItem('TOKEN_KEY') : SecureStore.deleteItemAsync(TOKEN_KEY);
