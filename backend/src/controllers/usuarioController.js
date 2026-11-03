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
  }
};
