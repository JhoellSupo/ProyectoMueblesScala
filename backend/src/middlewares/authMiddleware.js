import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'muebles_scala_jwt_super_secret_key_2026_secur3!';

/**
 * Middleware que verifica que la petición incluya un token JWT válido (Cualquier Administrador)
 */
export function requerirAuth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      code: 'AUTH_REQUIRED',
      message: 'Acceso no autorizado: debes iniciar sesión para realizar esta acción.'
    });
  }

  // Extraer token del formato 'Bearer <token>'
  const parts = authHeader.split(' ');
  const token = parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : authHeader;

  if (!token) {
    return res.status(401).json({
      success: false,
      code: 'AUTH_REQUIRED',
      message: 'Token de autenticación no proporcionado.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        code: 'TOKEN_EXPIRED',
        message: 'Tu sesión ha expirado. Por favor ingresa nuevamente.'
      });
    }

    return res.status(401).json({
      success: false,
      code: 'TOKEN_INVALID',
      message: 'Token de sesión inválido o manipulado.'
    });
  }
}

/**
 * Middleware que verifica que el usuario autenticado sea Superadministrador
 */
export function requerirSuperAdmin(req, res, next) {
  requerirAuth(req, res, () => {
    const rol = (req.user?.rol || '').toLowerCase();
    const rolDb = (req.user?.rol_db || '').toUpperCase();
    const username = (req.user?.username || req.user?.usuario || '').toLowerCase();

    const esSuperAdmin =
      rol === 'superadmin' ||
      rolDb.includes('SUPER') ||
      username === 'superadmin';

    if (!esSuperAdmin) {
      return res.status(403).json({
        success: false,
        code: 'FORBIDDEN',
        message: 'Acceso restringido: esta acción requiere permisos exclusivos de Superadministrador.'
      });
    }

    next();
  });
}
