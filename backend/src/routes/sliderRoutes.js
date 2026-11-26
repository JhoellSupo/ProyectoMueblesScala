import { Router } from 'express';
import { sliderController } from '../controllers/sliderController.js';
import { requerirAuth } from '../middlewares/authMiddleware.js';

const router = Router();

// Rutas públicas (carrusel de la tienda)
router.get('/', sliderController.listar);
router.get('/:id', sliderController.obtenerPorId);

// Rutas administrativas protegidas con JWT
router.post('/', requerirAuth, sliderController.crear);
router.put('/:id', requerirAuth, sliderController.actualizar);
router.patch('/:id/estado', requerirAuth, sliderController.cambiarEstado);
router.delete('/:id', requerirAuth, sliderController.eliminar);

export default router;
