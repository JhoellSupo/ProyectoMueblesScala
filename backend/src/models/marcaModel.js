import db from '../config/db.js';

export const marcaModel = {
  // Obtener todas las marcas
  async getAll() {
    const [rows] = await db.query('SELECT * FROM marcas ORDER BY nombre ASC');
    return rows;
  },

  // Obtener la primera marca disponible (por defecto)
  async getFirst() {
    const [rows] = await db.query('SELECT * FROM marcas LIMIT 1');
    return rows[0] || null;
  },

  // Obtener por ID
  async getById(id) {
    const [rows] = await db.query('SELECT * FROM marcas WHERE id_marca = ?', [id]);
    return rows[0] || null;
  },

  // Crear una marca
  async create({ nombre, descripcion }) {
    const [result] = await db.query(
      'INSERT INTO marcas (nombre, descripcion) VALUES (?, ?)',
      [nombre.trim(), descripcion?.trim() || null]
    );
    return this.getById(result.insertId);
  }
};
