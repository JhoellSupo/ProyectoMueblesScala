import { request } from './apiClient';

export const categoriaService = {
  /**
   * Obtiene todas las categorías
   */
  async listar() {
    const res = await request('/api/categorias');
    return res.data || [];
  },

  /**
   * Obtiene una categoría por ID
   */
  async obtenerPorId(id) {
    const res = await request(`/api/categorias/${id}`);
    return res.data;
  },

  /**
   * Crea una nueva categoría
   */
  async crear(categoriaData) {
    const res = await request('/api/categorias', {
      method: 'POST',
      body: JSON.stringify(categoriaData)
    });
    return res.data;
  },

  /**
   * Actualiza una categoría existente
   */
  async actualizar(id, categoriaData) {
    const res = await request(`/api/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoriaData)
    });
    return res.data;
  },

  /**
   * Elimina una categoría por ID
   */
  async eliminar(id) {
    return await request(`/api/categorias/${id}`, {
      method: 'DELETE'
    });
  }
};

