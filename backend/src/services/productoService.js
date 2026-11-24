import { productoModel } from '../models/productoModel.js';
import { categoriaModel } from '../models/categoriaModel.js';
import { historialService } from './historialService.js';
import db from '../config/db.js';

export const productoService = {
  // Listar productos con filtros
  async listarProductos(filtros) {
    return await productoModel.getAll(filtros);
  },

  // Obtener producto por ID o por Slug junto a sus imágenes y medidas
  async obtenerPorId(id) {
    const producto = await productoModel.getById(id);
    if (!producto) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }
    const imagenes = await productoModel.getImages(producto.id_muebles);
    const medidas = producto.id_perfil ? await productoModel.getMedidas(producto.id_perfil) : [];

    return {
      ...producto,
      imagenes,
      medidas
    };
  },

  // Crear un nuevo producto
  async crearProducto(datos) {
    const { nombre, precio, id_categoria, id_categorias, imagen_url, url_imagen, usuario_admin } = datos;
    const catId = id_categorias || id_categoria;

    if (!nombre || !nombre.trim()) {
      const error = new Error('El nombre del producto es obligatorio.');
      error.statusCode = 400;
      throw error;
    }

    if (precio === undefined || isNaN(precio) || Number(precio) < 0) {
      const error = new Error('El precio debe ser un número válido mayor o igual a 0.');
      error.statusCode = 400;
      throw error;
    }

    if (!catId) {
      const error = new Error('Debe seleccionar una categoría válida.');
      error.statusCode = 400;
      throw error;
    }

    const categoria = await categoriaModel.getById(catId);
    if (!categoria) {
      const error = new Error('La categoría seleccionada no existe.');
      error.statusCode = 400;
      throw error;
    }

    // Gestionar perfil de medidas si vienen dimensiones
    let perfilId = datos.id_perfil || null;
    const tieneMedidas = datos.largo_cm || datos.ancho_cm || datos.alto_cm;
    if (tieneMedidas) {
      const [pRes] = await db.query(
        'INSERT INTO perfil_medidas (nombre, activo) VALUES (?, 1)',
        [`Perfil ${nombre.trim()}`]
      );
      perfilId = pRes.insertId;
      await db.query(
        'INSERT INTO detalle_perfil_medidas (id_perfil, nombre_pieza, cantidad, largo_cm, ancho_cm, alto_cm, orden) VALUES (?, ?, 1, ?, ?, ?, 1)',
        [perfilId, 'Estructura principal', datos.largo_cm || null, datos.ancho_cm || null, datos.alto_cm || null]
      );
    }

    // Insertar mueble
    const idNuevoMueble = await productoModel.create({
      ...datos,
      id_categorias: catId,
      id_perfil: perfilId
    });

    // Guardar imagen si viene una URL
    const img = url_imagen || imagen_url;
    if (img && img.trim()) {
      await productoModel.addImage(idNuevoMueble, img.trim(), 1);
    }

    // Registrar en Historial
    try {
      await historialService.registrar({
        id_muebles: idNuevoMueble,
        nombre_mueble: nombre.trim(),
        accion: 'CREAR',
        usuario_admin: usuario_admin || 'admin',
        detalles: `Mueble creado con precio S/. ${Number(precio).toFixed(2)} en categoría "${categoria.nombre}".`
      });
    } catch (hErr) {
      console.warn('No se pudo registrar historial al crear:', hErr.message);
    }

    return await productoModel.getById(idNuevoMueble);
  },

  // Actualizar producto existente
  async actualizarProducto(id, datos) {
    const productoExistente = await productoModel.getById(id);
    if (!productoExistente) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const { nombre, precio, id_categoria, id_categorias, imagen_url, url_imagen, usuario_admin } = datos;
    const catId = id_categorias || id_categoria || productoExistente.id_categorias;

    if (!nombre || !nombre.trim()) {
      const error = new Error('El nombre del producto es obligatorio.');
      error.statusCode = 400;
      throw error;
    }

    if (precio === undefined || isNaN(precio) || Number(precio) < 0) {
      const error = new Error('El precio debe ser un número válido mayor o igual a 0.');
      error.statusCode = 400;
      throw error;
    }

    // Identificar cambios para el historial
    const cambios = [];
    if (nombre.trim() !== productoExistente.nombre) {
      cambios.push(`Nombre: "${productoExistente.nombre}" → "${nombre.trim()}"`);
    }
    if (Number(precio) !== Number(productoExistente.precio)) {
      cambios.push(`Precio: S/. ${Number(productoExistente.precio).toFixed(2)} → S/. ${Number(precio).toFixed(2)}`);
    }
    if (String(catId) !== String(productoExistente.id_categorias)) {
      const nuevaCat = await categoriaModel.getById(catId);
      cambios.push(`Categoría: "${productoExistente.categoria || 'Anterior'}" → "${nuevaCat?.nombre || catId}"`);
    }
    if (datos.descripcion && datos.descripcion.trim() !== (productoExistente.descripcion || '').trim()) {
      cambios.push('Descripción modificada');
    }
    const img = url_imagen || imagen_url;
    if (img !== undefined && img.trim() !== (productoExistente.url_imagen || productoExistente.imagen_url || '').trim()) {
      cambios.push('Foto principal actualizada');
    }

    // Actualizar o crear medidas
    const tieneMedidas = datos.largo_cm || datos.ancho_cm || datos.alto_cm;
    if (tieneMedidas) {
      if (productoExistente.id_perfil) {
        const [det] = await db.query('SELECT id_detalle FROM detalle_perfil_medidas WHERE id_perfil = ? LIMIT 1', [productoExistente.id_perfil]);
        if (det.length > 0) {
          await db.query(
            'UPDATE detalle_perfil_medidas SET largo_cm = ?, ancho_cm = ?, alto_cm = ? WHERE id_detalle = ?',
            [datos.largo_cm || null, datos.ancho_cm || null, datos.alto_cm || null, det[0].id_detalle]
          );
        } else {
          await db.query(
            'INSERT INTO detalle_perfil_medidas (id_perfil, nombre_pieza, cantidad, largo_cm, ancho_cm, alto_cm, orden) VALUES (?, ?, 1, ?, ?, ?, 1)',
            [productoExistente.id_perfil, 'Estructura principal', datos.largo_cm || null, datos.ancho_cm || null, datos.alto_cm || null]
          );
        }
      } else {
        const [pRes] = await db.query(
          'INSERT INTO perfil_medidas (nombre, activo) VALUES (?, 1)',
          [`Perfil ${nombre.trim()}`]
        );
        const nuevoPerfilId = pRes.insertId;
        await db.query(
          'INSERT INTO detalle_perfil_medidas (id_perfil, nombre_pieza, cantidad, largo_cm, ancho_cm, alto_cm, orden) VALUES (?, ?, 1, ?, ?, ?, 1)',
          [nuevoPerfilId, 'Estructura principal', datos.largo_cm || null, datos.ancho_cm || null, datos.alto_cm || null]
        );
        datos.id_perfil = nuevoPerfilId;
      }
      cambios.push('Medidas actualizadas');
    }

    await productoModel.update(productoExistente.id_muebles, {
      ...datos,
      id_categorias: catId,
      id_perfil: datos.id_perfil !== undefined ? datos.id_perfil : productoExistente.id_perfil
    });

    if (img !== undefined) {
      await productoModel.setMainImage(productoExistente.id_muebles, img);
    }

    // Registrar en Historial
    try {
      const resumenCambios = cambios.length > 0 ? cambios.join(' | ') : 'Datos generales del mueble actualizados';
      await historialService.registrar({
        id_muebles: productoExistente.id_muebles,
        nombre_mueble: nombre.trim(),
        accion: 'ACTUALIZAR',
        usuario_admin: usuario_admin || 'admin',
        detalles: resumenCambios
      });
    } catch (hErr) {
      console.warn('No se pudo registrar historial al actualizar:', hErr.message);
    }

    return await productoModel.getById(productoExistente.id_muebles);
  },

  // Cambiar estado activo/inactivo rápidamente
  async cambiarEstado(id, nuevoEstado, adminInfo = {}) {
    const producto = await productoModel.getById(id);
    if (!producto) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const resultado = await productoModel.update(producto.id_muebles, {
      ...producto,
      activo: nuevoEstado ? 1 : 0
    });

    // Registrar en Historial
    try {
      await historialService.registrar({
        id_muebles: producto.id_muebles,
        nombre_mueble: producto.nombre,
        accion: 'CAMBIO_ESTADO',
        usuario_admin: adminInfo.usuario_admin || 'admin',
        detalles: `Estado cambiado a ${nuevoEstado ? 'Activo (Visible en tienda)' : 'Inactivo (Oculto)'}`
      });
    } catch (hErr) {
      console.warn('No se pudo registrar historial al cambiar estado:', hErr.message);
    }

    return resultado;
  },

  // Eliminar producto y sus dependencias
  async eliminarProducto(id, adminInfo = {}) {
    const producto = await productoModel.getById(id);
    if (!producto) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }

    // Registrar en Historial antes de borrar
    try {
      await historialService.registrar({
        id_muebles: producto.id_muebles,
        nombre_mueble: producto.nombre,
        accion: 'ELIMINAR',
        usuario_admin: adminInfo.usuario_admin || 'admin',
        detalles: `Mueble "${producto.nombre}" (ID: ${producto.id_muebles}) eliminado permanentemente del catálogo.`
      });
    } catch (hErr) {
      console.warn('No se pudo registrar historial al eliminar:', hErr.message);
    }

    await productoModel.deleteDependencies(producto.id_muebles);
    return await productoModel.delete(producto.id_muebles);
  }
};
