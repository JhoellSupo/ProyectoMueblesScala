import { Router } from 'express';
import { productoController } from '../controllers/productoController.js';
import { requerirAuth } from '../middlewares/authMiddleware.js';

const router = Router();

// Rutas públicas (para clientes y visitantes de la tienda)
router.get('/', productoController.listar);
router.get('/:id', productoController.obtenerPorId);

// Rutas administrativas protegidas con JWT
router.post('/', requerirAuth, productoController.crear);
router.put('/:id', requerirAuth, productoController.actualizar);
router.patch('/:id/estado', requerirAuth, productoController.cambiarEstado);
router.delete('/:id', requerirAuth, productoController.eliminar);

export default router;
