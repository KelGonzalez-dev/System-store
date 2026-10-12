# Zulima · Consultora de belleza Natura — sitio web

React 18 + Vite + Tailwind. Una sola página con catálogo, bolsa de pedido y envío por WhatsApp.

## Uso
    npm install
    npm start          # http://localhost:3000
    npm run build      # genera build/ lista para subir a cualquier hosting (Netlify, Vercel, Hostinger…)

## Lo primero: tus datos
Abre `src/data.js` y llena `CONFIG`:
- `whatsapp`: tu número con 57 adelante, sin espacios (ej. `573001234567`). **Los pedidos llegan aquí.**
- `instagram`: tu usuario (sin @). Si lo dejas vacío, no aparece.
- `city`, `delivery` y `payments`: tu ciudad, cómo entregas y cómo te pagan.

## Productos y precios (cada ciclo)
En `src/data.js` → `PRODUCTS`. Cada producto tiene categoría, para quién es (ella / él / todos), línea, nombre,
presentación, precio y una ilustración (tipo de envase y colores).
- `fav: true` lo muestra en "Favoritos de Zulima".
- `oldPrice` (opcional) muestra un precio anterior tachado: úsalo solo con ofertas reales del ciclo.
- Los precios incluidos son de REFERENCIA: actualízalos con los del ciclo vigente.

## Fotos
Cada producto tiene `img` (foto de Unsplash de ese tipo de producto) y cada categoría también.
Si una foto no carga, se muestra automáticamente la ilustración del envase, así nunca queda un espacio vacío.
Lo ideal: toma fotos de TUS productos (fondo claro, buena luz), ponlas en `public/fotos/` y cambia `img`
por la ruta, por ejemplo `img: '/fotos/kaiak.jpg'`.

## Cómo funciona el pedido
El cliente agrega productos a su bolsa (se guarda en su navegador) y con un botón te envía por WhatsApp
la lista con cantidades, presentaciones y total aproximado.

## Piezas
- `components/Loader.jsx` — "Una gota de perfume": el frasco rocía una nube de partículas que escribe "Zulima" en el aire,
  brotan hojas y al final la fragancia se dispersa y revela la página.
- `components/Hero.jsx` — "Órbita": el perfume protagonista al centro y diez productos girando en un anillo 3D.
- `components/Favorites.jsx` — carrusel con tarjetas que giran en 3D según su posición.
- `components/Catalog.jsx` — barra de filtros (categorías con conteo, para quién, familia olfativa, precio máximo, favoritos ♥), buscador, orden y ficha completa con productos relacionados.
- `components/Quiz.jsx` — "Encuentra tu aroma": tres preguntas y te recomienda perfumes.
- `components/Categories.jsx` — mosaico de categorías con fotos que lleva al catálogo filtrado.
- `components/Ritual.jsx` — "Tu ritual": limpia, hidrata y perfuma, con tarjetas que se voltean en 3D.
- `components/GiftBox.jsx` — caja de regalo 3D: el moño sale volando, la tapa se levanta hacia arriba, aparece el papel de seda y suben los productos con destellos.
- `components/Art.jsx` — ilustraciones de los envases (respaldo cuando una foto no carga).

## Nota
La marca "Zulima" (monograma y nombre) es propia. Natura y los nombres de sus productos pertenecen a su titular;
el sitio se presenta como consultora independiente.
