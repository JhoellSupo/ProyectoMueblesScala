import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initDatabase() {
  try {
    // 0. Asegurar que la base de datos y todas las tablas existan (Auto-recuperación ante reinicios de XAMPP)
    try {
      const rawConn = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        port: Number(process.env.DB_PORT) || 3306,
        multipleStatements: true
      });

      const schemaPath = path.resolve(__dirname, 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const sql = fs.readFileSync(schemaPath, 'utf8');
        await rawConn.query(sql);
      }
      await rawConn.end();
    } catch (schemaErr) {
      console.warn('Aviso al verificar esquema inicial:', schemaErr.message);
    }

    // 1. Asegurar Administrador y Superadministrador
    const [adminCheck] = await db.query(
      "SELECT * FROM administradores WHERE usuario = 'admin'"
    );
    if (adminCheck.length === 0) {
      const defaultAdminHash = await bcrypt.hash('admin123', 10);
      await db.query(
        `INSERT INTO administradores (nombre, usuario, password_hash, rol, estado) 
         VALUES (?, ?, ?, 'ADMINISTRADOR', 'ACTIVO')`,
        ['Administrador Scala', 'admin', defaultAdminHash]
      );
      console.log('✓ Administrador inicial creado con bcrypt (usuario: admin / pass: admin123)');
    }

    const [superCheck] = await db.query(
      "SELECT * FROM administradores WHERE usuario = 'superadmin'"
    );
    if (superCheck.length === 0) {
      const defaultSuperHash = await bcrypt.hash('superadmin123', 10);
      await db.query(
        `INSERT INTO administradores (nombre, usuario, password_hash, rol, estado) 
         VALUES (?, ?, ?, 'SUPERADMINISTRADOR', 'ACTIVO')`,
        ['Superadministrador Scala', 'superadmin', defaultSuperHash]
      );
      console.log('✓ Superadministrador creado con bcrypt (usuario: superadmin / pass: superadmin123)');
    }

    // 1.1 Migrar cualquier contraseña existente en texto plano a bcrypt hash
    const [existingAdmins] = await db.query('SELECT id_administradores, usuario, password_hash FROM administradores');
    for (const a of existingAdmins) {
      const currentHash = a.password_hash || '';
      if (!currentHash.startsWith('$2a$') && !currentHash.startsWith('$2b$') && !currentHash.startsWith('$2y$')) {
        const migratedHash = await bcrypt.hash(currentHash, 10);
        await db.query(
          'UPDATE administradores SET password_hash = ? WHERE id_administradores = ?',
          [migratedHash, a.id_administradores]
        );
        console.log(`✓ Contraseña de administrador '${a.usuario}' migrada exitosamente a bcrypt hash`);
      }
    }

    // 2. Asegurar Categorías iniciales
    const [categorias] = await db.query('SELECT * FROM categorias');
    const catMap = {};

    if (categorias.length === 0) {
      const defaultCategorias = [
        {
          nombre: 'Sala',
          slug: 'sala',
          descripcion: 'Juegos de sala, sofás modernos, seccionales y sillones de confort',
          url_imagen: 'https://mi-bucket-php-2004.s3.us-east-2.amazonaws.com/sillon.jpeg'
        },
        {
          nombre: 'Comedor',
          slug: 'comedor',
          descripcion: 'Juegos de comedor, mesas elegantes y sillas de alta calidad',
          url_imagen: 'https://mi-bucket-php-2004.s3.us-east-2.amazonaws.com/comedor.png'
        },
        {
          nombre: 'Módulos TV',
          slug: 'modulos-tv',
          descripcion: 'Centros de entretenimiento, modulares flotantes y paneles para TV',
          url_imagen: 'https://mi-bucket-php-2004.s3.us-east-2.amazonaws.com/panel.jpeg'
        },
        {
          nombre: 'Dormitorio',
          slug: 'dormitorio',
          descripcion: 'Camas de diseño, cabeceras, veladores y roperos modernos',
          url_imagen: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'
        }
      ];

      for (const cat of defaultCategorias) {
        const [resCat] = await db.query(
          'INSERT INTO categorias (nombre, slug, descripcion, url_imagen, activo) VALUES (?, ?, ?, ?, 1)',
          [cat.nombre, cat.slug, cat.descripcion, cat.url_imagen]
        );
        catMap[cat.nombre] = resCat.insertId;
      }
      console.log('✓ Categorías iniciales creadas con éxito');
    } else {
      for (const c of categorias) {
        catMap[c.nombre] = c.id_categorias;
      }
    }

    // 3. Asegurar Banners del Slider
    const [banners] = await db.query('SELECT * FROM banner_slider LIMIT 1');
    if (banners.length === 0) {
      const defaultBanners = [
        {
          titulo: 'Colección de Sala Scala',
          url_imagen: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80',
          orden: 1
        },
        {
          titulo: 'Juegos de Comedor Modernos',
          url_imagen: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1600&q=80',
          orden: 2
        },
        {
          titulo: 'Centros de Entretenimiento y Módulos TV',
          url_imagen: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1600&q=80',
          orden: 3
        }
      ];

      for (const b of defaultBanners) {
        await db.query(
          'INSERT INTO banner_slider (titulo, url_imagen, orden, activo) VALUES (?, ?, ?, 1)',
          [b.titulo, b.url_imagen, b.orden]
        );
      }
      console.log('✓ Banners iniciales del slider creados');
    }

    // 4. Asegurar Muebles de Muestra
    const [muebles] = await db.query('SELECT * FROM muebles LIMIT 1');
    if (muebles.length === 0) {
      const idSala = catMap['Sala'] || Object.values(catMap)[0];
      const idComedor = catMap['Comedor'] || idSala;
      const idModulos = catMap['Módulos TV'] || idSala;

      const sampleMuebles = [
        {
          id_categorias: idSala,
          nombre: 'Sofá Seccional Scala Velvet Grey',
          slug: 'sofa-seccional-scala-velvet-grey',
          descripcion: 'Sofá seccional de 3 piezas tapizado en terciopelo gris repelente a líquidos con estructura de madera tornillo.',
          precio: 2599.00,
          precio_oferta: 2399.00,
          destacado: 1,
          imagen_url: 'https://mi-bucket-php-2004.s3.us-east-2.amazonaws.com/sillon.jpeg',
          medidas: { largo: 240, ancho: 160, alto: 85 }
        },
        {
          id_categorias: idComedor,
          nombre: 'Juego de Comedor Milano 6 Sillas',
          slug: 'juego-de-comedor-milano-6-sillas',
          descripcion: 'Mesa de madera maciza con acabado poliuretano brillante y 6 sillas ergonómicas tapizadas.',
          precio: 3450.00,
          precio_oferta: null,
          destacado: 1,
          imagen_url: 'https://mi-bucket-php-2004.s3.us-east-2.amazonaws.com/comedor.png',
          medidas: { largo: 180, ancho: 90, alto: 78 }
        },
        {
          id_categorias: idModulos,
          nombre: 'Panel Flotante TV Tokio con Luces LED',
          slug: 'panel-flotante-tv-tokio-con-luces-led',
          descripcion: 'Módulo flotante para TV de hasta 75 pulgadas con repisas iluminadas e iluminación LED indirecta cálida.',
          precio: 1480.00,
          precio_oferta: null,
          destacado: 0,
          imagen_url: 'https://mi-bucket-php-2004.s3.us-east-2.amazonaws.com/panel.jpeg',
          medidas: { largo: 180, ancho: 35, alto: 140 }
        },
        {
          id_categorias: idSala,
          nombre: 'Sillón Poltrona Nórdico Amber',
          slug: 'sillon-poltrona-nordico-amber',
          descripcion: 'Poltrona individual con patas cónicas de madera roble y cojín de alta densidad con tela antimanchas.',
          precio: 890.00,
          precio_oferta: null,
          destacado: 0,
          imagen_url: 'https://mi-bucket-php-2004.s3.us-east-2.amazonaws.com/butaca.jpeg',
          medidas: { largo: 80, ancho: 75, alto: 88 }
        }
      ];

      for (const m of sampleMuebles) {
        let perfilId = null;
        if (m.medidas) {
          const [pRes] = await db.query(
            'INSERT INTO perfil_medidas (nombre, activo) VALUES (?, 1)',
            ['Perfil ' + m.nombre]
          );
          perfilId = pRes.insertId;
          await db.query(
            'INSERT INTO detalle_perfil_medidas (id_perfil, nombre_pieza, cantidad, largo_cm, ancho_cm, alto_cm, orden) VALUES (?, ?, 1, ?, ?, ?, 1)',
            [perfilId, 'Estructura principal', m.medidas.largo, m.medidas.ancho, m.medidas.alto]
          );
        }

        const [resM] = await db.query(
          `INSERT INTO muebles (id_categorias, id_perfil, nombre, slug, descripcion, precio, precio_oferta, activo, destacado)
           VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`,
          [m.id_categorias, perfilId, m.nombre, m.slug, m.descripcion, m.precio, m.precio_oferta, m.destacado]
        );
        const newMuebleId = resM.insertId;

        if (m.imagen_url) {
          await db.query(
            'INSERT INTO imagenes_muebles (id_muebles, url_imagen, orden) VALUES (?, ?, 1)',
            [newMuebleId, m.imagen_url]
          );
        }
      }
      console.log('✓ Muebles de muestra insertados con imágenes en mueblescalabd');
    }
  } catch (error) {
    console.error('Error durante initDatabase:', error);
  }
}
