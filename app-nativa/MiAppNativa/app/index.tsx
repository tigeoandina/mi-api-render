// app/users/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000';

interface User {
  id: number;
  nombre: string;
  email: string;
  edad: number;
  rol: string;
}

export default function UsersListScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = useCallback(async (signal?: AbortSignal) => {
    try {
      console.log('🔍 Iniciando fetchUsers...');
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.log('❌ No hay token');
        Alert.alert('Error', 'No hay sesión iniciada');
        router.replace('/login');
        return;
      }

      console.log('✅ Token encontrado');

      const response = await axios.get(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal,
      });

      console.log('✅ Response status:', response.status);
      console.log('✅ Response data:', response.data);

      // Más robusto: acepta tanto { data: [...] } como respuesta plana [...]
      const usersData = Array.isArray(response.data)
        ? response.data
        : response.data?.data ?? [];

      console.log('📊 Usuarios recibidos:', usersData.length);

      setUsers(usersData);
    } catch (error) {
      const err = error as AxiosError;

      console.error('❌ Error en fetchUsers:', err.message);
      if (err.response) {
        console.error('   Status:', err.response.status);
        console.error('   Data:', err.response.data);
      }

      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log('🔒 Sesión inválida o no autorizada → redirigiendo a login');
        await AsyncStorage.removeItem('token');
        Alert.alert('Sesión expirada', 'Por favor inicia sesión nuevamente');
        router.replace('/login');
        return;
      }

      Alert.alert('Error', 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    console.log('📌 useEffect ejecutándose');

    const controller = new AbortController();

    fetchUsers(controller.signal);

    return () => {
      console.log('🧹 Limpiando fetchUsers (abort)');
      controller.abort();
    };
  }, [fetchUsers]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleDelete = (id: number) => {
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
              if (!token) {
                router.replace('/login');
                return;
              }

              await axios.delete(`${API_URL}/api/users/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              Alert.alert('Éxito', 'Usuario eliminado correctamente');
              fetchUsers();
            } catch (error) {
              console.error('❌ Error al eliminar usuario:', error);
              Alert.alert('Error', 'No se pudo eliminar el usuario');
            }
          },
        },
      ]
    );
  };

  const renderUser = ({ item }: { item: User }) => {
    console.log('🎨 Renderizando:', item.nombre);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/users/${item.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.nombre}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <Text style={styles.userAge}>Edad: {item.edad} años</Text>
          </View>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={(e) => {
                e.stopPropagation();
                router.push(`/users/${item.id}/edit`); // ← sugerencia: ruta específica para editar
              }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.editButtonText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  console.log('📝 Renderizando componente. Users:', users.length);

  if (loading) {
    console.log('⏳ Mostrando loading...');
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0070f3" />
        <Text style={styles.loadingText}>Cargando usuarios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0070f3']}
            tintColor="#0070f3"
          />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay usuarios registrados</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/create-user')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userAge: {
    fontSize: 14,
    color: '#0070f3',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    backgroundColor: '#ffc107',
    padding: 10,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 20,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0070f3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
});