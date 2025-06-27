// src/services/authService.js
import api from '../api';

export function getCurrentUser() {
  // Ajuste a rota conforme seu backend (ex: '/administradores/me' ou '/profile')
  return api.get('/me');
}
export async function login({ email, senha }) {
  const resp = await api.post('/login', { email, senha });
  const token = resp.data.data.token;
  localStorage.setItem('token', token);
  return resp;
}
export function logout() {
  localStorage.removeItem('token');
}
