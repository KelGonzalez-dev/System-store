/**
 * SEO de Guajira Bags: direcciones limpias y datos estructurados (schema.org) para Google.
 * Estas mismas funciones las usa el script de prerender (scripts/prerender.mjs) al compilar.
 */
export const SITE_URL = 'https://www.guajirabags.com';
export const SITE_NAME = 'Guajira Bags';
export const LOGO = `${SITE_URL}/images/logo-512.png`;
export const SOCIAL = ['https://www.instagram.com/guajira_bags/', 'https://www.tiktok.com/@.guajira.bags'];
export const WHATSAPP = '+573234181203';

/** Texto limpio para descripciones (sin saltos de línea ni espacios dobles) y con punto final. */
export const frase = (t) => { const x = String(t || '').replace(/\s+/g, ' ').trim(); return x && !/[.!?…]$/.test(x) ? `${x}.` : x; };

export const slugify = (s) => String(s || '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  .slice(0, 70) || 'mochila';

/** Dirección pública de una mochila: /mochila/35-aurora-boreal */
export const productPath = (p) => `/mochila/${p.id}-${slugify(p.name ?? p.nombre)}`;
/** Dirección pública de una categoría: /catalogo/recamadas */
export const categoryPath = (c) => (c ? `/catalogo/${c.slug ?? c}` : '/catalogo');
/** Id de la mochila a partir de "35-aurora-boreal" */
export const idFromRef = (ref) => { const n = parseInt(String(ref || ''), 10); return Number.isFinite(n) && n > 0 ? n : null; };

const abs = (u) => (!u ? null : /^https?:/.test(u) ? u : `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`);

export const organizationLd = () => ({
  '@type': ['Store', 'Organization'],
  '@id': `${SITE_URL}/#tienda`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: LOGO,
  image: LOGO,
  description: 'Mochilas Wayuu y Kankuamas tejidas a mano por artesanas de La Guajira, Colombia. Piezas únicas, envíos a toda Colombia.',
  telephone: WHATSAPP,
  priceRange: '$$',
  currenciesAccepted: 'COP',
  address: { '@type': 'PostalAddress', addressLocality: 'Riohacha', addressRegion: 'La Guajira', addressCountry: 'CO' },
  areaServed: { '@type': 'Country', name: 'Colombia' },
  sameAs: SOCIAL,
});

export const websiteLd = () => ({
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#web`,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  inLanguage: 'es-CO',
  publisher: { '@id': `${SITE_URL}/#tienda` },
  // Cuadro de búsqueda de Google: lleva directo al buscador del catálogo
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/catalogo?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
});

export const breadcrumbLd = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE_URL}${path}` })),
});

/** Lista de mochilas de una página del catálogo (Google la entiende como colección de productos). */
export const itemListLd = (products, toImage) => ({
  '@type': 'ItemList',
  itemListElement: products.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `${SITE_URL}${productPath(p)}`,
    name: p.name ?? p.nombre,
    image: abs(toImage ? toImage(p) : (p.photos?.[0] ?? p.imagenUrl)),
  })),
});

/** Ficha de producto con precio, disponibilidad, envío y reseñas (resultados enriquecidos en Google). */
export const productLd = (p, { rating, mediaUrl } = {}) => {
  const fotos = (p.photos ?? [p.imagenUrl, ...(p.imagenes || [])]).filter(Boolean).map((u) => abs(mediaUrl ? mediaUrl(u) : u));
  const categoria = p.categoria?.nombre;
  const url = `${SITE_URL}${productPath(p)}`;
  const ld = {
    '@type': 'Product',
    '@id': `${url}#producto`,
    name: p.name ?? p.nombre,
    description: frase(p.details ?? p.descripcionLarga ?? p.desc ?? p.descripcion) || 'Mochila Wayuu tejida a mano en La Guajira.',
    image: fotos.length ? fotos : [LOGO],
    url,
    sku: p.codigo || `GB-${p.id}`,
    brand: { '@type': 'Brand', name: SITE_NAME },
    category: categoria ? `Mochilas > ${categoria}` : 'Mochilas Wayuu',
    material: 'Hilo tejido a mano',
    countryOfOrigin: 'CO',
    ...(p.talla ? { size: p.talla } : {}),
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'COP',
      price: Number(p.price ?? p.precio),
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': `${SITE_URL}/#tienda` },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'CO' },
      },
    },
  };
  if (rating?.total > 0) {
    ld.aggregateRating = { '@type': 'AggregateRating', ratingValue: Number(rating.promedio).toFixed(1), reviewCount: rating.total, bestRating: 5, worstRating: 1 };
  }
  return ld;
};

/** Junta varios bloques en un solo @graph */
export const graph = (...nodes) => ({ '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) });
