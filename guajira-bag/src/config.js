/**
 * URL base del servidor API (sin /api al final).
 * En producción, define REACT_APP_API_URL en .env
 */
export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/** URL base para llamadas REST (incluye /api). */
export const API_URL = `${API_BASE}/api`;

/** Convierte rutas relativas de uploads a URL absoluta. */
export const toMediaUrl = (url) => {
  if (!url) return null;
  return url.startsWith('http') ? url : `${API_BASE}${url}`;
};