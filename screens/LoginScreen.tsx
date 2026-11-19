import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { usePreventScreenCapture } from 'expo-screen-capture';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const GITHUB_CLIENT_ID = 'Ov23liWcCmexy1bbqfVS';

type DeviceResponse = {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
};

type TokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

const wait = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export default function LoginScreen({ navigation }: Props) {
  usePreventScreenCapture();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const handleLogin = () => {
    if (login.trim() === 'admin' && password === '123456') {
      navigation.replace('ProductList');
    } else {
      if (Platform.OS === 'web') {
        window.alert('Неверный логин или пароль');
      } else {
        Alert.alert('Ошибка входа', 'Неверный логин или пароль');
      }
    }
  };

  const handleGitHubLogin = async () => {
    if (githubLoading) return;

    setGithubLoading(true);

    try {
      // Получаем код устройства от GitHub
      const deviceResponse = await fetch(
        'https://github.com/login/device/code',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: new URLSearchParams({
            client_id: GITHUB_CLIENT_ID,
            scope: 'read:user',
          }).toString(),
        }
      );

      const deviceData: DeviceResponse = await deviceResponse.json();

      if (!deviceData.device_code) {
        throw new Error('Не удалось получить код GitHub');
      }

      // Показываем пользователю код подтверждения
      if (Platform.OS === 'web') {
        window.alert(
          `Откройте ${deviceData.verification_uri}\n\n` +
          `Введите код: ${deviceData.user_code}\n\n` +
          'После подтверждения вернитесь в приложение.'
        );
      } else {
        Alert.alert(
          'Подтверждение GitHub',
          `Введите этот код на GitHub:\n\n${deviceData.user_code}`,
          [
            {
              text: 'Открыть GitHub',
              onPress: () => {
                Linking.openURL(deviceData.verification_uri);
              },
            },
          ]
        );
      }

      // Проверяем подтверждение входа
      let interval = deviceData.interval * 1000;
      const expiresAt = Date.now() + deviceData.expires_in * 1000;

      while (Date.now() < expiresAt) {
        await wait(interval);

        const tokenResponse = await fetch(
          'https://github.com/login/oauth/access_token',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: new URLSearchParams({
              client_id: GITHUB_CLIENT_ID,
              device_code: deviceData.device_code,
              grant_type:
                'urn:ietf:params:oauth:grant-type:device_code',
            }).toString(),
          }
        );

        const tokenData: TokenResponse = await tokenResponse.json();

        if (tokenData.access_token) {
          // Проверяем пользователя GitHub
          const userResponse = await fetch('https://api.github.com/user', {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: `Bearer ${tokenData.access_token}`,
            },
          });

          if (!userResponse.ok) {
            throw new Error('Не удалось получить профиль GitHub');
          }

          const userData = await userResponse.json();

          if (Platform.OS === 'web') {
            window.alert(`Успешный вход через GitHub: ${userData.login}`);
          }

          navigation.replace('ProductList');
          return;
        }

        if (tokenData.error === 'authorization_pending') {
          continue;
        }

        if (tokenData.error === 'slow_down') {
          interval += 5000;
          continue;
        }

        if (tokenData.error === 'access_denied') {
          throw new Error('Вы отменили авторизацию GitHub');
        }

        if (tokenData.error === 'expired_token') {
          throw new Error('Время действия кода истекло. Попробуйте снова.');
        }

        throw new Error(
          tokenData.error_description || 'Ошибка авторизации GitHub'
        );
      }

      throw new Error('Время действия кода истекло. Попробуйте снова.');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Неизвестная ошибка';

      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert('Ошибка GitHub', message);
      }
    } finally {
      setGithubLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.content}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Аптека</Text>
          <Text style={styles.subtitle}>Войдите в свой аккаунт</Text>

          <Text style={styles.label}>Логин</Text>
          <TextInput
            style={styles.input}
            placeholder="Введите логин"
            value={login}
            onChangeText={setLogin}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Пароль</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Введите пароль"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.showButton}
            >
              <Text style={styles.showButtonText}>
                {showPassword ? 'Скрыть' : 'Показать'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Войти</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>или</Text>

          <TouchableOpacity
            style={styles.githubButton}
            onPress={handleGitHubLogin}
            disabled={githubLoading}
          >
            <Text style={styles.githubButtonText}>
              {githubLoading ? 'Ожидание GitHub...' : 'Войти через GitHub'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.hint}>
            Тестовый вход: admin / 123456
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#64748b',
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 14,
    marginBottom: 18,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    marginBottom: 22,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
  },
  showButton: {
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  showButtonText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    color: '#94a3b8',
    marginVertical: 16,
  },
  githubButton: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  githubButtonText: {
    color: '#1e293b',
    fontWeight: '600',
    fontSize: 15,
  },
  hint: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 20,
  },
});