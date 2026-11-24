import { Router } from 'express';
import { sliderController } from '../controllers/sliderController.js';

const router = Router();

router.get('/', sliderController.listar);
router.get('/:id', sliderController.obtenerPorId);
router.post('/', sliderController.crear);
router.put('/:id', sliderController.actualizar);
router.patch('/:id/estado', sliderController.cambiarEstado);
router.delete('/:id', sliderController.eliminar);

export default router;

