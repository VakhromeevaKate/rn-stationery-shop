import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';
import { useAuth } from '../auth/AuthContext';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
};

export default function AuthScreen() {
  const { signIn } = useAuth();
  const redirectUri = makeRedirectUri({ scheme: 'stationeryshop', path: 'auth' });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'Ov23liiyoWifjYvSMtK4',
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
  s: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 32 },
  b: { backgroundColor: '#24292e', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  bd: { opacity: 0.5 },
  bt: { color: '#fff', fontSize: 16, fontWeight: '700' },
});