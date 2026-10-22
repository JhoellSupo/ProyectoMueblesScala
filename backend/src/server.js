import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productoRoutes from './routes/productoRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';

dotenv.config({ path: './src/config/.env' });

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/productos', productoRoutes);
app.use('/api', productoRoutes);
app.use('/api/usuario', usuarioRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;