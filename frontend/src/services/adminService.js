import { request } from './apiClient';

export const adminService = {
  // Listar todos los administradores
  async listar() {
    const res = await request('/api/usuario/administradores');
    return res.data || [];
  },

  // Crear nuevo administrador
  async crear(datos) {
    const res = await request('/api/usuario/administradores', {
      method: 'POST',
      body: JSON.stringify(datos)
    });
    return res.data;
  },

  // Cambiar estado activo/inactivo
  async cambiarEstado(id, activo) {
    const res = await request(`/api/usuario/administradores/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ activo })
    });
    return res.data;
  },

  // Eliminar administrador
  async eliminar(id) {
    const res = await request(`/api/usuario/administradores/${id}`, {
      method: 'DELETE'
    });
    return res;
  }
};

