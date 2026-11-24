import { request } from './apiClient';

export const sliderService = {
  /**
   * Obtiene la lista de banners del slider
   */
  async listar({ soloActivos } = {}) {
    const params = new URLSearchParams();
    if (soloActivos !== undefined) params.append('soloActivos', soloActivos);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await request(`/api/slider${queryString}`);
    return res.data || [];
  },

  /**
   * Obtiene un banner por ID
   */
  async obtenerPorId(id) {
    const res = await request(`/api/slider/${id}`);
    return res.data;
  },

  /**
   * Agrega una nueva imagen al slider
   */
  async crear(bannerData) {
    const res = await request('/api/slider', {
      method: 'POST',
      body: JSON.stringify(bannerData)
    });
    return res.data;
  },

  /**
   * Actualiza los datos de un banner
   */
  async actualizar(id, bannerData) {
    const res = await request(`/api/slider/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bannerData)
    });
    return res.data;
  },

  /**
   * Alterna el estado activo/inactivo (1 ó 0) de un banner
   */
  async cambiarEstado(id, nuevoEstado) {
    const res = await request(`/api/slider/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ activo: nuevoEstado })
    });
    return res.data;
  },

  /**
   * Elimina un banner por ID
   */
  async eliminar(id) {
    return await request(`/api/slider/${id}`, {
      method: 'DELETE'
    });
  }
};

