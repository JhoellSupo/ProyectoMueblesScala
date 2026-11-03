import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { initDatabase } from './config/initDb.js';

dotenv.config({ path: './src/config/.env' });

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Inicializar y verificar tablas / datos base en MySQL
initDatabase();

// Enrutador principal de la API
app.use('/api', apiRouter);

// Middleware global de captura y formateo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;