import db from '../config/db.js';

export const historialModel = {
  // Registrar una acción en el historial
  async registrar({ id_muebles = null, id_mueble = null, nombre_mueble, accion, id_administradores = null, id_admin = null, usuario_admin = 'admin', detalles = '' }) {
    try {
      const muebleId = id_muebles || id_mueble || null;
      const adminId = id_administradores || id_admin || null;

      // Normalizar la acción al ENUM
      let accionVal = 'ACTUALIZAR';
      const accionStr = (accion || '').toUpperCase();
      if (accionStr.includes('CREAR')) accionVal = 'CREAR';
      else if (accionStr.includes('ESTADO')) accionVal = 'CAMBIO_ESTADO';
      else if (accionStr.includes('ELIMIN')) accionVal = 'ELIMINAR';

      const [result] = await db.query(
        `INSERT INTO historial_muebles (id_muebles, nombre_mueble, accion, id_administradores, usuario_admin, detalles)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [muebleId, nombre_mueble, accionVal, adminId, usuario_admin, detalles]
      );
      return result.insertId;
    } catch (err) {
      console.error('Error al registrar historial en mueblescalabd:', err.message);
      return null;
    }
  },

  // Listar historial de modificaciones
  async getAll({ limit = 100 } = {}) {
    const [rows] = await db.query(
      `SELECT 
         id_historial, 
         id_muebles, 
         id_muebles AS id_mueble,
         nombre_mueble, 
         accion, 
         id_administradores, 
         id_administradores AS id_admin,
         usuario_admin, 
         detalles, 
         fecha_movimiento,
         fecha_movimiento AS fecha
       FROM historial_muebles
       ORDER BY fecha_movimiento DESC, id_historial DESC
       LIMIT ?`,
      [Number(limit) || 100]
    );
    return rows;
  },

  // Limpiar historial
  async clear() {
    await db.query('TRUNCATE TABLE historial_muebles');
    return true;
  }
};
