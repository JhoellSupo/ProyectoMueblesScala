const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Cliente HTTP base para realizar peticiones a la API
 */
export async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const adminHeader = {};
  try {
    const saved = localStorage.getItem('scala_admin_user');
    if (saved) {
      const u = JSON.parse(saved);
      if (u?.nombre || u?.username) {
        adminHeader['x-admin-user'] = u.nombre || u.username;
      }
    }
  } catch {
    // ignorar si no hay storage
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...adminHeader,
      ...options.headers
    },
    ...options
  };

  const response = await fetch(url, config);
  const data = await response.json().catch(() => null);

  if (!response.ok || (data && data.success === false)) {
    const errorMessage = data?.message || `Error en la petición: ${response.status} ${response.statusText}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Convierte rutas relativas (ej. /uploads/...) en URL absolutas accesibles
 */
export function formatImageUrl(url) {
  if (!url) return '/paguinalogo.jpeg';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  if (url.startsWith('/')) {
    return `${API_BASE_URL}${url}`;
  }
  return `${API_BASE_URL}/${url}`;
}

/**
 * Sube un archivo de imagen al servidor automáticamente
 */
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('imagen', file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    throw new Error(data?.message || 'Error al subir la imagen al servidor');
  }

  // Retorna la ruta relativa que se guarda automáticamente en la base de datos
  return data.url;
}

export { API_BASE_URL };
