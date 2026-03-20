// src/services/authService.js

import axios from 'axios';
import { API_URL } from '../config/api';

// ==========================================
// DETECTAR SI ES WEB
// ==========================================
const isWeb = typeof window !== 'undefined';

// ==========================================
// STORAGE - Web usa localStorage, Móvil usa AsyncStorage
// ==========================================
const storage = {
  getItem: async (key) => {
    if (isWeb) {
      return localStorage.getItem(key);
    }
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    return await AsyncStorage.getItem(key);
  },
  
  setItem: async (key, value) => {
    if (isWeb) {
      localStorage.setItem(key, value);
    } else {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      await AsyncStorage.setItem(key, value);
    }
  },
  
  removeItem: async (key) => {
    if (isWeb) {
      localStorage.removeItem(key);
    } else {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      await AsyncStorage.removeItem(key);
    }
  }
};

// ==========================================
// ⚡ CONFIGURAR AXIOS INTERCEPTOR (SÍNCRONO PARA WEB)
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
// FUNCIONES DE AUTENTICACIÓN
// ==========================================

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    
    if (response.data.success) {
      await storage.setItem('token', response.data.data.token);
      await storage.setItem('user', JSON.stringify(response.data.data.user));
      console.log('✅ Login exitoso - Token guardado');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error en login:', error);
    throw error;
  }
};

export const register = async (nombre, email, password, edad) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, {
      nombre, email, password, edad
    });
    
    if (response.data.success) {
      await storage.setItem('token', response.data.data.token);
      await storage.setItem('user', JSON.stringify(response.data.data.user));
      console.log('✅ Registro exitoso - Token guardado');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error en registro:', error);
    throw error;
  }
};

export const logout = async () => {
  await storage.removeItem('token');
  await storage.removeItem('user');
  console.log('🚪 Logout completado');
};

export const getCurrentUser = async () => {
  const userStr = await storage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = async () => {
  return await storage.getItem('token');
};

export default { 
  login, 
  register, 
  logout, 
  getCurrentUser,
  getToken 
};