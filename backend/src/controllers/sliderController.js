import { sliderService } from '../services/sliderService.js';

export const sliderController = {
  // GET /api/slider
  async listar(req, res, next) {
    try {
      const { soloActivos } = req.query;
      const banners = await sliderService.listarBanners({ soloActivos });
      res.json({
        success: true,
        total: banners.length,
        data: banners
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/slider/:id
  async obtenerPorId(req, res, next) {
    try {
      const { id } = req.params;
      const banner = await sliderService.obtenerPorId(id);
      res.json({
        success: true,
        data: banner
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/slider
  async crear(req, res, next) {
    try {
      const nuevoBanner = await sliderService.crearBanner(req.body);
      res.status(201).json({
        success: true,
        message: 'Imagen del slider agregada con éxito',
        data: nuevoBanner
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/slider/:id
  async actualizar(req, res, next) {
    try {
      const { id } = req.params;
      const bannerActualizado = await sliderService.actualizarBanner(id, req.body);
      res.json({
        success: true,
        message: 'Imagen del slider actualizada',
        data: bannerActualizado
      });
    } catch (error) {
      next(error);
    }
  },

  // PATCH /api/slider/:id/estado
  async cambiarEstado(req, res, next) {
    try {
      const { id } = req.params;
      const { activo } = req.body;
      const bannerActualizado = await sliderService.cambiarEstado(id, activo);
      res.json({
        success: true,
        message: 'Estado del banner actualizado',
        data: bannerActualizado
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/slider/:id
  async eliminar(req, res, next) {
    try {
      const { id } = req.params;
      await sliderService.eliminarBanner(id);
      res.json({
        success: true,
        message: 'Imagen del slider eliminada correctamente'
      });
    } catch (error) {
      next(error);
    }
  }
};

