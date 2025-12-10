import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import api from './src/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha e-mail e senha.");
      return;
    }

    setLoading(true);

    try {
      // 1. Chamada ao Backend (Rota que criamos: POST /auth/login)
      const response = await api.post('/auth/login', {
        email: email.toLowerCase(), // Garantir minusculo
        password: password
      });

      // 2. Pegar o token da resposta
      const { access_token } = response.data;
      
      // 3. Salvar no celular
      await AsyncStorage.setItem('@teto_token', access_token);
      
      // 4. Atualizar estado para "Logado"
      setToken(access_token);
      
      console.log("Token Salvo:", access_token);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Falha no Login", "Verifique suas credenciais ou se o servidor está rodando.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setToken(null);
    AsyncStorage.removeItem('@teto_token');
  }

  // --- TELA DE "DENTRO" DO APP (PÓS LOGIN) ---
  if (token) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo ao Teto! 🏠</Text>
        <Text style={styles.subtitle}>Você está autenticado.</Text>
        
        <TouchableOpacity style={styles.buttonRed} onPress={handleLogout}>
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- TELA DE LOGIN ---
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>TETO</Text>
        <Text style={styles.subtitle}>Organização sob o mesmo teto.</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="ex: thomaz@teto.app"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="******"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>ENTRAR</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Estilos básicos para não ficar feio
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    padding: 20,
  },
  form: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    elevation: 5, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4F46E5', // Indigo
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonRed: {
    backgroundColor: '#EF4444',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});