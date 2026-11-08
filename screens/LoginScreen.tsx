import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { usePreventScreenCapture } from 'expo-screen-capture';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../types/navigation';
import PasswordInput from '../components/PasswordInput';
import {
  requestDeviceCode,
  authorizeDevice,
  getGitHubUser,
  type DeviceCode,
} from '../services/githubAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const GREEN = '#087f5b';

export default function LoginScreen({ navigation }: Props) {
  usePreventScreenCapture();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [githubLoading, setGithubLoading] = useState(false);
  const [device, setDevice] = useState<DeviceCode | null>(null);
  const [githubStatus, setGithubStatus] = useState('');

  const openCatalog = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'ProductList' }],
    });
  };

  const handleLogin = () => {
    if (login.trim() === 'admin' && password === '123456') {
      setError('');
      openCatalog();
      return;
    }

    setError('Неверный логин или пароль');
  };

  const handleGitHubLogin = async () => {
    try {
      setGithubLoading(true);
      setError('');
      setDevice(null);
      setGithubStatus('Запрашиваем код GitHub...');

      const deviceCode = await requestDeviceCode();

      setDevice(deviceCode);
      setGithubStatus('Ожидаем подтверждения на GitHub');

      await Linking.openURL(deviceCode.verification_uri);

      const accessToken = await authorizeDevice(deviceCode);
      const user = await getGitHubUser(accessToken);

      setGithubStatus(`Вы вошли как ${user.login}`);

      Alert.alert(
        'Авторизация успешна',
        `Добро пожаловать, ${user.name || user.login}!`,
        [{ text: 'Продолжить', onPress: openCatalog }],
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Не удалось войти через GitHub',
      );
      setDevice(null);
      setGithubStatus('');
    } finally {
      setGithubLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>+</Text>
        </View>

        <Text style={styles.brand}>PHARMACY</Text>
        <Text style={styles.title}>С возвращением</Text>
        <Text style={styles.subtitle}>
          Войдите в аккаунт, чтобы продолжить
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Логин</Text>

          <TextInput
            value={login}
            onChangeText={(value) => {
              setLogin(value);
              setError('');
            }}
            placeholder="Введите логин"
            placeholderTextColor="#91a39a"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />

          <Text style={styles.label}>Пароль</Text>

          <PasswordInput
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setError('');
            }}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Войти в аккаунт</Text>
          </Pressable>

          <View style={styles.separator}>
            <View style={styles.line} />
            <Text style={styles.separatorText}>ИЛИ</Text>
            <View style={styles.line} />
          </View>

          <Pressable
            onPress={handleGitHubLogin}
            disabled={githubLoading}
            style={({ pressed }) => [
              styles.githubButton,
              pressed && styles.buttonPressed,
              githubLoading && styles.disabled,
            ]}
          >
            <Text style={styles.githubIcon}>●</Text>
            <Text style={styles.githubButtonText}>
              {githubLoading ? 'Ожидаем GitHub...' : 'Войти через GitHub'}
            </Text>
          </Pressable>

          {device && (
            <View style={styles.deviceBox}>
              <Text style={styles.deviceTitle}>
                Подтвердите вход на GitHub
              </Text>
              <Text style={styles.deviceCode}>{device.user_code}</Text>
              <Text style={styles.deviceHint}>
                Введите этот код на открывшейся странице GitHub
              </Text>
              <Pressable
                onPress={() => Linking.openURL(device.verification_uri)}
              >
                <Text style={styles.deviceLink}>
                  Открыть GitHub ещё раз
                </Text>
              </Pressable>
            </View>
          )}

          {githubStatus ? (
            <Text style={styles.status}>{githubStatus}</Text>
          ) : null}
        </View>

        <View style={styles.demo}>
          <Text style={styles.demoTitle}>Данные для демонстрации</Text>
          <Text style={styles.demoText}>Логин: admin</Text>
          <Text style={styles.demoText}>Пароль: 123456</Text>
        </View>

        <Text style={styles.footer}>
          Ваше здоровье — наша забота
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f4f8f6',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 26,
    paddingVertical: 30,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 13,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 43,
    fontWeight: '300',
    lineHeight: 52,
  },
  brand: {
    textAlign: 'center',
    color: GREEN,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 4,
  },
  title: {
    color: '#163c30',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 35,
  },
  subtitle: {
    color: '#71857b',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 9,
    marginBottom: 32,
  },
  form: {
    gap: 11,
  },
  label: {
    color: '#25483b',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 5,
  },
  input: {
    height: 54,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dce8e2',
    borderRadius: 14,
    paddingHorizontal: 15,
    color: '#173d30',
    fontSize: 15,
  },
  error: {
    color: '#c0392b',
    fontSize: 13,
    marginTop: 3,
  },
  button: {
    height: 54,
    backgroundColor: GREEN,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#dce8e2',
  },
  separatorText: {
    color: '#91a39a',
    fontSize: 11,
    fontWeight: '700',
  },
  githubButton: {
    height: 54,
    backgroundColor: '#202a25',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  githubIcon: {
    color: '#ffffff',
    fontSize: 19,
  },
  githubButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.6,
  },
  deviceBox: {
    backgroundColor: '#e5f2eb',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  deviceTitle: {
    color: '#245342',
    fontWeight: '800',
    fontSize: 13,
  },
  deviceCode: {
    color: GREEN,
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: 3,
    marginVertical: 9,
  },
  deviceHint: {
    color: '#557167',
    fontSize: 12,
    textAlign: 'center',
  },
  deviceLink: {
    color: GREEN,
    fontWeight: '800',
    fontSize: 13,
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  status: {
    color: '#557167',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  demo: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e5f2eb',
    borderRadius: 14,
  },
  demoTitle: {
    color: '#245342',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 7,
  },
  demoText: {
    color: '#557167',
    fontSize: 12,
    marginTop: 3,
  },
  footer: {
    color: '#91a39a',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 25,
  },
});