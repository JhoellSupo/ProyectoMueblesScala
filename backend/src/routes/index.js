import { Router } from 'express';
import productoRoutes from './productoRoutes.js';
import categoriaRoutes from './categoriaRoutes.js';
import marcaRoutes from './marcaRoutes.js';
import usuarioRoutes from './usuarioRoutes.js';
import sliderRoutes from './sliderRoutes.js';
import historialRoutes from './historialRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const apiRouter = Router();

apiRouter.use('/productos', productoRoutes);
apiRouter.use('/categorias', categoriaRoutes);
apiRouter.use('/marcas', marcaRoutes);
apiRouter.use('/usuario', usuarioRoutes);
apiRouter.use('/slider', sliderRoutes);
apiRouter.use('/historial-muebles', historialRoutes);
apiRouter.use('/upload', uploadRoutes);

export default apiRouter;
