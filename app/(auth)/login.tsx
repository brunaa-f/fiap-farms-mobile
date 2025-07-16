import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { signIn } from '../../services/authService';
import { useRouter, Link } from 'expo-router'; // Importar Link

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    try {
      await signIn(email, password);
      router.replace('/dashboard');
    } catch (error) {
      console.error("Erro no login:", error);
      Alert.alert('Erro', 'Falha no login. Verifique suas credenciais.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FIAP Farms - Login</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#888" // Cor do placeholder
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Senha"
        placeholderTextColor="#888" // Cor do placeholder
        secureTextEntry
      />
      <Button title="Entrar" onPress={handleLogin} />
      <Link href="/register" style={styles.link}>
        <Text style={styles.linkText}>Não tem uma conta? Cadastre-se</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    color: '#000', // Garante que o texto digitado seja visível
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
  },
  linkText: {
    color: 'blue',
  }
});