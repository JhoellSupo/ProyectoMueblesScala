import db from '../config/db.js';

// Helper para generar slug en el backend si no viene uno
const generateSlug = (text = '') =>
  (text || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const categoriaModel = {
  // Obtener todas las categorías con el conteo de productos activos
  async getAll() {
    const [rows] = await db.query(`
      SELECT 
        c.id_categorias, 
        c.id_categorias AS id_categoria,
        c.nombre, 
        c.slug,
        c.descripcion, 
        c.url_imagen,
        c.url_imagen AS imagen_url,
        c.activo,
        c.fecha_creacion,
        COUNT(m.id_muebles) AS total_productos
      FROM categorias c
      LEFT JOIN muebles m ON m.id_categorias = c.id_categorias AND m.activo = 1
      GROUP BY c.id_categorias
      ORDER BY c.nombre ASC
    `);
    return rows;
  },

  // Obtener una categoría por su ID
  async getById(id) {
    const [rows] = await db.query(`
      SELECT 
        c.*,
        c.id_categorias AS id_categoria,
        c.url_imagen AS imagen_url
      FROM categorias c 
      WHERE c.id_categorias = ?
    `, [id]);
    return rows[0] || null;
  },

  // Buscar categoría por slug
  async getBySlug(slug) {
    const [rows] = await db.query(`
      SELECT 
        c.*,
        c.id_categorias AS id_categoria,
        c.url_imagen AS imagen_url
      FROM categorias c 
      WHERE c.slug = ?
    `, [slug]);
    return rows[0] || null;
  },

  // Buscar categoría por nombre para validar duplicados
  async findByName(nombre, excludeId = null) {
    let query = 'SELECT id_categorias, nombre, slug FROM categorias WHERE LOWER(nombre) = LOWER(?)';
    const params = [nombre.trim()];
    if (excludeId) {
      query += ' AND id_categorias != ?';
      params.push(excludeId);
    }
    const [rows] = await db.query(query, params);
    return rows[0] || null;
  },

  // Contar productos asociados a una categoría
  async countProducts(idCategoria) {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM muebles WHERE id_categorias = ?', [idCategoria]);
    return rows[0].total;
  },

  // Crear una nueva categoría
  async create({ nombre, descripcion, url_imagen, imagen_url, slug }) {
    const finalImage = url_imagen || imagen_url || null;
    const finalSlug = slug ? generateSlug(slug) : generateSlug(nombre);

    const [result] = await db.query(
      `INSERT INTO categorias (nombre, slug, descripcion, url_imagen, activo) 
       VALUES (?, ?, ?, ?, 1)`,
      [nombre.trim(), finalSlug, descripcion?.trim() || null, finalImage?.trim() || null]
    );
    return this.getById(result.insertId);
  },

  // Actualizar una categoría existente
  async update(id, { nombre, descripcion, url_imagen, imagen_url, slug }) {
    const finalImage = url_imagen !== undefined ? url_imagen : (imagen_url !== undefined ? imagen_url : null);
    const finalSlug = slug ? generateSlug(slug) : generateSlug(nombre);

    await db.query(
      `UPDATE categorias 
       SET nombre = ?, 
           slug = ?,
           descripcion = ?, 
           url_imagen = COALESCE(?, url_imagen) 
       WHERE id_categorias = ?`,
      [nombre.trim(), finalSlug, descripcion?.trim() || null, finalImage ? finalImage.trim() : null, id]
    );
    return this.getById(id);
  },

  // Eliminar una categoría
  async delete(id) {
    const [result] = await db.query('DELETE FROM categorias WHERE id_categorias = ?', [id]);
    return result.affectedRows > 0;
  }
};
