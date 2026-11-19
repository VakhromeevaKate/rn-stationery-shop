import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';
import { usePreventScreenCapture } from 'expo-screen-capture';
import { useAuth } from '../auth/AuthContext';
import { Credentials } from '../types/common';
import { PasswordInput } from '../components/PasswordInput';
import { SimpleInput } from '../components/SimpleInput';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
};


const GITHUB_CLIENT_ID = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID ?? '';

export default function AuthScreen() {
  usePreventScreenCapture();

  const { signIn } = useAuth();
  const redirectUri = makeRedirectUri({ scheme: 'stationeryshop', path: 'auth' });
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const handleLoginWithCredentials = () => {
    if (credentials?.login === 'admin' && credentials?.password === 'password') {
      signIn('mock-admin-token-12345');
    } else {
      Alert.alert('Неверный логин или пароль');
    }
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: GITHUB_CLIENT_ID,
      scopes: ['read:user', 'user:email'],
      redirectUri,
      responseType: ResponseType.Code,
    },
    discovery,
  );

  useEffect(() => {
    if (response?.type === 'success') {
      signIn(response.params.code);
    } else if (response?.type === 'error') {
      Alert.alert('Ошибка', String(response.error ?? 'unknown'));
    }
  }, [response]);


  const handleGithubLogin = () => {
    if (!GITHUB_CLIENT_ID) {
      Alert.alert(
        'GitHub не настроен',
        'Укажите EXPO_PUBLIC_GITHUB_CLIENT_ID в файле .env',
      );
      return;
    }
    promptAsync();
  };

  return (
    <View style={styles.c}>
      <Text style={styles.t}>Магазин канцтоваров</Text>
      <Text style={styles.s}>Войдите, чтобы продолжить</Text>
      <SimpleInput
        placeholder="логин"
        value={credentials?.login}
        onChangeText={(login) => setCredentials({ ...credentials, login })}
      />
      <PasswordInput
        placeholder="пароль"
        value={credentials?.password}
        onChangeText={(password) => setCredentials({ ...credentials, password })}
      />

      <Pressable style={styles.bl} onPress={handleLoginWithCredentials}>
        <Text style={styles.bt}>Войти</Text>
      </Pressable>

      <Text style={styles.s}>или</Text>

      <Pressable
        style={[styles.b, !request && styles.bd]}
        disabled={!request}
        onPress={handleGithubLogin}
      >
        {request ? <Text style={styles.bt}>Войти через GitHub</Text> : <ActivityIndicator color="#fff" />}
      </Pressable>

      <Text style={styles.hint}>Тестовый вход: логин admin, пароль password</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  t: { fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  s: { fontSize: 15, color: '#666', textAlign: 'center', marginVertical: 16 },
  b: { backgroundColor: '#24292e', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  bl: { backgroundColor: '#2563EB', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  bd: { opacity: 0.5 },
  bt: { color: '#fff', fontSize: 16, fontWeight: '700' },
  hint: { fontSize: 13, color: '#999', textAlign: 'center', marginTop: 24 },
});
