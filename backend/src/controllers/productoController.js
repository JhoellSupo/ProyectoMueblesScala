import { productoService } from '../services/productoService.js';

const getAdminUser = (req) => {
  return (
    req.body?.usuario_admin ||
    req.headers['x-admin-user'] ||
    req.query?.usuario_admin ||
    'admin'
  );
};

export const productoController = {
  // GET /api/productos
  async listar(req, res, next) {
    try {
      const { categoria, search, soloActivos } = req.query;
      const productos = await productoService.listarProductos({
        categoria,
        search,
        soloActivos
      });
      res.json({
        success: true,
        total: productos.length,
        data: productos
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/productos/:id
  async obtenerPorId(req, res, next) {
    try {
      const { id } = req.params;
      const producto = await productoService.obtenerPorId(id);
      res.json({
        success: true,
        data: producto
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/productos
  async crear(req, res, next) {
    try {
      const adminUser = getAdminUser(req);
      const nuevoProducto = await productoService.crearProducto({
        ...req.body,
        usuario_admin: adminUser
      });
      res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: nuevoProducto
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/productos/:id
  async actualizar(req, res, next) {
    try {
      const { id } = req.params;
      const adminUser = getAdminUser(req);
      const productoActualizado = await productoService.actualizarProducto(id, {
        ...req.body,
        usuario_admin: adminUser
      });
      res.json({
        success: true,
        message: 'Producto actualizado con éxito',
        data: productoActualizado
      });
    } catch (error) {
      next(error);
    }
  },

  // PATCH /api/productos/:id/estado
  async cambiarEstado(req, res, next) {
    try {
      const { id } = req.params;
      const { activo } = req.body;
      const adminUser = getAdminUser(req);
      const productoActualizado = await productoService.cambiarEstado(id, activo, {
        usuario_admin: adminUser
      });
      res.json({
        success: true,
        message: 'Estado del producto actualizado',
        data: productoActualizado
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/productos/:id
  async eliminar(req, res, next) {
    try {
      const { id } = req.params;
      const adminUser = getAdminUser(req);
      await productoService.eliminarProducto(id, {
        usuario_admin: adminUser
      });
      res.json({
        success: true,
        message: 'Producto eliminado correctamente'
      });
    } catch (error) {
      next(error);
    }
  }
};
