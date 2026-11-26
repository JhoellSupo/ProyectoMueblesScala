import { request } from './apiClient';

const STORAGE_KEY = 'scala_admin_user';
const TOKEN_KEY = 'scala_admin_token';

export const authService = {
  /**
   * Autentica al usuario contra el backend y almacena el token JWT
   */
  async login({ username, password }) {
    const res = await request('/api/usuario/login', {
      method: 'POST',
      body: JSON.stringify({
        username: username.trim(),
        correo: username.trim(),
        password
      })
    });

    const user = res.user || { username: username.trim(), rol: 'admin' };
    
    // Guardar token JWT si fue provisto por el backend
    if (res.token) {
      this.setToken(res.token);
    }
    
    this.setStoredUser(user);
    return user;
  },

  /**
   * Obtiene el token JWT actual
   */
  getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY) || null;
    } catch {
      return null;
    }
  },

  /**
   * Guarda o elimina el token JWT
   */
  setToken(token) {
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch (e) {
      console.error('Error al guardar token JWT:', e);
    }
  },

  /**
   * Obtiene el usuario guardado en localStorage
   */
  getStoredUser() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },

  /**
   * Guarda el usuario en localStorage
   */
  setStoredUser(user) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Error al guardar sesión:', e);
    }
  },

  /**
   * Elimina la sesión y el token de localStorage
   */
  logout() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.error('Error al cerrar sesión:', e);
    }
  }
};
