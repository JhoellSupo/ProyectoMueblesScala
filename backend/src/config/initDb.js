import db from './db.js';

export async function initDatabase() {
  try {
    // 1. Asegurar Marca por defecto
    const [marcas] = await db.query('SELECT * FROM marcas LIMIT 1');
    let defaultMarcaId;
    if (marcas.length === 0) {
      const [resMarca] = await db.query(
        'INSERT INTO marcas (nombre, descripcion) VALUES (?, ?)',
        ['Scala', 'Marca oficial de diseño y fabricación Muebles Scala']
      );
      defaultMarcaId = resMarca.insertId;
      console.log('✓ Marca por defecto creada (ID: ' + defaultMarcaId + ')');
    } else {
      defaultMarcaId = marcas[0].id_marca;
    }

    // 2. Asegurar Categorías
    const [categorias] = await db.query('SELECT * FROM categorias');
    const catMap = {};
    if (categorias.length === 0) {
      const defaultCategorias = [
        { nombre: 'Sala', descripcion: 'Juegos de sala, sofás modernos, seccionales y sillones de confort' },
        { nombre: 'Comedor', descripcion: 'Juegos de comedor, mesas elegantes y sillas de alta calidad' },
        { nombre: 'Módulos TV', descripcion: 'Centros de entretenimiento, modulares flotantes y paneles para TV' },
        { nombre: 'Dormitorio', descripcion: 'Camas de diseño, cabeceras, veladores y roperos modernos' }
      ];

      for (const cat of defaultCategorias) {
        const [resCat] = await db.query(
          'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
          [cat.nombre, cat.descripcion]
        );
        catMap[cat.nombre] = resCat.insertId;
      }
      console.log('✓ Categorías iniciales creadas con éxito');
    } else {
      categorias.forEach(c => {
        catMap[c.nombre] = c.id_categoria;
      });
    }

    // 3. Asegurar Administrador por defecto
    const [admins] = await db.query('SELECT * FROM administradores LIMIT 1');
    if (admins.length === 0) {
      await db.query(
        `INSERT INTO administradores (nombre, correo, password_hash, activo) 
         VALUES (?, ?, ?, 1)`,
        ['admin', 'admin@mueblesscala.com', 'admin123']
      );
      console.log('✓ Administrador inicial creado (usuario: admin / pass: admin123)');
    }

    // 4. Asegurar Productos de Muestra si la tabla está vacía
    const [muebles] = await db.query('SELECT * FROM muebles LIMIT 1');
    if (muebles.length === 0) {
      const idSala = catMap['Sala'] || Object.values(catMap)[0];
      const idComedor = catMap['Comedor'] || idSala;
      const idModulos = catMap['Módulos TV'] || idSala;

      const sampleMuebles = [
        {
          id_categoria: idSala,
          id_marca: defaultMarcaId,
          nombre: 'Sofá Seccional Scala Velvet Grey',
          descripcion: 'Sofá seccional de 3 piezas tapizado en terciopelo gris repelente a líquidos con estructura de madera tornillo.',
          precio: 2599.00,
          largo_cm: 260.00,
          ancho_cm: 170.00,
          alto_cm: 85.00,
          imagen_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
        },
        {
          id_categoria: idComedor,
          id_marca: defaultMarcaId,
          nombre: 'Juego de Comedor Milano 6 Sillas',
          descripcion: 'Mesa de madera maciza con acabado poliuretano brillante y 6 sillas ergonómicas tapizadas.',
          precio: 3450.00,
          largo_cm: 180.00,
          ancho_cm: 95.00,
          alto_cm: 78.00,
          imagen_url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80'
        },
        {
          id_categoria: idModulos,
          id_marca: defaultMarcaId,
          nombre: 'Panel Flotante TV Tokio con Luces LED',
          descripcion: 'Módulo flotante para TV de hasta 75 pulgadas con repisas iluminadas e iluminación LED indirecta cálida.',
          precio: 1480.00,
          largo_cm: 210.00,
          ancho_cm: 35.00,
          alto_cm: 160.00,
          imagen_url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'
        },
        {
          id_categoria: idSala,
          id_marca: defaultMarcaId,
          nombre: 'Sillón Poltrona Nórdico Amber',
          descripcion: 'Poltrona individual con patas cónicas de madera roble y cojín de alta densidad con tela antimanchas.',
          precio: 890.00,
          largo_cm: 85.00,
          ancho_cm: 80.00,
          alto_cm: 92.00,
          imagen_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
        }
      ];

      for (const m of sampleMuebles) {
        const [resM] = await db.query(
          `INSERT INTO muebles (id_categoria, id_marca, nombre, descripcion, precio, largo_cm, ancho_cm, alto_cm, activo)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [m.id_categoria, m.id_marca, m.nombre, m.descripcion, m.precio, m.largo_cm, m.ancho_cm, m.alto_cm]
        );
        const newMuebleId = resM.insertId;

        if (m.imagen_url) {
          await db.query(
            'INSERT INTO imagenes_mueble (id_mueble, url_imagen) VALUES (?, ?)',
            [newMuebleId, m.imagen_url]
          );
        }
      }
      console.log('✓ Muebles de muestra insertados con imágenes');
    }
  } catch (error) {
    console.error('Error durante initDatabase:', error);
  }
}
