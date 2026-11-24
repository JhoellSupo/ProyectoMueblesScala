import { Router } from 'express';
import { usuarioController } from '../controllers/usuarioController.js';

const router = Router();

router.post('/login', usuarioController.login);
router.get('/perfil', usuarioController.perfil);

// Rutas de administración de usuarios (Superadmin)
router.get('/administradores', usuarioController.listarAdmins);
router.post('/administradores', usuarioController.crearAdmin);
router.patch('/administradores/:id/estado', usuarioController.cambiarEstadoAdmin);
router.delete('/administradores/:id', usuarioController.eliminarAdmin);

export default router;
