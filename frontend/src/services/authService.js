import { request } from './apiClient';

const STORAGE_KEY = 'scala_admin_user';

export const authService = {
  /**
   * Autentica al usuario contra el backend
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

    const user = res.user || { username: username.trim() };
    this.setStoredUser(user);
    return user;
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
   * Elimina la sesión de localStorage
   */
  logout() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Error al cerrar sesión:', e);
    }
  }
};

