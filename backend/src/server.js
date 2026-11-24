import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { initDatabase } from './config/initDb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, 'config/.env') });

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Servir archivos estáticos de subidas
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

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
