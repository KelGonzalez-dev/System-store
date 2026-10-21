/**
 * URL base del servidor API (sin /api al final). Se define en .env:
 *   REACT_APP_API_URL=https://api.guajirabags.com
 */
const RAW = import.meta.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL || 'https://api.guajirabags.com';
export const API_BASE = String(RAW).replace(/\/+$/, '');
export const API_URL = `${API_BASE}/api`;

/** Ruta relativa de uploads → URL absoluta del archivo original. */
export const toMediaUrl = (url) => {
  if (!url) return null;
  if (/^(https?:|data:|blob:)/.test(url)) return url;
  if (url.startsWith('/images/')) return url; // imágenes propias del sitio
  return `${API_BASE}/${String(url).replace(/^\/+/, '')}`;
};

/**
 * Miniatura optimizada (WebP) generada por la API: /img/{ancho}/uploads/...
 * Una foto de 4 MB se entrega en ~30–120 KB según el tamaño en pantalla.
 */
export const thumb = (url, w = 640) => {
  if (!url) return null;
  const clean = String(url).replace(/^https?:\/\/[^/]+/, '').replace(/^\/+/, '');
  if (!clean.startsWith('uploads/')) return toMediaUrl(url);
  return `${API_BASE}/img/${w}/${clean}`;
};

/** srcSet con varios anchos para que el navegador elija según la pantalla. */
export const srcSet = (url, widths = [320, 640, 960]) => {
  const clean = String(url || '').replace(/^https?:\/\/[^/]+/, '').replace(/^\/+/, '');
  if (!clean.startsWith('uploads/')) return undefined;
  return widths.map((w) => `${API_BASE}/img/${w}/${clean} ${w}w`).join(', ');
};
