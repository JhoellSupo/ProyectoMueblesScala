import { usuarioService } from '../services/usuarioService.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'muebles_scala_jwt_super_secret_key_2026_secur3!';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

export const usuarioController = {
  // POST /api/usuario/login
  async login(req, res, next) {
    try {
      const { correo, username, password } = req.body;
      const identifier = correo || username;
      const user = await usuarioService.autenticar({ identifier, password });

      // Generar token criptográfico JWT firmado
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username || user.usuario,
          usuario: user.usuario || user.username,
          nombre: user.nombre,
          rol: user.rol,
          rol_db: user.rol_db
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.json({
        success: true,
        message: 'Acceso autorizado al Panel de Administración',
        token,
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
        message: 'Sesión activa y válida',
        user: req.user
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
