import db from '../config/db.js';

export const productoModel = {
  // Listar productos con filtros opcionales (categoría, texto, soloActivos)
  async getAll({ soloActivos, categoria, search } = {}) {
    let query = `
      SELECT 
        m.id_mueble,
        m.id_categoria,
        m.id_marca,
        m.nombre,
        m.descripcion,
        m.precio,
        m.largo_cm,
        m.ancho_cm,
        m.alto_cm,
        m.activo,
        m.fecha_creacion,
        c.nombre AS categoria,
        ma.nombre AS marca,
        (
          SELECT im.url_imagen 
          FROM imagenes_mueble im 
          WHERE im.id_mueble = m.id_mueble 
          LIMIT 1
        ) AS imagen_url
      FROM muebles m
      LEFT JOIN categorias c ON m.id_categoria = c.id_categoria
      LEFT JOIN marcas ma ON m.id_marca = ma.id_marca
      WHERE 1=1
    `;
    const params = [];

    if (soloActivos === true || soloActivos === 'true' || soloActivos === '1' || soloActivos === 1) {
      query += ` AND m.activo = 1`;
    }

    if (categoria) {
      if (!isNaN(categoria)) {
        query += ` AND m.id_categoria = ?`;
        params.push(Number(categoria));
      } else {
        query += ` AND LOWER(c.nombre) = LOWER(?)`;
        params.push(categoria.trim());
      }
    }

    if (search && search.trim()) {
      query += ` AND (m.nombre LIKE ? OR m.descripcion LIKE ? OR c.nombre LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    query += ` ORDER BY m.id_mueble DESC`;

    const [rows] = await db.query(query, params);
    return rows;
  },

  // Obtener un producto por ID con su marca, categoría e imagen
  async getById(id) {
    const [rows] = await db.query(`
      SELECT 
        m.*,
        c.nombre AS categoria,
        ma.nombre AS marca,
        (
          SELECT im.url_imagen 
          FROM imagenes_mueble im 
          WHERE im.id_mueble = m.id_mueble 
          LIMIT 1
        ) AS imagen_url
      FROM muebles m
      LEFT JOIN categorias c ON m.id_categoria = c.id_categoria
      LEFT JOIN marcas ma ON m.id_marca = ma.id_marca
      WHERE m.id_mueble = ?
    `, [id]);
    return rows[0] || null;
  },

  // Obtener todas las imágenes de un mueble
  async getImages(idMueble) {
    const [rows] = await db.query(
      'SELECT id_imagen, url_imagen FROM imagenes_mueble WHERE id_mueble = ?',
      [idMueble]
    );
    return rows;
  },

  // Crear mueble
  async create(datos) {
    const {
      id_categoria,
      id_marca,
      nombre,
      descripcion,
      precio,
      largo_cm,
      ancho_cm,
      alto_cm,
      activo = 1
    } = datos;

    const [result] = await db.query(`
      INSERT INTO muebles (
        id_categoria,
        id_marca,
        nombre,
        descripcion,
        precio,
        largo_cm,
        ancho_cm,
        alto_cm,
        activo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id_categoria,
      id_marca,
      nombre.trim(),
      descripcion?.trim() || null,
      Number(precio),
      largo_cm ? Number(largo_cm) : null,
      ancho_cm ? Number(ancho_cm) : null,
      alto_cm ? Number(alto_cm) : null,
      activo ? 1 : 0
    ]);

    return result.insertId;
  },

  // Añadir imagen a un mueble
  async addImage(idMueble, urlImagen) {
    if (!urlImagen || !urlImagen.trim()) return null;
    const [result] = await db.query(
      'INSERT INTO imagenes_mueble (id_mueble, url_imagen) VALUES (?, ?)',
      [idMueble, urlImagen.trim()]
    );
    return result.insertId;
  },

  // Actualizar o insertar imagen principal
  async setMainImage(idMueble, urlImagen) {
    const [existentes] = await db.query(
      'SELECT id_imagen FROM imagenes_mueble WHERE id_mueble = ? LIMIT 1',
      [idMueble]
    );

    if (existentes.length > 0) {
      if (urlImagen && urlImagen.trim()) {
        await db.query(
          'UPDATE imagenes_mueble SET url_imagen = ? WHERE id_imagen = ?',
          [urlImagen.trim(), existentes[0].id_imagen]
        );
      } else {
        await db.query(
          'DELETE FROM imagenes_mueble WHERE id_imagen = ?',
          [existentes[0].id_imagen]
        );
      }
    } else if (urlImagen && urlImagen.trim()) {
      await db.query(
        'INSERT INTO imagenes_mueble (id_mueble, url_imagen) VALUES (?, ?)',
        [idMueble, urlImagen.trim()]
      );
    }
  },

  // Actualizar datos de mueble
  async update(id, datos) {
    const {
      id_categoria,
      id_marca,
      nombre,
      descripcion,
      precio,
      largo_cm,
      ancho_cm,
      alto_cm,
      activo
    } = datos;

    await db.query(`
      UPDATE muebles SET
        id_categoria = ?,
        id_marca = ?,
        nombre = ?,
        descripcion = ?,
        precio = ?,
        largo_cm = ?,
        ancho_cm = ?,
        alto_cm = ?,
        activo = ?
      WHERE id_mueble = ?
    `, [
      id_categoria,
      id_marca,
      nombre.trim(),
      descripcion?.trim() || null,
      Number(precio),
      largo_cm ? Number(largo_cm) : null,
      ancho_cm ? Number(ancho_cm) : null,
      alto_cm ? Number(alto_cm) : null,
      activo !== undefined ? (activo ? 1 : 0) : 1,
      id
    ]);

    return this.getById(id);
  },

  // Eliminar tablas dependientes antes de borrar mueble
  async deleteDependencies(idMueble) {
    await db.query('DELETE FROM imagenes_mueble WHERE id_mueble = ?', [idMueble]);
    await db.query('DELETE FROM mueble_material WHERE id_mueble = ?', [idMueble]);
    await db.query('DELETE FROM variantes_mueble WHERE id_mueble = ?', [idMueble]);
  },

  // Eliminar mueble
  async delete(idMueble) {
    const [result] = await db.query('DELETE FROM muebles WHERE id_mueble = ?', [idMueble]);
    return result.affectedRows > 0;
  }
};
