import { Router } from 'express';
import { usuarioController } from '../controllers/usuarioController.js';
import { requerirAuth, requerirSuperAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

// Login público
router.post('/login', usuarioController.login);

// Verificación de perfil autenticado
router.get('/perfil', requerirAuth, usuarioController.perfil);

// Rutas exclusivas de gestión de administradores (Solo Superadmin)
router.get('/administradores', requerirSuperAdmin, usuarioController.listarAdmins);
router.post('/administradores', requerirSuperAdmin, usuarioController.crearAdmin);
router.patch('/administradores/:id/estado', requerirSuperAdmin, usuarioController.cambiarEstadoAdmin);
router.delete('/administradores/:id', requerirSuperAdmin, usuarioController.eliminarAdmin);

export default router;
