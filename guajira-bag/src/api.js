import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE_URL });

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
export const getProductos = (pagina = 1, porPagina = 15, soloActivos = true) =>
  api.get('/productos', { params: { pagina, porPagina, soloActivos } }).then(r => r.data);

export const createProducto = (formData) =>
  api.post('/productos', formData).then(r => r.data);

export const updateProducto = (id, formData) =>
  api.put(`/productos/${id}`, formData).then(r => r.data);

export const deleteProducto = (id) =>
  api.delete(`/productos/${id}`);

export const addProductoImagen = (id, formData) =>
  api.post(`/productos/${id}/imagenes`, formData).then(r => r.data);

// ── Galería ──────────────────────────────────────────────────
export const getGaleria = (soloActivos = false) =>
  api.get('/galeria', { params: { soloActivos } }).then(r => r.data);

export const createGaleriaItem = (formData) =>
  api.post('/galeria', formData).then(r => r.data);

export const updateGaleriaItem = (id, data) =>
  api.put(`/galeria/${id}`, data).then(r => r.data);

export const deleteGaleriaItem = (id) =>
  api.delete(`/galeria/${id}`);

export default api;