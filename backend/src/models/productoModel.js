import db from '../config/db.js';

// Helper para generar slug en el backend
const generateSlug = (text = '') =>
  (text || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const productoModel = {
  // Listar productos con filtros opcionales (categoría, texto, soloActivos)
  async getAll({ soloActivos, categoria, search } = {}) {
    let query = `
      SELECT 
        m.id_muebles,
        m.id_muebles AS id_mueble,
        m.id_categorias,
        m.id_categorias AS id_categoria,
        m.id_perfil,
        m.nombre,
        m.slug,
        m.descripcion,
        m.precio,
        m.precio_oferta,
        m.activo,
        m.destacado,
        m.fecha_creacion,
        c.nombre AS categoria,
        c.slug AS categoria_slug,
        'Scala' AS marca,
        (
          SELECT im.url_imagen 
          FROM imagenes_muebles im 
          WHERE im.id_muebles = m.id_muebles 
          ORDER BY im.orden ASC, im.id_imagenes ASC
          LIMIT 1
        ) AS imagen_url,
        (
          SELECT im.url_imagen 
          FROM imagenes_muebles im 
          WHERE im.id_muebles = m.id_muebles 
          ORDER BY im.orden ASC, im.id_imagenes ASC
          LIMIT 1
        ) AS url_imagen,
        (
          SELECT d.largo_cm 
          FROM detalle_perfil_medidas d 
          WHERE d.id_perfil = m.id_perfil 
          ORDER BY d.orden ASC, d.id_detalle ASC 
          LIMIT 1
        ) AS largo_cm,
        (
          SELECT d.ancho_cm 
          FROM detalle_perfil_medidas d 
          WHERE d.id_perfil = m.id_perfil 
          ORDER BY d.orden ASC, d.id_detalle ASC 
          LIMIT 1
        ) AS ancho_cm,
        (
          SELECT d.alto_cm 
          FROM detalle_perfil_medidas d 
          WHERE d.id_perfil = m.id_perfil 
          ORDER BY d.orden ASC, d.id_detalle ASC 
          LIMIT 1
        ) AS alto_cm
      FROM muebles m
      LEFT JOIN categorias c ON m.id_categorias = c.id_categorias
      WHERE 1=1
    `;
    const params = [];

    if (soloActivos === true || soloActivos === 'true' || soloActivos === '1' || soloActivos === 1) {
      query += ` AND m.activo = 1`;
    }

    if (categoria) {
      if (!isNaN(categoria)) {
        query += ` AND m.id_categorias = ?`;
        params.push(Number(categoria));
      } else {
        query += ` AND (LOWER(c.nombre) = LOWER(?) OR c.slug = ?)`;
        params.push(categoria.trim(), generateSlug(categoria));
      }
    }

    if (search && search.trim()) {
      query += ` AND (m.nombre LIKE ? OR m.descripcion LIKE ? OR c.nombre LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    query += ` ORDER BY m.destacado DESC, m.id_muebles DESC`;

    const [rows] = await db.query(query, params);
    return rows;
  },

  // Obtener un producto por ID o slug
  async getById(id) {
    const isNum = !isNaN(id);
    const query = `
      SELECT 
        m.*,
        m.id_muebles AS id_mueble,
        m.id_categorias AS id_categoria,
        c.nombre AS categoria,
        c.slug AS categoria_slug,
        'Scala' AS marca,
        (
          SELECT im.url_imagen 
          FROM imagenes_muebles im 
          WHERE im.id_muebles = m.id_muebles 
          ORDER BY im.orden ASC, im.id_imagenes ASC
          LIMIT 1
        ) AS imagen_url,
        (
          SELECT im.url_imagen 
          FROM imagenes_muebles im 
          WHERE im.id_muebles = m.id_muebles 
          ORDER BY im.orden ASC, im.id_imagenes ASC
          LIMIT 1
        ) AS url_imagen,
        (
          SELECT d.largo_cm 
          FROM detalle_perfil_medidas d 
          WHERE d.id_perfil = m.id_perfil 
          ORDER BY d.orden ASC, d.id_detalle ASC 
          LIMIT 1
        ) AS largo_cm,
        (
          SELECT d.ancho_cm 
          FROM detalle_perfil_medidas d 
          WHERE d.id_perfil = m.id_perfil 
          ORDER BY d.orden ASC, d.id_detalle ASC 
          LIMIT 1
        ) AS ancho_cm,
        (
          SELECT d.alto_cm 
          FROM detalle_perfil_medidas d 
          WHERE d.id_perfil = m.id_perfil 
          ORDER BY d.orden ASC, d.id_detalle ASC 
          LIMIT 1
        ) AS alto_cm
      FROM muebles m
      LEFT JOIN categorias c ON m.id_categorias = c.id_categorias
      WHERE ${isNum ? 'm.id_muebles = ?' : 'm.slug = ?'}
    `;
    const [rows] = await db.query(query, [id]);
    return rows[0] || null;
  },

  // Obtener producto por slug
  async getBySlug(slug) {
    const [rows] = await db.query(`
      SELECT 
        m.*,
        m.id_muebles AS id_mueble,
        m.id_categorias AS id_categoria,
        c.nombre AS categoria,
        c.slug AS categoria_slug,
        'Scala' AS marca,
        (
          SELECT im.url_imagen 
          FROM imagenes_muebles im 
          WHERE im.id_muebles = m.id_muebles 
          ORDER BY im.orden ASC, im.id_imagenes ASC
          LIMIT 1
        ) AS imagen_url,
        (
          SELECT im.url_imagen 
          FROM imagenes_muebles im 
          WHERE im.id_muebles = m.id_muebles 
          ORDER BY im.orden ASC, im.id_imagenes ASC
          LIMIT 1
        ) AS url_imagen,
        (
          SELECT d.largo_cm 
          FROM detalle_perfil_medidas d 
          WHERE d.id_perfil = m.id_perfil 
          ORDER BY d.orden ASC, d.id_detalle ASC 
          LIMIT 1
        ) AS largo_cm,
        (
          SELECT d.ancho_cm 
          FROM detalle_perfil_medidas d 
          WHERE d.id_perfil = m.id_perfil 
          ORDER BY d.orden ASC, d.id_detalle ASC 
          LIMIT 1
        ) AS ancho_cm,
        (
          SELECT d.alto_cm 
          FROM detalle_perfil_medidas d 
          WHERE d.id_perfil = m.id_perfil 
          ORDER BY d.orden ASC, d.id_detalle ASC 
          LIMIT 1
        ) AS alto_cm
      FROM muebles m
      LEFT JOIN categorias c ON m.id_categorias = c.id_categorias
      WHERE m.slug = ?
    `, [slug]);
    return rows[0] || null;
  },

  // Obtener todas las imágenes de un mueble
  async getImages(idMuebles) {
    const [rows] = await db.query(
      `SELECT 
         id_imagenes, 
         id_imagenes AS id_imagen, 
         url_imagen, 
         orden 
       FROM imagenes_muebles 
       WHERE id_muebles = ? 
       ORDER BY orden ASC, id_imagenes ASC`,
      [idMuebles]
    );
    return rows;
  },

  // Obtener medidas del perfil si tiene
  async getMedidas(idPerfil) {
    if (!idPerfil) return [];
    const [rows] = await db.query(
      `SELECT id_detalle, nombre_pieza, cantidad, largo_cm, ancho_cm, alto_cm, orden
       FROM detalle_perfil_medidas
       WHERE id_perfil = ?
       ORDER BY orden ASC, id_detalle ASC`,
      [idPerfil]
    );
    return rows;
  },

  // Crear mueble
  async create(datos) {
    const {
      id_categorias,
      id_categoria,
      id_perfil,
      nombre,
      descripcion,
      precio,
      precio_oferta,
      activo,
      destacado,
      slug
    } = datos;

    const catId = id_categorias || id_categoria;
    let baseSlug = slug ? generateSlug(slug) : generateSlug(nombre);

    // Evitar colisión de slugs
    let finalSlug = baseSlug;
    let count = 1;
    while (true) {
      const [check] = await db.query('SELECT id_muebles FROM muebles WHERE slug = ?', [finalSlug]);
      if (check.length === 0) break;
      finalSlug = `${baseSlug}-${count++}`;
    }

    const [result] = await db.query(
      `INSERT INTO muebles (
        id_categorias,
        id_perfil,
        nombre,
        descripcion,
        precio,
        precio_oferta,
        activo,
        destacado,
        slug
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        catId,
        id_perfil || null,
        nombre.trim(),
        descripcion?.trim() || null,
        Number(precio),
        precio_oferta ? Number(precio_oferta) : null,
        activo !== undefined ? (activo ? 1 : 0) : 1,
        destacado ? 1 : 0,
        finalSlug
      ]
    );

    return result.insertId;
  },

  // Agregar imagen al mueble
  async addImage(idMuebles, urlImagen, orden = 1) {
    const [result] = await db.query(
      'INSERT INTO imagenes_muebles (id_muebles, url_imagen, orden) VALUES (?, ?, ?)',
      [idMuebles, urlImagen.trim(), Number(orden) || 1]
    );
    return result.insertId;
  },

  // Actualizar o reemplazar la imagen principal
  async setMainImage(idMuebles, urlImagen) {
    if (!urlImagen || !urlImagen.trim()) return;

    const [existing] = await db.query(
      'SELECT id_imagenes FROM imagenes_muebles WHERE id_muebles = ? ORDER BY orden ASC, id_imagenes ASC LIMIT 1',
      [idMuebles]
    );

    if (existing.length > 0) {
      await db.query(
        'UPDATE imagenes_muebles SET url_imagen = ? WHERE id_imagenes = ?',
        [urlImagen.trim(), existing[0].id_imagenes]
      );
    } else {
      await this.addImage(idMuebles, urlImagen.trim(), 1);
    }
  },

  // Actualizar mueble
  async update(id, datos) {
    const {
      id_categorias,
      id_categoria,
      id_perfil,
      nombre,
      descripcion,
      precio,
      precio_oferta,
      activo,
      destacado,
      slug
    } = datos;

    const catId = id_categorias || id_categoria;
    const finalSlug = slug ? generateSlug(slug) : generateSlug(nombre);

    await db.query(
      `UPDATE muebles
       SET id_categorias = COALESCE(?, id_categorias),
           id_perfil = COALESCE(?, id_perfil),
           nombre = ?,
           descripcion = ?,
           precio = ?,
           precio_oferta = ?,
           activo = ?,
           destacado = COALESCE(?, destacado),
           slug = ?
       WHERE id_muebles = ?`,
      [
        catId || null,
        id_perfil !== undefined ? id_perfil : null,
        nombre.trim(),
        descripcion?.trim() || null,
        Number(precio),
        precio_oferta ? Number(precio_oferta) : null,
        activo !== undefined ? (activo ? 1 : 0) : 1,
        destacado !== undefined ? (destacado ? 1 : 0) : null,
        finalSlug,
        id
      ]
    );

    return this.getById(id);
  },

  // Eliminar dependencias
  async deleteDependencies(idMuebles) {
    await db.query('DELETE FROM imagenes_muebles WHERE id_muebles = ?', [idMuebles]);
    await db.query('DELETE FROM muebles_materiales WHERE id_muebles = ?', [idMuebles]);
    await db.query('DELETE FROM variantes_muebles WHERE id_muebles = ?', [idMuebles]);
  },

  // Eliminar mueble
  async delete(idMuebles) {
    const [result] = await db.query('DELETE FROM muebles WHERE id_muebles = ?', [idMuebles]);
    return result.affectedRows > 0;
  }
};
