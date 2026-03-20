// src/config/api.ts

export const API_URL = 'http://localhost:3000';

export const ENDPOINTS = {
  USERS: `${API_URL}/api/users`,
  HEALTH: `${API_URL}/health`,
};

export default {
  API_URL,
  ENDPOINTS,
};