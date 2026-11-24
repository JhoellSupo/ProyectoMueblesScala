import { Router } from 'express';
import { historialController } from '../controllers/historialController.js';

const router = Router();

router.get('/', historialController.listar);
router.post('/limpiar', historialController.limpiar);

export default router;

