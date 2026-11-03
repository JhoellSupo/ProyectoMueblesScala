import { marcaModel } from '../models/marcaModel.js';

export const marcaService = {
  // Listar todas las marcas
  async listarMarcas() {
    return await marcaModel.getAll();
  },

  // Obtener marca por defecto o primera disponible
  async obtenerMarcaPorDefecto() {
    let marca = await marcaModel.getFirst();
    if (!marca) {
      marca = await marcaModel.create({
        nombre: 'Scala',
        descripcion: 'Marca oficial de diseño y fabricación Muebles Scala'
      });
    }
    return marca;
  },

  // Crear nueva marca
  async crearMarca({ nombre, descripcion }) {
    if (!nombre || !nombre.trim()) {
      const error = new Error('El nombre de la marca es requerido.');
      error.statusCode = 400;
      throw error;
    }
    return await marcaModel.create({ nombre, descripcion });
  }
};
