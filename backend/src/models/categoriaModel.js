import db from '../config/db.js';

export const categoriaModel = {
  // Obtener todas las categorías con el conteo de productos activos
  async getAll() {
    const [rows] = await db.query(`
      SELECT 
        c.id_categoria, 
        c.nombre, 
        c.descripcion, 
        c.fecha_creacion,
        COUNT(m.id_mueble) AS total_productos
      FROM categorias c
      LEFT JOIN muebles m ON m.id_categoria = c.id_categoria AND m.activo = 1
      GROUP BY c.id_categoria, c.nombre, c.descripcion, c.fecha_creacion
      ORDER BY c.nombre ASC
    `);
    return rows;
  },

  // Obtener una categoría por su ID
  async getById(id) {
    const [rows] = await db.query('SELECT * FROM categorias WHERE id_categoria = ?', [id]);
    return rows[0] || null;
  },

  // Buscar categoría por nombre para validar duplicados
  async findByName(nombre, excludeId = null) {
    let query = 'SELECT id_categoria, nombre FROM categorias WHERE LOWER(nombre) = LOWER(?)';
    const params = [nombre.trim()];
    if (excludeId) {
      query += ' AND id_categoria != ?';
      params.push(excludeId);
    }
    const [rows] = await db.query(query, params);
    return rows[0] || null;
  },

  // Contar productos asociados a una categoría
  async countProducts(idCategoria) {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM muebles WHERE id_categoria = ?', [idCategoria]);
    return rows[0].total;
  },

  // Crear una nueva categoría
  async create({ nombre, descripcion }) {
    const [result] = await db.query(
      'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
      [nombre.trim(), descripcion?.trim() || null]
    );
    return this.getById(result.insertId);
  },

  // Actualizar una categoría existente
  async update(id, { nombre, descripcion }) {
    await db.query(
      'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id_categoria = ?',
      [nombre.trim(), descripcion?.trim() || null, id]
    );
    return this.getById(id);
  },

  // Eliminar una categoría
  async delete(id) {
    const [result] = await db.query('DELETE FROM categorias WHERE id_categoria = ?', [id]);
    return result.affectedRows > 0;
  }
};
