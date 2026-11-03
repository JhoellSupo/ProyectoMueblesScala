import { categoriaService } from '../services/categoriaService.js';

export const categoriaController = {
  // GET /api/categorias
  async listar(req, res, next) {
    try {
      const categorias = await categoriaService.listarCategorias();
      res.json({
        success: true,
        data: categorias
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/categorias/:id
  async obtenerPorId(req, res, next) {
    try {
      const { id } = req.params;
      const categoria = await categoriaService.obtenerPorId(id);
      res.json({
        success: true,
        data: categoria
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/categorias
  async crear(req, res, next) {
    try {
      const nuevaCategoria = await categoriaService.crearCategoria(req.body);
      res.status(201).json({
        success: true,
        message: 'Categoría creada con éxito',
        data: {
          ...nuevaCategoria,
          total_productos: 0
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/categorias/:id
  async actualizar(req, res, next) {
    try {
      const { id } = req.params;
      const categoriaActualizada = await categoriaService.actualizarCategoria(id, req.body);
      res.json({
        success: true,
        message: 'Categoría actualizada correctamente',
        data: categoriaActualizada
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/categorias/:id
  async eliminar(req, res, next) {
    try {
      const { id } = req.params;
      await categoriaService.eliminarCategoria(id);
      res.json({
        success: true,
        message: 'Categoría eliminada con éxito'
      });
    } catch (error) {
      next(error);
    }
  }
};
