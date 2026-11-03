import { Router } from 'express';
import { productoController } from '../controllers/productoController.js';

const router = Router();

router.get('/', productoController.listar);
router.get('/:id', productoController.obtenerPorId);
router.post('/', productoController.crear);
router.put('/:id', productoController.actualizar);
router.patch('/:id/estado', productoController.cambiarEstado);
router.delete('/:id', productoController.eliminar);

export default router;
