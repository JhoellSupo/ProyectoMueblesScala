import { Router } from 'express';
import productoRoutes from './productoRoutes.js';
import categoriaRoutes from './categoriaRoutes.js';
import marcaRoutes from './marcaRoutes.js';
import usuarioRoutes from './usuarioRoutes.js';

const apiRouter = Router();

apiRouter.use('/productos', productoRoutes);
apiRouter.use('/categorias', categoriaRoutes);
apiRouter.use('/marcas', marcaRoutes);
apiRouter.use('/usuario', usuarioRoutes);

export default apiRouter;
