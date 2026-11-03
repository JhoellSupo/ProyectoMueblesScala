import { Router } from 'express';
import { usuarioController } from '../controllers/usuarioController.js';

const router = Router();

router.post('/login', usuarioController.login);
router.get('/perfil', usuarioController.perfil);

export default router;
