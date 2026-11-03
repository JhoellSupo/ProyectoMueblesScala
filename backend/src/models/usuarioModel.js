import db from '../config/db.js';

export const usuarioModel = {
  // Buscar administrador por correo o por nombre
  async findByIdentifier(identifier) {
    const [rows] = await db.query(
      `SELECT id_admin, nombre, correo, password_hash, activo, fecha_creacion
       FROM administradores 
       WHERE (LOWER(correo) = LOWER(?) OR LOWER(nombre) = LOWER(?))`,
      [identifier.trim(), identifier.trim()]
    );
    return rows[0] || null;
  },

  // Obtener por ID
  async getById(id) {
    const [rows] = await db.query(
      `SELECT id_admin, nombre, correo, activo, fecha_creacion 
       FROM administradores 
       WHERE id_admin = ?`,
      [id]
    );
    return rows[0] || null;
  },

  // Contar cuántos administradores existen
  async count() {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM administradores');
    return rows[0].total;
  },

  // Registrar un administrador
  async create({ nombre, correo, password_hash, activo = 1 }) {
    const [result] = await db.query(
      `INSERT INTO administradores (nombre, correo, password_hash, activo) 
       VALUES (?, ?, ?, ?)`,
      [nombre.trim(), correo.trim(), password_hash, activo]
    );
    return this.getById(result.insertId);
  }
};
