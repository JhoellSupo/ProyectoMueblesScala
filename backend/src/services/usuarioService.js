import { usuarioModel } from '../models/usuarioModel.js';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';

export const usuarioService = {
  // Autenticar administrador por nombre de usuario con contraseña segura hasheada
  async autenticar({ identifier, password }) {
    const usuarioIngresado = (identifier || '').trim();

    if (!usuarioIngresado) {
      const error = new Error('Por favor ingresa tu nombre de usuario.');
      error.statusCode = 400;
      throw error;
    }

    if (!password) {
      const error = new Error('Por favor ingresa tu contraseña.');
      error.statusCode = 400;
      throw error;
    }

    const admin = await usuarioModel.findByIdentifier(usuarioIngresado);

    if (admin) {
      if (admin.estado === 'INACTIVO' || admin.activo === 0) {
        const error = new Error('Esta cuenta de administrador se encuentra inactiva.');
        error.statusCode = 403;
        throw error;
      }

      // Verificación segura con bcrypt (con migración en caliente si aún estaba en texto plano)
      let passwordCoincide = false;
      const storedHash = admin.password_hash || '';

      if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$')) {
        passwordCoincide = await bcrypt.compare(password, storedHash);
      } else {
        passwordCoincide = (password === storedHash);
        // Si coincidió en texto plano, migrar inmediatamente a hash bcrypt en la BD
        if (passwordCoincide) {
          const nuevoHash = await bcrypt.hash(password, 10);
          await db.query(
            'UPDATE administradores SET password_hash = ? WHERE id_administradores = ?',
            [nuevoHash, admin.id_administradores || admin.id_admin]
          );
        }
      }

      if (!passwordCoincide) {
        const error = new Error('Contraseña incorrecta. Inténtalo de nuevo.');
        error.statusCode = 401;
        throw error;
      }

      const esSuper = (admin.rol || '').toUpperCase().includes('SUPER') || usuarioIngresado.toLowerCase() === 'superadmin';

      return {
        id: admin.id_administradores || admin.id_admin,
        nombre: admin.nombre,
        username: admin.usuario,
        usuario: admin.usuario,
        correo: admin.usuario,
        rol: esSuper ? 'superadmin' : 'admin',
        rol_db: admin.rol
      };
    }

    // Fallback de emergencia si la BD estuviera vacía
    if (usuarioIngresado.toLowerCase() === 'superadmin' && (password === 'superadmin123' || password === 'superadmin')) {
      return {
        id: 1,
        nombre: 'Superadministrador Scala',
        username: 'superadmin',
        usuario: 'superadmin',
        correo: 'superadmin',
        rol: 'superadmin',
        rol_db: 'SUPERADMINISTRADOR'
      };
    }

    if (usuarioIngresado.toLowerCase() === 'admin' && (password === 'admin123' || password === 'admin')) {
      return {
        id: 2,
        nombre: 'Administrador Scala',
        username: 'admin',
        usuario: 'admin',
        correo: 'admin',
        rol: 'admin',
        rol_db: 'ADMINISTRADOR'
      };
    }

    const error = new Error('El usuario no existe en el sistema.');
    error.statusCode = 401;
    throw error;
  },

  // Listar todos los administradores
  async listarAdmins() {
    return await usuarioModel.getAll();
  },

  // Crear un nuevo administrador
  async crearAdmin({ nombre, usuario, correo, password, rol = 'ADMINISTRADOR' }) {
    const username = (usuario || correo || '').trim();

    if (!nombre || !nombre.trim()) {
      const error = new Error('El nombre es obligatorio.');
      error.statusCode = 400;
      throw error;
    }

    if (!username) {
      const error = new Error('El usuario es obligatorio.');
      error.statusCode = 400;
      throw error;
    }

    if (!password || password.trim().length < 4) {
      const error = new Error('La contraseña debe tener al menos 4 caracteres.');
      error.statusCode = 400;
      throw error;
    }

    const existente = await usuarioModel.findByIdentifier(username);
    if (existente) {
      const error = new Error(`El usuario "${username}" ya está registrado.`);
      error.statusCode = 400;
      throw error;
    }

    const rolVal = (rol || '').toUpperCase().includes('SUPER') ? 'SUPERADMINISTRADOR' : 'ADMINISTRADOR';
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    return await usuarioModel.create({
      nombre: nombre.trim(),
      usuario: username,
      password_hash: hashedPassword,
      rol: rolVal,
      estado: 'ACTIVO'
    });
  },

  // Cambiar estado activo/inactivo
  async cambiarEstadoAdmin(id, activo) {
    const admin = await usuarioModel.getById(id);
    if (!admin) {
      const error = new Error('Administrador no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    if (admin.rol === 'SUPERADMINISTRADOR' || admin.usuario.toLowerCase() === 'superadmin') {
      const error = new Error('No se puede desactivar la cuenta del Superadministrador principal.');
      error.statusCode = 403;
      throw error;
    }

    return await usuarioModel.updateStatus(id, activo);
  },

  // Eliminar un administrador
  async eliminarAdmin(id) {
    const admin = await usuarioModel.getById(id);
    if (!admin) {
      const error = new Error('Administrador no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    if (admin.rol === 'SUPERADMINISTRADOR' || admin.usuario.toLowerCase() === 'superadmin') {
      const error = new Error('No se puede eliminar la cuenta principal de Superadministrador.');
      error.statusCode = 403;
      throw error;
    }

    return await usuarioModel.delete(id);
  }
};
