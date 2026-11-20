import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePreventScreenCapture } from "expo-screen-capture";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const GITHUB_CLIENT_ID = "Ov23liwLuJZeeS43nsAT";

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint: `https://github.com/settings/connections/applications/${GITHUB_CLIENT_ID}`,
};

type LoginScreenProps = {
  onLoginSuccess?: () => void;
};

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  usePreventScreenCapture();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const redirectUri = makeRedirectUri();
  console.log("GITHUB REDIRECT URI:", redirectUri);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: GITHUB_CLIENT_ID,
      scopes: ["read:user", "user:email"],
      redirectUri,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      if (code) {
        Alert.alert("GitHub OAuth", "Авторизация через GitHub прошла успешно!");
        onLoginSuccess?.();
      }
    } else if (response?.type === "error") {
      Alert.alert("Ошибка GitHub", response.error?.message || "Не удалось войти");
    }
  }, [response, onLoginSuccess]);

  const handleLogin = () => {
    if (!login.trim() || !password.trim()) {
      Alert.alert("Ошибка", "Введите логин и пароль");
      return;
    }

    Alert.alert("Успешный вход", `Добро пожаловать, ${login}!`);
    onLoginSuccess?.();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Вход в аккаунт</Text>

        <TextInput
          style={styles.input}
          placeholder="Логин"
          placeholderTextColor="#888"
          value={login}
          onChangeText={setLogin}
          autoCapitalize="none"
        />

        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Пароль"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={isPasswordHidden}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setIsPasswordHidden((prev) => !prev)}
          >
            <Text style={styles.toggleText}>
              {isPasswordHidden ? "Показать" : "Скрыть"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Войти</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>или</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity
          style={[styles.githubButton, !request && styles.disabledButton]}
          disabled={!request}
          onPress={() => promptAsync()}
        >
          <Text style={styles.githubButtonText}>Войти через GitHub</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    gap: 14,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
    textAlign: "center",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#d0d5dd",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#111",
    backgroundColor: "#fff",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d0d5dd",
    borderRadius: 10,
    backgroundColor: "#fff",
    height: 48,
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#111",
  },
  toggleButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  toggleText: {
    color: "#007aff",
    fontWeight: "600",
    fontSize: 14,
  },
  primaryButton: {
    height: 48,
    backgroundColor: "#007aff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 4,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#e4e7ec",
  },
  dividerText: {
    color: "#667085",
    fontSize: 14,
  },
  githubButton: {
    height: 48,
    backgroundColor: "#24292f",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  githubButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
});