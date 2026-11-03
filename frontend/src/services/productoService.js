import { request } from './apiClient';

export const productoService = {
  /**
   * Obtiene la lista de productos con filtros opcionales
   */
  async listar({ categoria, search, soloActivos } = {}) {
    const params = new URLSearchParams();
    if (categoria) params.append('categoria', categoria);
    if (search) params.append('search', search);
    if (soloActivos !== undefined) params.append('soloActivos', soloActivos);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await request(`/api/productos${queryString}`);
    return res.data || [];
  },

  /**
   * Obtiene el detalle de un producto por ID
   */
  async obtenerPorId(id) {
    const res = await request(`/api/productos/${id}`);
    return res.data;
  },

  /**
   * Registra un nuevo mueble en el catálogo
   */
  async crear(productoData) {
    const res = await request('/api/productos', {
      method: 'POST',
      body: JSON.stringify(productoData)
    });
    return res.data;
  },

  /**
   * Actualiza los datos de un mueble
   */
  async actualizar(id, productoData) {
    const res = await request(`/api/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productoData)
    });
    return res.data;
  },

  /**
   * Alterna el estado activo/inactivo (1 ó 0) de un mueble
   */
  async cambiarEstado(id, nuevoEstado) {
    const res = await request(`/api/productos/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ activo: nuevoEstado })
    });
    return res.data;
  },

  /**
   * Elimina un producto por ID
   */
  async eliminar(id) {
    return await request(`/api/productos/${id}`, {
      method: 'DELETE'
    });
  }
};

