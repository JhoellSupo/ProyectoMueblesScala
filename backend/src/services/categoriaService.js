import { categoriaModel } from '../models/categoriaModel.js';

export const categoriaService = {
  // Obtener todas las categorías
  async listarCategorias() {
    return await categoriaModel.getAll();
  },

  // Obtener una categoría por ID
  async obtenerPorId(id) {
    const categoria = await categoriaModel.getById(id);
    if (!categoria) {
      const error = new Error('Categoría no encontrada');
      error.statusCode = 404;
      throw error;
    }
    return categoria;
  },

  // Crear una nueva categoría con validaciones
  async crearCategoria({ nombre, descripcion }) {
    if (!nombre || !nombre.trim()) {
      const error = new Error('El nombre de la categoría es obligatorio.');
      error.statusCode = 400;
      throw error;
    }

    const duplicado = await categoriaModel.findByName(nombre);
    if (duplicado) {
      const error = new Error('Ya existe una categoría con este nombre.');
      error.statusCode = 400;
      throw error;
    }

    return await categoriaModel.create({ nombre, descripcion });
  },

  // Actualizar una categoría existente
  async actualizarCategoria(id, { nombre, descripcion }) {
    if (!nombre || !nombre.trim()) {
      const error = new Error('El nombre de la categoría es obligatorio.');
      error.statusCode = 400;
      throw error;
    }

    const categoriaExistente = await categoriaModel.getById(id);
    if (!categoriaExistente) {
      const error = new Error('Categoría no encontrada');
      error.statusCode = 404;
      throw error;
    }

    const duplicado = await categoriaModel.findByName(nombre, id);
    if (duplicado) {
      const error = new Error('Ya existe otra categoría con este nombre.');
      error.statusCode = 400;
      throw error;
    }

    return await categoriaModel.update(id, { nombre, descripcion });
  },

  // Eliminar categoría con validación de muebles dependientes
  async eliminarCategoria(id) {
    const categoria = await categoriaModel.getById(id);
    if (!categoria) {
      const error = new Error('Categoría no encontrada');
      error.statusCode = 404;
      throw error;
    }

    const productosAsociados = await categoriaModel.countProducts(id);
    if (productosAsociados > 0) {
      const error = new Error(
        `No se puede eliminar la categoría porque tiene ${productosAsociados} producto(s) asociado(s). Reasigna o elimina los productos primero.`
      );
      error.statusCode = 400;
      throw error;
    }

    return await categoriaModel.delete(id);
  }
};
