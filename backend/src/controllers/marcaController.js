import { marcaService } from '../services/marcaService.js';

export const marcaController = {
  // GET /api/marcas
  async listar(req, res, next) {
    try {
      const marcas = await marcaService.listarMarcas();
      res.json({
        success: true,
        data: marcas
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/marcas
  async crear(req, res, next) {
    try {
      const nuevaMarca = await marcaService.crearMarca(req.body);
      res.status(201).json({
        success: true,
        message: 'Marca creada con éxito',
        data: nuevaMarca
      });
    } catch (error) {
      next(error);
    }
  }
};
