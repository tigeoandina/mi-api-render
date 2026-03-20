// app/users/[id].tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000';

interface User {
  id: number;
  nombre: string;
  email: string;
  edad: number;
  rol: string;
}

export default function UserDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [edad, setEdad] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/users/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userData = response.data.data || response.data;
      setUser(userData);
      setNombre(userData.nombre);
      setEmail(userData.email);
      setEdad(userData.edad.toString());
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!nombre || !email || !edad) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`${API_URL}/api/users/${params.id}`, {
        nombre,
        email,
        edad: parseInt(edad),
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      Alert.alert('Éxito', 'Usuario actualizado correctamente');
      setMode('view');
      fetchUser();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'No se pudo actualizar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Usuario',
      '¿Estás seguro de eliminar este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await axios.delete(`${API_URL}/api/users/${params.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              Alert.alert('Éxito', 'Usuario eliminado correctamente');
              router.back();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el usuario');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Cargando usuario...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Usuario no encontrado</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nombre *</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ingresa el nombre completo"
          placeholderTextColor="#999"
          editable={mode === 'edit'}
        />

        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="ejemplo@correo.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={mode === 'edit'}
        />

        <Text style={styles.label}>Edad *</Text>
        <TextInput
          style={styles.input}
          value={edad}
          onChangeText={setEdad}
          placeholder="Ingresa la edad"
          placeholderTextColor="#999"
          keyboardType="numeric"
          editable={mode === 'edit'}
        />

        {mode === 'edit' ? (
          <>
            <TouchableOpacity
              style={[styles.button, saving && styles.buttonDisabled]}
              onPress={handleUpdate}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Guardar Cambios</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setMode('view');
                fetchUser();
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setMode('edit')}
            >
              <Text style={styles.editButtonText}>✏️ Editar Usuario</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>🗑️ Eliminar Usuario</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>Volver</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
    paddingTop: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#0070f3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#ffc107',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  editButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    marginBottom: 20,
  },
});