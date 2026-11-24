import { request } from './apiClient';

export const historialService = {
  // Obtener historial de modificaciones de muebles
  async listar(limit = 100) {
    const res = await request(`/api/historial-muebles?limit=${limit}`);
    return res.data || [];
  },

  // Limpiar historial
  async limpiar() {
    const res = await request('/api/historial-muebles/limpiar', {
      method: 'POST'
    });
    return res;
  }
};

