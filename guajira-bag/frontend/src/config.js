/**
 * URL base del servidor API (sin /api al final, sin slash final).
 * En producción, define REACT_APP_API_URL en .env
 */
// Normaliza la base de la API (quita slash final si existe)
const _rawApiBase = process.env.REACT_APP_API_URL || 'https://api.guajirabags.com';
export const API_BASE = String(_rawApiBase).replace(/\/+$/, '');

/** URL base para llamadas REST (incluye /api). */
export const API_URL = `${API_BASE}/api`;

/** Convierte rutas relativas de uploads a URL absoluta. */
export const toMediaUrl = (url) => {
  if (!url) return null;
  if (String(url).startsWith('http')) return url;
  return `${API_BASE}/${String(url).replace(/^\/+/, '')}`;
};