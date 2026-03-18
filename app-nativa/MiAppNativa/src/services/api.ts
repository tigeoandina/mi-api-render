// src/services/api.ts

import axios from 'axios';
import { API_URL, ENDPOINTS } from '../config/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicio de Usuarios
export const userService = {
  getAll: () => api.get('/api/users'),
  getById: (id: number) => api.get(`/api/users/${id}`),
  create: (data: { nombre: string; email: string; edad: number }) => 
    api.post('/api/users', data),
  update: (id: number, data: { nombre: string; email: string; edad: number }) => 
    api.put(`/api/users/${id}`, data),
  delete: (id: number) => api.delete(`/api/users/${id}`),
};

export default api;