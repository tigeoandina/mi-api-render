// src/services/api.ts

import axios from 'axios';
import { API_URL } from '../config/api';

// ==========================================
// DETECTAR SI ES WEB
// ==========================================
const isWeb = typeof window !== 'undefined';

// ==========================================
// STORAGE HELPERS
// ==========================================
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (isWeb) {
      return localStorage.getItem(key);
    }
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    return await AsyncStorage.getItem(key);
  },
  
  setItem: async (key: string, value: string): Promise<void> => {
    if (isWeb) {
      localStorage.setItem(key, value);
    } else {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      await AsyncStorage.setItem(key, value);
    }
  },
  
  removeItem: async (key: string): Promise<void> => {
    if (isWeb) {
      localStorage.removeItem(key);
    } else {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      await AsyncStorage.removeItem(key);
    }
  }
};

// ==========================================
// ⚡ CONFIGURAR INTERCEPTOR (SÍNCRONO PARA WEB)
// ==========================================
axios.interceptors.request.use(
  (config) => {
    if (isWeb) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================
// CREAR INSTANCIA DE AXIOS
// ==========================================
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// SERVICIO DE USUARIOS
// ==========================================
export const userService = {
  getAll: () => api.get('/api/users'),
  getById: (id: number) => api.get(`/api/users/${id}`),
  create: (data: { nombre: string; email: string; edad: number }) =>
    api.post('/api/users', data),
  update: (id: number, data: { nombre: string; email: string; edad: number }) =>
    api.put(`/api/users/${id}`, data),
  delete: (id: number) => api.delete(`/api/users/${id}`),
};

// ==========================================
// SERVICIO DE AUTENTICACIÓN
// ==========================================
export const authService = {
  login: async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    if (response.data.success) {
      await storage.setItem('token', response.data.data.token);
      await storage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },
  
  register: async (nombre: string, email: string, password: string, edad: number) => {
    const response = await axios.post(`${API_URL}/api/auth/register`, {
      nombre, email, password, edad
    });
    if (response.data.success) {
      await storage.setItem('token', response.data.data.token);
      await storage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },
  
  logout: async () => {
    await storage.removeItem('token');
    await storage.removeItem('user');
  },
  
  getToken: () => storage.getItem('token'),
};

export default api;