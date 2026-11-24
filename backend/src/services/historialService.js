import { historialModel } from '../models/historialModel.js';

export const historialService = {
  // Registrar una acción
  async registrar({ id_muebles, id_mueble, nombre_mueble, accion, id_administradores, id_admin, usuario_admin, detalles }) {
    const finalMuebleId = id_muebles || id_mueble || null;
    const finalAdminId = id_administradores || id_admin || null;

    return await historialModel.registrar({
      id_muebles: finalMuebleId,
      id_mueble: finalMuebleId,
      nombre_mueble: nombre_mueble || 'Mueble',
      accion,
      id_administradores: finalAdminId,
      id_admin: finalAdminId,
      usuario_admin: usuario_admin || 'admin',
      detalles
    });
  },

  // Obtener listado de modificaciones
  async listar(filtros = {}) {
    return await historialModel.getAll(filtros);
  },

  // Limpiar historial
  async limpiar() {
    return await historialModel.clear();
  }
};
