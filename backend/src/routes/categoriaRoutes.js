import { Router } from 'express';
import { categoriaController } from '../controllers/categoriaController.js';

const router = Router();

router.get('/', categoriaController.listar);
router.get('/:id', categoriaController.obtenerPorId);
router.post('/', categoriaController.crear);
router.put('/:id', categoriaController.actualizar);
router.delete('/:id', categoriaController.eliminar);

export default router;
