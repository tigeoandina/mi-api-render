// app/login.tsx
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
import { login } from '../src/services/authService';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isSubmitting = useRef(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  };

  const handleLogin = async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      Alert.alert('Campos requeridos', 'Por favor ingresa email y contraseña');
      isSubmitting.current = false;
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      Alert.alert('Email inválido', 'Por favor ingresa un correo electrónico válido');
      isSubmitting.current = false;
      return;
    }

    if (password.length < 6) {
      Alert.alert('Contraseña corta', 'La contraseña debe tener al menos 6 caracteres');
      isSubmitting.current = false;
      return;
    }

    setLoading(true);
    console.log('🔐 Iniciando proceso de login...');

    try {
      console.log('📤 Intentando autenticación con:', trimmedEmail);
      await login(trimmedEmail, password);

      console.log('✅ Login exitoso');
      router.replace('/');
    } catch (error: any) {
      console.error('❌ Error en login:', error);

      let message = 'Error al iniciar sesión';

      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Data:', error.response.data);

        const serverMsg = error.response.data?.error || error.response.data?.message;
        if (serverMsg) {
          message = serverMsg;
        } else if (error.response.status === 401) {
          message = 'Credenciales incorrectas';
        } else if (error.response.status === 403) {
          message = 'Cuenta no autorizada o bloqueada';
        } else if (error.response.status >= 500) {
          message = 'Error en el servidor. Intenta más tarde';
        }
      } else if (error.request) {
        message = 'No se pudo conectar con el servidor. Verifica tu conexión';
      }

      Alert.alert('No pudimos iniciar sesión', message);
    } finally {
      setLoading(false);
      isSubmitting.current = false;
      console.log('🏁 Proceso de login finalizado');
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
          <Text style={styles.title}>🌍 PMAC/EMAC - TGP</Text>
          <Text style={styles.subtitle}>
            Sistema de Gestión de Información Ambiental
          </Text>
        </View>

        <View style={styles.form}>
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
            textContentType="emailAddress"
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#999"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => router.push('/register')}
            activeOpacity={0.7}
          >
            <Text style={styles.registerText}>
              ¿No tienes cuenta? <Text style={{ fontWeight: 'bold' }}>Regístrate</Text>
            </Text>
          </TouchableOpacity>

          {/* Opcional: enlace a recuperar contraseña (puedes implementar después) */}
          {/* <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity> */}
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
  registerButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  registerText: {
    color: '#0070f3',
    fontSize: 16,
  },
  // forgotButton: {
  //   marginTop: 16,
  //   alignItems: 'center',
  // },
  // forgotText: {
  //   color: '#666',
  //   fontSize: 14,
  //   textDecorationLine: 'underline',
  // },
});