import db from '../config/db.js';

export const sliderModel = {
  // Listar todos los banners del slider
  async getAll({ soloActivos } = {}) {
    let query = `
      SELECT 
        id_banner,
        titulo,
        url_imagen,
        url_imagen AS imagen_url,
        orden,
        activo,
        fecha_creacion,
        fecha_actualizacion
      FROM banner_slider 
      WHERE 1=1
    `;
    const params = [];

    if (soloActivos === true || soloActivos === 'true' || soloActivos === '1' || soloActivos === 1) {
      query += ' AND activo = 1';
    }

    query += ' ORDER BY orden ASC, id_banner DESC';
    const [rows] = await db.query(query, params);
    return rows;
  },

  // Obtener banner por ID
  async getById(id) {
    const [rows] = await db.query(`
      SELECT 
        id_banner,
        titulo,
        url_imagen,
        url_imagen AS imagen_url,
        orden,
        activo,
        fecha_creacion
      FROM banner_slider 
      WHERE id_banner = ?
    `, [id]);
    return rows[0] || null;
  },

  // Crear nuevo banner para el slider
  async create({ titulo, url_imagen, imagen_url, orden = 0, activo = 1 }) {
    const img = url_imagen || imagen_url || '';
    const [result] = await db.query(
      'INSERT INTO banner_slider (titulo, url_imagen, orden, activo) VALUES (?, ?, ?, ?)',
      [titulo || 'Banner', img, Number(orden) || 1, activo ? 1 : 0]
    );
    return this.getById(result.insertId);
  },

  // Actualizar banner existente
  async update(id, { titulo, url_imagen, imagen_url, orden, activo }) {
    const img = url_imagen !== undefined ? url_imagen : (imagen_url !== undefined ? imagen_url : null);
    await db.query(
      `UPDATE banner_slider 
       SET titulo = COALESCE(?, titulo),
           url_imagen = COALESCE(?, url_imagen),
           orden = COALESCE(?, orden),
           activo = COALESCE(?, activo)
       WHERE id_banner = ?`,
      [
        titulo !== undefined ? titulo : null,
        img,
        orden !== undefined ? Number(orden) : null,
        activo !== undefined ? (activo ? 1 : 0) : null,
        id
      ]
    );
    return this.getById(id);
  },

  // Cambiar estado activo/inactivo
  async updateStatus(id, activo) {
    await db.query(
      'UPDATE banner_slider SET activo = ? WHERE id_banner = ?',
      [activo ? 1 : 0, id]
    );
    return this.getById(id);
  },

  // Eliminar banner
  async delete(id) {
    const [result] = await db.query('DELETE FROM banner_slider WHERE id_banner = ?', [id]);
    return result.affectedRows > 0;
  }
};
