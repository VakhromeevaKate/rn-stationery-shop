import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Alert, TextInputChangeEvent } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';
import { useAuth } from '../auth/AuthContext';
import { usePreventScreenCapture } from 'expo-screen-capture';
import { Credentials } from '../types/common';
import { PasswordInput } from '../components/PasswordInput';
import { SimpleInput } from '../components/SimpleInput';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
};

export default function AuthScreen() {
  usePreventScreenCapture();

  const { signIn } = useAuth();
  const redirectUri = makeRedirectUri({ scheme: 'stationeryshop', path: 'auth' });
  const [credentionals, setCredentionals] = useState<Credentials | null>(null);

  const hanleLoginWithCredentionals = () => {
    if (credentionals?.login === 'admin' && credentionals?.password === 'password') {
      signIn('mock-admin-token-12345');
    } else {
      Alert.alert('Неверный логин или пароль')
    }
  }

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.GITHUB_CLIENT_ID,
      scopes: ['read:user', 'user:email'],
      redirectUri,
      responseType: ResponseType.Code,
    },
    discovery,
  );

  useEffect(() => {
    if (response?.type === 'success') {
      signIn(response.params.code); // в проде — обмен на токен через бэкенд
    } else if (response?.type === 'error') {
      Alert.alert('Ошибка', response.error?.message ?? 'unknown');
    }
  }, [response]);

  return (
    <View style={styles.c}>
      <Text style={styles.t}>Магазин канцтоваров</Text>
      <Text style={styles.s}>Войдите, чтобы продолжить</Text>
      <SimpleInput placeholder='логин' value={credentionals?.login} onChangeText={(e) => setCredentionals({...credentionals, login: e})} />
      <PasswordInput placeholder='пароль' value={credentionals?.password} onChangeText={(e) => setCredentionals({...credentionals, password: e})} />
      <Pressable
        style={[styles.bl, !request && styles.bd]}
        disabled={!request}
        onPress={() => hanleLoginWithCredentionals()}
      >
        {request ? <Text style={styles.bt}>Войти</Text> : <ActivityIndicator color="#fff" />}
      </Pressable>
      <Text style={styles.s}>
        или
      </Text>
      <Pressable
        style={[styles.b, !request && styles.bd]}
        disabled={!request}
        onPress={() => promptAsync()}
      >
        {request ? <Text style={styles.bt}>Войти через GitHub</Text> : <ActivityIndicator color="#fff" />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  t: { fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  s: { fontSize: 15, color: '#666', textAlign: 'center', marginVertical: 16 },
  b: { backgroundColor: '#24292e', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  bl: { backgroundColor: 'blue', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  bd: { opacity: 0.5 },
  bt: { color: '#fff', fontSize: 16, fontWeight: '700' },
});