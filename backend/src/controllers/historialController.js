import { historialService } from '../services/historialService.js';

export const historialController = {
  // GET /api/historial-muebles
  async listar(req, res, next) {
    try {
      const { limit } = req.query;
      const data = await historialService.listar({ limit });
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/historial-muebles/limpiar
  async limpiar(req, res, next) {
    try {
      await historialService.limpiar();
      res.json({
        success: true,
        message: 'Historial de modificaciones limpiado correctamente'
      });
    } catch (error) {
      next(error);
    }
  }
};

