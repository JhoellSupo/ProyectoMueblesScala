import { productoModel } from '../models/productoModel.js';
import { categoriaModel } from '../models/categoriaModel.js';
import { marcaService } from './marcaService.js';

export const productoService = {
  // Listar productos con filtros
  async listarProductos(filtros) {
    return await productoModel.getAll(filtros);
  },

  // Obtener producto por ID junto a sus imágenes
  async obtenerPorId(id) {
    const producto = await productoModel.getById(id);
    if (!producto) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }
    const imagenes = await productoModel.getImages(id);
    return {
      ...producto,
      imagenes
    };
  },

  // Crear un nuevo producto
  async crearProducto(datos) {
    const { nombre, precio, id_categoria, imagen_url } = datos;

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

    if (!id_categoria) {
      const error = new Error('Debe seleccionar una categoría válida.');
      error.statusCode = 400;
      throw error;
    }

    // Validar que la categoría exista
    const categoria = await categoriaModel.getById(id_categoria);
    if (!categoria) {
      const error = new Error('La categoría seleccionada no existe.');
      error.statusCode = 400;
      throw error;
    }

    // Asegurar marca
    let idMarca = datos.id_marca;
    if (!idMarca) {
      const marcaPorDefecto = await marcaService.obtenerMarcaPorDefecto();
      idMarca = marcaPorDefecto.id_marca;
    }

    // Insertar mueble
    const idNuevoMueble = await productoModel.create({
      ...datos,
      id_marca: idMarca
    });

    // Guardar imagen si viene una URL
    if (imagen_url && imagen_url.trim()) {
      await productoModel.addImage(idNuevoMueble, imagen_url.trim());
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

    const { nombre, precio, id_categoria, imagen_url } = datos;

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

    if (!id_categoria) {
      const error = new Error('Debe seleccionar una categoría válida.');
      error.statusCode = 400;
      throw error;
    }

    let idMarca = datos.id_marca;
    if (!idMarca) {
      idMarca = productoExistente.id_marca;
    }

    await productoModel.update(id, {
      ...datos,
      id_marca: idMarca
    });

    if (imagen_url !== undefined) {
      await productoModel.setMainImage(id, imagen_url);
    }

    return await productoModel.getById(id);
  },

  // Cambiar estado activo/inactivo rápidamente
  async cambiarEstado(id, nuevoEstado) {
    const producto = await productoModel.getById(id);
    if (!producto) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }

    return await productoModel.update(id, {
      ...producto,
      activo: nuevoEstado ? 1 : 0
    });
  },

  // Eliminar producto y sus dependencias
  async eliminarProducto(id) {
    const producto = await productoModel.getById(id);
    if (!producto) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }

    await productoModel.deleteDependencies(id);
    return await productoModel.delete(id);
  }
};
