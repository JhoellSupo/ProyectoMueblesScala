import { Router } from 'express';
import { historialController } from '../controllers/historialController.js';
import { requerirSuperAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

// Rutas exclusivas para Superadministrador protegidas con JWT
router.get('/', requerirSuperAdmin, historialController.listar);
router.post('/limpiar', requerirSuperAdmin, historialController.limpiar);

export default router;
