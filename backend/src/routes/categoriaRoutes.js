import { Router } from 'express';
import { categoriaController } from '../controllers/categoriaController.js';
import { requerirAuth } from '../middlewares/authMiddleware.js';

const router = Router();

// Rutas públicas
router.get('/', categoriaController.listar);
router.get('/:id', categoriaController.obtenerPorId);

// Rutas administrativas protegidas con JWT
router.post('/', requerirAuth, categoriaController.crear);
router.put('/:id', requerirAuth, categoriaController.actualizar);
router.delete('/:id', requerirAuth, categoriaController.eliminar);

export default router;
