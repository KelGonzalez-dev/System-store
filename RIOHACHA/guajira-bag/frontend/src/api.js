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
// opciones: { q, orden: 'recientes'|'precio_asc'|'precio_desc'|'nombre', min, max, signal }
export const getProductos = (pagina = 1, porPagina = 15, soloActivos = true, opciones = {}) => {
  const { signal, ...filtros } = opciones;
  const params = { pagina, porPagina, soloActivos };
  Object.entries(filtros).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') params[k] = v; });
  return api.get('/productos', { params, signal }).then(r => r.data);
};

export const getProducto = (id) =>
  api.get(`/productos/${id}`).then(r => r.data);

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
    params: { soloActivos }
  }).then(r => r.data);

export const createGaleriaItem = (formData) =>
  api.post('/galeria', formData).then(r => r.data);

export const updateGaleriaItem = (id, data) =>
  api.put(`/galeria/${id}`, data).then(r => r.data);

export const deleteGaleriaItem = (id) =>
  api.delete(`/galeria/${id}`);

export default api;

// ── Reseñas ──────────────────────────────────────────────────
export const getResenas = (productoId, pagina = 1, porPagina = 5) =>
  api.get(`/productos/${productoId}/resenas`, { params: { pagina, porPagina } }).then(r => r.data);

export const crearResena = (productoId, data) =>
  api.post(`/productos/${productoId}/resenas`, data).then(r => r.data);

export const getResumenResenas = (ids) =>
  api.get('/resenas/resumen', { params: { ids: ids.join(',') } }).then(r => r.data);

export const getResenasRecientes = (n = 8) =>
  api.get('/resenas/recientes', { params: { n } }).then(r => r.data);

// Panel
export const getResenasAdmin = (params) =>
  api.get('/resenas', { params }).then(r => r.data);

export const updateResena = (id, data) =>
  api.put(`/resenas/${id}`, data).then(r => r.data);

export const deleteResena = (id) =>
  api.delete(`/resenas/${id}`);

// Reseña desde el inicio (de la tienda, sin elegir mochila)
export const crearResenaGeneral = (data) =>
  api.post('/resenas', data).then(r => r.data);
