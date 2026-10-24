import { useEffect } from 'react';
import { LOGO, SITE_NAME, SITE_URL } from '../lib/seo';

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!content) { el?.remove(); return; }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!data) { el?.remove(); return; }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Título, descripción, dirección canónica, vista previa para redes (Open Graph / X) y datos estructurados.
 * noindex: para búsquedas y filtros de precio (evita páginas duplicadas en Google).
 */
export default function Seo({ title, description, path = '/', image, imageAlt, jsonLd, keywords, noindex = false, type = 'website' }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Mochilas Wayuu y Kankuamas tejidas a mano`;
    const url = `${SITE_URL}${path}`;
    const img = image || LOGO;
    document.title = fullTitle;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'keywords', keywords);
    upsertMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:locale', 'es_CO');
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', img);
    upsertMeta('property', 'og:image:alt', imageAlt || fullTitle);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', img);
    upsertLink('canonical', url);
    upsertJsonLd('seo-jsonld', jsonLd);
  }, [title, description, path, image, imageAlt, jsonLd, keywords, noindex, type]);

  return null;
}

export { SITE_URL };
