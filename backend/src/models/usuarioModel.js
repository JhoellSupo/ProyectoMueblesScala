import db from '../config/db.js';

export const usuarioModel = {
  // Listar todos los administradores
  async getAll() {
    const [rows] = await db.query(
      `SELECT 
         id_administradores,
         id_administradores AS id_admin,
         nombre,
         usuario,
         usuario AS correo,
         rol,
         estado,
         (CASE WHEN estado = 'ACTIVO' THEN 1 ELSE 0 END) AS activo,
         fecha_creacion,
         fecha_actualizacion
       FROM administradores 
       ORDER BY id_administradores ASC`
    );
    return rows;
  },

  // Buscar administrador por usuario
  async findByIdentifier(identifier) {
    const [rows] = await db.query(
      `SELECT 
         id_administradores,
         id_administradores AS id_admin,
         nombre,
         usuario,
         usuario AS correo,
         password_hash,
         rol,
         estado,
         (CASE WHEN estado = 'ACTIVO' THEN 1 ELSE 0 END) AS activo,
         fecha_creacion
       FROM administradores 
       WHERE LOWER(usuario) = LOWER(?) OR LOWER(nombre) = LOWER(?)`,
      [identifier.trim(), identifier.trim()]
    );
    return rows[0] || null;
  },

  // Obtener por ID
  async getById(id) {
    const [rows] = await db.query(
      `SELECT 
         id_administradores,
         id_administradores AS id_admin,
         nombre,
         usuario,
         usuario AS correo,
         rol,
         estado,
         (CASE WHEN estado = 'ACTIVO' THEN 1 ELSE 0 END) AS activo,
         fecha_creacion
       FROM administradores 
       WHERE id_administradores = ?`,
      [id]
    );
    return rows[0] || null;
  },

  // Contar administradores
  async count() {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM administradores');
    return rows[0].total;
  },

  // Registrar un administrador
  async create({ nombre, usuario, password_hash, rol = 'ADMINISTRADOR', estado = 'ACTIVO' }) {
    const rolVal = (rol || '').toUpperCase().includes('SUPER') ? 'SUPERADMINISTRADOR' : 'ADMINISTRADOR';
    const estadoVal = (estado === 'INACTIVO' || estado === 0) ? 'INACTIVO' : 'ACTIVO';

    const [result] = await db.query(
      `INSERT INTO administradores (nombre, usuario, password_hash, rol, estado) 
       VALUES (?, ?, ?, ?, ?)`,
      [nombre.trim(), usuario.trim(), password_hash, rolVal, estadoVal]
    );
    return this.getById(result.insertId);
  },

  // Cambiar estado activo/inactivo
  async updateStatus(id, activo) {
    const nuevoEstado = (activo === 1 || activo === true || activo === 'ACTIVO') ? 'ACTIVO' : 'INACTIVO';
    await db.query(
      'UPDATE administradores SET estado = ? WHERE id_administradores = ?',
      [nuevoEstado, id]
    );
    return this.getById(id);
  },

  // Eliminar administrador
  async delete(id) {
    const [result] = await db.query('DELETE FROM administradores WHERE id_administradores = ?', [id]);
    return result.affectedRows > 0;
  }
};
