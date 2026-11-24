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
    const imagen = (data.imagen_url || data.url_imagen || '').trim();
    if (!imagen) {
      const error = new Error('La imagen para el slider es obligatoria');
      error.statusCode = 400;
      throw error;
    }
    return await sliderModel.create({
      ...data,
      url_imagen: imagen,
      imagen_url: imagen
    });
  },

  async actualizarBanner(id, data) {
    await this.obtenerPorId(id);
    const imagen = (data.imagen_url || data.url_imagen || '').trim();
    const payload = { ...data };
    if (imagen) {
      payload.url_imagen = imagen;
      payload.imagen_url = imagen;
    }
    return await sliderModel.update(id, payload);
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

