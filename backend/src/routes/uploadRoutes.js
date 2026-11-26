import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { requerirAuth } from '../middlewares/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorio donde se almacenan las fotos de los muebles
const uploadsDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de almacenamiento local (Fácilmente reemplazable por AWS S3 en el futuro)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Sanitizar nombre y conservar extensión original
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `mueble-${uniqueSuffix}${ext}`);
  }
});

// Filtro de validación para aceptar únicamente imágenes
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif', 'image/svg+xml'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (JPG, PNG, WEBP, GIF).'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // Límite de 10 MB
  }
});

const router = Router();

/**
 * POST /api/upload
 * Recibe un archivo en el campo 'imagen' o 'file'
 * Protegido con JWT: solo administradores autenticados pueden subir fotos
 * Retorna la URL generada automáticamente sin intervención manual
 */
router.post('/', requerirAuth, (req, res, next) => {
  upload.single('imagen')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'La imagen excede el tamaño máximo permitido (10 MB).'
          });
        }
        return res.status(400).json({
          success: false,
          message: `Error de subida: ${err.message}`
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || 'Error al procesar el archivo de imagen.'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se envió ningún archivo de imagen.'
      });
    }

    // Ruta estática accesible desde el frontend
    const relativeUrl = `/uploads/${req.file.filename}`;

    // Construir URL completa
    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:3000';
    const fullUrl = `${protocol}://${host}${relativeUrl}`;

    return res.status(201).json({
      success: true,
      message: 'Imagen subida exitosamente',
      url: relativeUrl,
      fullUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  });
});

export default router;
