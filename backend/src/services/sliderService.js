import { sliderModel } from '../models/sliderModel.js';

export const sliderService = {
  async listarBanners({ soloActivos } = {}) {
    return await sliderModel.getAll({ soloActivos });
  },

  async obtenerPorId(id) {
    const banner = await sliderModel.getById(id);
    if (!banner) {
      const error = new Error('Imagen de slider no encontrada');
      error.statusCode = 404;
      throw error;
    }
    return banner;
  },

  async crearBanner(data) {
    if (!data.imagen_url || !data.imagen_url.trim()) {
      const error = new Error('La URL de la imagen es obligatoria');
      error.statusCode = 400;
      throw error;
    }
    return await sliderModel.create(data);
  },

  async actualizarBanner(id, data) {
    await this.obtenerPorId(id);
    return await sliderModel.update(id, data);
  },

  async cambiarEstado(id, activo) {
    await this.obtenerPorId(id);
    return await sliderModel.updateStatus(id, activo);
  },

  async eliminarBanner(id) {
    await this.obtenerPorId(id);
    return await sliderModel.delete(id);
  }
};

