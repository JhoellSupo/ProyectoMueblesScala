import { Router } from 'express';
import { marcaController } from '../controllers/marcaController.js';

const router = Router();

router.get('/', marcaController.listar);
router.post('/', marcaController.crear);

export default router;
