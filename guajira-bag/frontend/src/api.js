import axios from 'axios';
import { API_URL } from './config';

const api = axios.create({ baseURL: API_URL });

// ── Inyectar token en cada request ───────────────────────────
api.interceptors.request.use(config => {
  const token = localStorage.getItem('gb_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ─────────────────────────────────────────────────────
export const login = (data) =>
  api.post('/auth/login', data).then(r => r.data);

// ── Productos ────────────────────────────────────────────────
// NOTA: se agrega `_ts` (timestamp) a los GET para evitar que el navegador
// (sobre todo en móviles) sirva una respuesta cacheada idéntica a la anterior
// justo después de guardar una edición, lo que hacía parecer que el
// producto "no se actualizaba" aunque el backend sí lo hubiera guardado.
export const getProductos = (pagina = 1, porPagina = 15, soloActivos = true) =>
  api.get('/productos', {
    params: { pagina, porPagina, soloActivos, _ts: Date.now() }
  }).then(r => r.data);

export const createProducto = (formData) =>
  api.post('/productos', formData).then(r => r.data);

export const updateProducto = (id, formData) =>
  api.put(`/productos/${id}`, formData).then(r => r.data);

export const deleteProducto = (id) =>
  api.delete(`/productos/${id}`);

export const addProductoImagen = (id, formData) =>
  api.post(`/productos/${id}/imagenes`, formData).then(r => r.data);

export const deleteProductoImagen = (id, imagenId) =>
  api.delete(`/productos/${id}/imagenes/${imagenId}`).then(r => r.data);

// ── Galería ──────────────────────────────────────────────────
export const getGaleria = (soloActivos = false) =>
  api.get('/galeria', {
    params: { soloActivos, _ts: Date.now() }
  }).then(r => r.data);

export const createGaleriaItem = (formData) =>
  api.post('/galeria', formData).then(r => r.data);

export const updateGaleriaItem = (id, data) =>
  api.put(`/galeria/${id}`, data).then(r => r.data);

export const deleteGaleriaItem = (id) =>
  api.delete(`/galeria/${id}`);

export default api;