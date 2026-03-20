// app/register.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000';

export default function RegisterScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [edad, setEdad] = useState('');
  const [loading, setLoading] = useState(false);

  const isSubmitting = useRef(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  };

  const handleRegister = async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    // Limpieza básica
    const trimmedNombre = nombre.trim();
    const trimmedEmail = email.trim();
    const trimmedEdad = edad.trim();

    if (!trimmedNombre || !trimmedEmail || !password || !trimmedEdad) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      isSubmitting.current = false;
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      Alert.alert('Error', 'El correo electrónico no es válido');
      isSubmitting.current = false;
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      isSubmitting.current = false;
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      isSubmitting.current = false;
      return;
    }

    const edadNum = parseInt(trimmedEdad, 10);
    if (isNaN(edadNum) || edadNum < 13 || edadNum > 120) {
      Alert.alert('Error', 'Ingresa una edad válida (entre 13 y 120 años)');
      isSubmitting.current = false;
      return;
    }

    setLoading(true);
    console.log('🔐 Iniciando registro...');

    try {
      console.log('📤 Enviando datos al backend:', { nombre: trimmedNombre, email: trimmedEmail, edad: edadNum });

      const response = await axios.post(`${API_URL}/api/auth/register`, {
        nombre: trimmedNombre,
        email: trimmedEmail,
        password,
        edad: edadNum,
      });

      console.log('✅ Registro exitoso - Status:', response.status);

      const { token, user } = response.data.data || {};

      if (!token || !user) {
        throw new Error('Respuesta del servidor incompleta');
      }

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      console.log('💾 Token y usuario guardados en AsyncStorage');

      // Limpiar solo después de éxito
      setNombre('');
      setEmail('');
      setEdad('');
      setPassword('');
      setConfirmPassword('');

      Alert.alert('Éxito', 'Usuario registrado correctamente', [
        {
          text: 'Continuar',
          onPress: () => {
            console.log('➡️ Redirigiendo a pantalla principal');
            router.replace('/');
          },
        },
      ]);
    } catch (error) {
      const err = error as AxiosError;
      console.error('❌ Error en registro:', err.message);

      let message = 'Error al registrar usuario';

      if (err.response) {
        console.error('   Status:', err.response.status);
        console.error('   Data:', err.response.data);

        const serverError = (err.response.data as any)?.error || (err.response.data as any)?.message;
        if (serverError) {
          message = serverError;
        } else if (err.response.status === 409) {
          message = 'El correo ya está registrado';
        } else if (err.response.status === 400) {
          message = 'Datos inválidos. Verifica la información';
        }
      }

      Alert.alert('Error', message);
    } finally {
      setLoading(false);
      isSubmitting.current = false;
      console.log('🏁 Proceso de registro finalizado');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>📝 PMAC/EMAC - TGP</Text>
          <Text style={styles.subtitle}>
            Sistema de Gestión de Información Ambiental
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ingresa tu nombre"
            placeholderTextColor="#999"
            autoCapitalize="words"
            autoCorrect={false}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="tu@email.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
          />

          <Text style={styles.label}>Edad</Text>
          <TextInput
            style={styles.input}
            value={edad}
            onChangeText={(text) => {
              // Solo números
              if (/^\d*$/.test(text)) setEdad(text);
            }}
            placeholder="Ej: 28"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={3}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#999"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Confirmar Contraseña</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repite la contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Registrarse</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.loginText}>
              ¿Ya tienes cuenta? <Text style={{ fontWeight: 'bold' }}>Inicia sesión</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#0070f3',
    paddingVertical: 50,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  button: {
    backgroundColor: '#0070f3',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 32,
    shadowColor: '#0070f3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  loginButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginText: {
    color: '#0070f3',
    fontSize: 16,
  },
});