import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { signUp } from '../../services/authService';
import { useRouter, Link } from 'expo-router'; 

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [farmName, setFarmName] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !name || !farmName) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    const additionalData = { name, farmName };
    try {
      await signUp(email, password, additionalData);
      router.replace('/dashboard');
    } catch (error) {
      console.error("Erro no cadastro:", error);
      Alert.alert('Erro', 'Falha ao criar conta.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Seu Nome Completo"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        value={farmName}
        onChangeText={setFarmName}
        placeholder="Nome da Fazenda"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Senha (mínimo 6 caracteres)"
        placeholderTextColor="#888"
        secureTextEntry
      />
      <Button title="Cadastrar" onPress={handleRegister} />
      <Link href="/login" style={styles.link}>
        <Text style={styles.linkText}>Já tem uma conta? Faça login</Text>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    color: '#000',
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
  },
  linkText: {
    color: 'blue',
  }
});