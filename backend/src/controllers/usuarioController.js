import { usuarioService } from '../services/usuarioService.js';

export const usuarioController = {
  // POST /api/usuario/login
  async login(req, res, next) {
    try {
      const { correo, username, password } = req.body;
      const identifier = correo || username;
      const user = await usuarioService.autenticar({ identifier, password });

      res.json({
        success: true,
        message: 'Acceso autorizado al Panel de Administración',
        user
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/usuario/perfil
  async perfil(req, res, next) {
    try {
      res.json({
        success: true,
        message: 'Servicio de autenticación disponible'
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/usuario/administradores (Solo Superadmin)
  async listarAdmins(req, res, next) {
    try {
      const admins = await usuarioService.listarAdmins();
      res.json({
        success: true,
        data: admins
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/usuario/administradores (Crear administrador)
  async crearAdmin(req, res, next) {
    try {
      const { nombre, usuario, correo, password, rol } = req.body;
      const nuevoAdmin = await usuarioService.crearAdmin({ nombre, usuario, correo, password, rol });
      res.status(201).json({
        success: true,
        message: 'Administrador creado exitosamente',
        data: nuevoAdmin
      });
    } catch (error) {
      next(error);
    }
  },

  // PATCH /api/usuario/administradores/:id/estado
  async cambiarEstadoAdmin(req, res, next) {
    try {
      const { id } = req.params;
      const { activo } = req.body;
      const adminActualizado = await usuarioService.cambiarEstadoAdmin(id, activo);
      res.json({
        success: true,
        message: `Administrador ${activo ? 'activado' : 'desactivado'} correctamente`,
        data: adminActualizado
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/usuario/administradores/:id
  async eliminarAdmin(req, res, next) {
    try {
      const { id } = req.params;
      await usuarioService.eliminarAdmin(id);
      res.json({
        success: true,
        message: 'Administrador eliminado correctamente'
      });
    } catch (error) {
      next(error);
    }
  }
};
