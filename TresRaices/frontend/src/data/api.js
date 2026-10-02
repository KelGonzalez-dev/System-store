export const API_BASE_URL = 'https://api.cooperativatresraices.com';

const TOKEN_KEY = 'tr-admin-token';

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {}
};

async function solicitar(path, { method = 'GET', body, token, isForm = false } = {}) {
  const headers = {};
  if (!isForm) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let respuesta;
  try {
    respuesta = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: isForm ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
  }

  let datos = null;
  try {
    datos = await respuesta.json();
  } catch {
    throw new Error('El servidor no respondió correctamente.');
  }

  if (!respuesta.ok || datos?.exito === false) {
    throw new Error(datos?.error || 'Ocurrió un error inesperado.');
  }

  return datos;
}

export const obtenerCategoriasPublicas = () => solicitar('/public/categorias.php').then((d) => d.categorias);

export const obtenerDocumentosPublicos = (categoria) =>
  solicitar(`/public/documentos.php${categoria ? `?categoria=${encodeURIComponent(categoria)}` : ''}`).then((d) => d.documentos);

export const urlDescarga = (id) => `${API_BASE_URL}/public/descargar.php?id=${id}`;

export const iniciarSesion = (usuario, clave) => solicitar('/admin/login.php', { method: 'POST', body: { usuario, clave } });

export const cerrarSesionApi = (token) => solicitar('/admin/logout.php', { method: 'POST', token });

export const obtenerPerfil = (token) => solicitar('/admin/perfil.php', { token }).then((d) => d.usuario);

export const obtenerCategoriasAdmin = (token) => solicitar('/admin/categorias.php', { token }).then((d) => d.categorias);

export const crearCategoria = (token, datos) => solicitar('/admin/categorias.php', { method: 'POST', token, body: datos });

export const obtenerDocumentosAdmin = (token) => solicitar('/admin/documentos.php', { token }).then((d) => d.documentos);

export const subirDocumento = (token, formData) =>
  solicitar('/admin/documentos.php', { method: 'POST', token, body: formData, isForm: true });

export const actualizarDocumento = (token, id, cambios) =>
  solicitar(`/admin/documentos.php?id=${id}`, { method: 'PUT', token, body: cambios });

export const eliminarDocumento = (token, id) => solicitar(`/admin/documentos.php?id=${id}`, { method: 'DELETE', token });
