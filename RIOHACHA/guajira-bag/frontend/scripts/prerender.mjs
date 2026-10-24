/**
 * SEO al compilar (se ejecuta solo con `npm run build`):
 *  1. Crea una página HTML lista para Google por cada sección, categoría y mochila (carpeta build/__p/),
 *     con su título, descripción, vista previa para redes, datos estructurados y contenido visible.
 *  2. Genera build/sitemap.xml con todas las páginas y fotos (incluye sitemap de imágenes).
 * Si la API no responde, igual termina: genera las páginas fijas y el sitemap básico.
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  SITE_URL, SITE_NAME, LOGO, slugify, productPath, categoryPath, graph, organizationLd, websiteLd,
  breadcrumbLd, itemListLd, productLd, frase,
} from '../src/lib/seo.js';

const BUILD = path.resolve('build');
const env = Object.fromEntries((fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8') : '').split('\n')
  .map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/)).filter(Boolean).map((m) => [m[1], m[2]]));
const API = String(process.env.REACT_APP_API_URL || process.env.VITE_API_URL || env.REACT_APP_API_URL || env.VITE_API_URL || 'https://api.guajirabags.com').replace(/\/+$/, '');
const media = (u) => (!u ? null : /^https?:/.test(u) ? u : `${API}/${u.replace(/^\/+/, '')}`);
const thumb = (u, w) => (!u ? null : /^https?:/.test(u) ? u : `${API}/img/${w}/${u.replace(/^\/+/, '')}`);
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmt = (n) => `$ ${Number(n).toLocaleString('es-CO')}`;
const hoy = new Date().toISOString().slice(0, 10);

async function get(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const r = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } finally {
    clearTimeout(t);
  }
}

async function datos() {
  try {
    let cats = { categorias: [] };
    try { cats = await get(`${API}/api/categorias`); } catch { console.warn('⚠️  SEO: la API aún no tiene categorías (sube los archivos nuevos de la API).'); }
    let productos = [];
    for (let p = 1, total = 1; p <= total; p++) {
      const d = await get(`${API}/api/productos?pagina=${p}&porPagina=100&soloActivos=true`);
      productos = productos.concat(d.items || []);
      total = d.totalPaginas || 1;
    }
    let galeria = [];
    try { galeria = await get(`${API}/api/galeria`); } catch { /* opcional */ }
    return { categorias: (cats.categorias || []).filter((c) => c.total > 0), productos, galeria: Array.isArray(galeria) ? galeria : [] };
  } catch (e) {
    console.warn(`⚠️  SEO: no se pudo leer la API (${e.message}). Se generan solo las páginas fijas.`);
    return { categorias: [], productos: [], galeria: [] };
  }
}

const base = fs.readFileSync(path.join(BUILD, 'index.html'), 'utf8');

function pagina({ ruta, title, description, image, imageAlt, type = 'website', jsonLd, body, keywords }) {
  const full = `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${ruta}`;
  const img = image || LOGO;
  const head = [
    `<title>${esc(full)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    keywords ? `<meta name="keywords" content="${esc(keywords)}" />` : '',
    '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />',
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:title" content="${esc(full)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(img)}" />`,
    `<meta property="og:image:alt" content="${esc(imageAlt || full)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${esc(full)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(img)}" />`,
    `<script type="application/ld+json" id="seo-jsonld">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
  ].filter(Boolean).join('\n  ');
  let html = base
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta name="(description|keywords|robots|twitter:[a-z]+)"[^>]*>\s*/g, '')
    .replace(/<meta property="og:[a-z:]+"[^>]*>\s*/g, '')
    .replace(/<link rel="canonical"[^>]*>\s*/g, '')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/, '')
    .replace('</head>', `  ${head}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root"><main class="seo-static">${body}</main></div>`);
  const file = ruta === '/' ? path.join(BUILD, 'index.html') : path.join(BUILD, '__p', `${ruta}.html`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

const tarjetas = (lista) => `<ul>${lista.map((p) => `<li><a href="${productPath(p)}"><img src="${esc(thumb(p.imagenUrl, 480) || LOGO)}" alt="${esc(`${p.nombre}${p.categoria ? ` — ${p.categoria.nombre}` : ''}${p.talla ? `, talla ${p.talla}` : ''}`)}" width="240" height="300" loading="lazy" /> ${esc(p.nombre)}</a> — ${fmt(p.precio)}</li>`).join('')}</ul>`;
const navCats = (cats) => `<nav><a href="/catalogo">Todas</a> ${cats.map((c) => `<a href="${categoryPath(c)}">${esc(c.nombre)}</a>`).join(' ')}</nav>`;

const { categorias, productos, galeria } = await datos();
const urls = [];
const add = (ruta, prioridad, freq, imgs = [], lastmod = hoy) => urls.push({ ruta, prioridad, freq, imgs, lastmod });

// Inicio (se reescribe index.html con contenido para Google)
pagina({
  ruta: '/',
  title: 'Mochilas Wayuu tejidas a mano: recamadas, doble uso, tradicionales y más',
  description: 'Guajira Bags: mochilas Wayuu y Kankuamas 100% artesanales, tejidas a mano en La Guajira. Piezas únicas, envíos a toda Colombia y pedidos por WhatsApp.',
  jsonLd: graph(organizationLd(), websiteLd()),
  body: `<h1>Guajira Bags — Mochilas Wayuu tejidas a mano</h1><p>Mochilas Wayuu y Kankuamas 100% artesanales, tejidas a mano por artesanas de La Guajira, Colombia. Piezas únicas con envíos a toda Colombia.</p>${navCats(categorias)}${tarjetas(productos.slice(0, 8))}<p><a href="/galeria">Galería</a> · <a href="/contacto">Contacto</a></p>`,
});
add('/', '1.0', 'daily', [LOGO]);

// Catálogo
pagina({
  ruta: '/catalogo',
  title: 'Catálogo de mochilas Wayuu por categorías',
  description: `Catálogo de Guajira Bags: ${categorias.map((c) => c.nombre.toLowerCase()).join(', ') || 'mochilas Wayuu'}. Piezas únicas tejidas a mano en La Guajira, con envíos a toda Colombia.`,
  jsonLd: graph(
    { '@type': 'CollectionPage', name: 'Catálogo', url: `${SITE_URL}/catalogo` },
    breadcrumbLd([['Inicio', '/'], ['Catálogo', '/catalogo']]),
    productos.length ? itemListLd(productos.slice(0, 60), (p) => thumb(p.imagenUrl, 640)) : null,
  ),
  body: `<h1>Catálogo de mochilas Wayuu</h1>${navCats(categorias)}${categorias.map((c) => `<section><h2><a href="${categoryPath(c)}">${esc(c.nombre)}</a></h2>${tarjetas(productos.filter((p) => p.categoria?.slug === c.slug).slice(0, 8))}</section>`).join('')}`,
});
add('/catalogo', '0.9', 'daily');

// Categorías
for (const c of categorias) {
  const lista = productos.filter((p) => p.categoria?.slug === c.slug);
  const tallas = c.tallas?.length ? ` Tallas ${c.tallas.join(', ')}.` : '';
  pagina({
    ruta: categoryPath(c),
    title: `${c.nombre} tejidas a mano`,
    description: `${c.nombre} de Guajira Bags: ${c.total} piezas únicas tejidas a mano por artesanas Wayuu de La Guajira.${tallas}${c.precioMin ? ` Desde ${fmt(c.precioMin)}.` : ''} Envíos a toda Colombia.`,
    keywords: `${c.nombre.toLowerCase()}, ${c.nombre.toLowerCase()} wayuu, comprar ${c.nombre.toLowerCase()}, mochilas wayuu, guajira bags`,
    image: thumb(lista[0]?.imagenUrl, 1280) || undefined,
    jsonLd: graph(
      { '@type': 'CollectionPage', name: c.nombre, url: `${SITE_URL}${categoryPath(c)}` },
      breadcrumbLd([['Inicio', '/'], ['Catálogo', '/catalogo'], [c.nombre, categoryPath(c)]]),
      lista.length ? itemListLd(lista, (p) => thumb(p.imagenUrl, 640)) : null,
    ),
    body: `<h1>${esc(c.nombre)}</h1><p>${c.total} piezas únicas tejidas a mano.${esc(tallas)}</p>${navCats(categorias)}${tarjetas(lista)}`,
  });
  add(categoryPath(c), '0.8', 'weekly', lista.slice(0, 20).map((p) => media(p.imagenUrl)).filter(Boolean));
}

// Mochilas
for (const p of productos) {
  const fotos = [p.imagenUrl, ...(p.imagenes || [])].filter(Boolean);
  const ruta = productPath(p);
  const crumbs = [['Inicio', '/'], ['Catálogo', '/catalogo'], ...(p.categoria ? [[p.categoria.nombre, categoryPath(p.categoria)]] : []), [p.nombre, ruta]];
  pagina({
    ruta,
    type: 'product',
    title: `${p.nombre}${p.categoria ? ` · ${p.categoria.nombre}${p.talla ? ` ${p.talla}` : ''}` : ''}`,
    description: `${p.nombre}: ${frase(String(p.descripcion || 'mochila Wayuu tejida a mano').slice(0, 140))} Pieza única por ${fmt(p.precio)}. Envíos a toda Colombia.`,
    image: thumb(fotos[0], 1280) || undefined,
    imageAlt: p.nombre,
    jsonLd: graph(productLd(p, { mediaUrl: media }), breadcrumbLd(crumbs)),
    body: `<nav>${crumbs.map(([n, r]) => `<a href="${r}">${esc(n)}</a>`).join(' › ')}</nav><article><h1>${esc(p.nombre)}</h1>${p.categoria ? `<p>${esc(p.categoria.nombre)}${p.talla ? ` · Talla ${esc(p.talla)}` : ''} · Pieza única</p>` : ''}<p><strong>${fmt(p.precio)}</strong></p>${fotos.map((f, i) => `<img src="${esc(thumb(f, 960))}" alt="${esc(`${p.nombre}${i ? ` — foto ${i + 1}` : ''}`)}" width="480" height="600" loading="lazy" />`).join('')}<p>${esc(p.descripcionLarga || p.descripcion || '')}</p><p>Tejida a mano en La Guajira · Envíos a toda Colombia · Pedido por WhatsApp</p></article>`,
  });
  add(ruta, '0.7', 'weekly', fotos.map(media).filter(Boolean), String(p.creadoEn || hoy).slice(0, 10));
}

// Galería y contacto
pagina({
  ruta: '/galeria',
  title: 'Galería — Artesanía Wayuu',
  description: 'Galería fotográfica de nuestras mochilas Wayuu y del proceso artesanal de tejido en La Guajira, Colombia.',
  image: media(galeria[0]?.url) || undefined,
  jsonLd: graph({ '@type': 'ImageGallery', name: 'Galería Guajira Bags', url: `${SITE_URL}/galeria`, image: galeria.slice(0, 30).map((g) => ({ '@type': 'ImageObject', contentUrl: media(g.url), caption: g.caption || 'Mochila Wayuu — Guajira Bags' })) }, breadcrumbLd([['Inicio', '/'], ['Galería', '/galeria']])),
  body: `<h1>Galería: luz, hilo y color</h1>${galeria.map((g) => `<img src="${esc(thumb(g.url, 640))}" alt="${esc(g.caption || 'Mochila Wayuu tejida a mano — Guajira Bags')}" loading="lazy" />`).join('')}`,
});
add('/galeria', '0.6', 'weekly', galeria.map((g) => media(g.url)).filter(Boolean));
pagina({
  ruta: '/contacto',
  title: 'Contacto',
  description: 'Contáctanos por WhatsApp o Instagram para conocer disponibilidad, precios y envíos de nuestras mochilas Wayuu artesanales.',
  jsonLd: graph({ '@type': 'ContactPage', name: 'Contacto Guajira Bags', url: `${SITE_URL}/contacto` }, organizationLd(), breadcrumbLd([['Inicio', '/'], ['Contacto', '/contacto']])),
  body: '<h1>Contacto</h1><p>Escríbenos por WhatsApp o Instagram: disponibilidad, precios y envíos a toda Colombia.</p>',
});
add('/contacto', '0.5', 'monthly');

// Sitemap (con sitemap de imágenes para Google Imágenes)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map((u) => `  <url>
    <loc>${esc(SITE_URL + u.ruta)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.prioridad}</priority>${u.imgs.slice(0, 20).map((i) => `
    <image:image><image:loc>${esc(i)}</image:loc></image:image>`).join('')}
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(BUILD, 'sitemap.xml'), sitemap);
console.log(`✓ SEO: ${urls.length} páginas listas para Google (${categorias.length} categorías, ${productos.length} mochilas) y sitemap.xml`);
void slugify;
