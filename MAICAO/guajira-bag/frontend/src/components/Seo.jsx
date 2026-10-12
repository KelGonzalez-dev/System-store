import { useEffect } from 'react';

const SITE_URL = 'https://www.guajirabags.com';

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
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
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export default function Seo({ title, description, path = '/', jsonLd, keywords }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | Guajira Bags` : 'Guajira Bags — Mochilas Wayuu y Kankuama tejidas a mano';
    document.title = fullTitle;

    upsertMeta('name', 'description', description);
    if (keywords) upsertMeta('name', 'keywords', keywords);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', `${SITE_URL}${path}`);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:image', `${SITE_URL}/images/logo-512.png`);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);

    upsertLink('canonical', `${SITE_URL}${path}`);

    if (jsonLd) upsertJsonLd('seo-jsonld', jsonLd);
  }, [title, description, path, jsonLd, keywords]);

  return null;
}

export { SITE_URL };
