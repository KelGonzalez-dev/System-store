# Materiales El Descuento S.A.S ZESE — sitio web

React 18 + Vite + Tailwind. Tienda-catálogo con precios al detal y al por mayor, cotización por WhatsApp,
promociones, calculadora de materiales, noticias y galería.

## Uso
    npm install
    npm start          # http://localhost:3000
    npm run build      # genera build/ lista para subir a cualquier hosting

## Todo se administra en `src/data.js`
| Qué | Dónde |
| --- | --- |
| WhatsApp (318 400 9867), dirección y horario (ya son los reales) | `CONFIG`, `HOURS` |
| **Productos y precios** — `detal`, `mayor` y `min` (cantidad mínima para el precio por mayor) | `PRODUCTS` |
| Categorías | `CATS` |
| **Promociones** (con fecha de vencimiento; se ocultan solas al vencer) | `PROMOS` |
| **Noticias** | `NEWS` |
| Galería | `GALLERY` |
| Marcas | `BRANDS` |

⚠️ Los productos, precios, promociones y noticias actuales son de EJEMPLO para mostrar cómo se ve la tienda.

## Fotos de productos
Cada producto se ve con una ilustración de catálogo. Para usar fotos reales: guarda la foto en
`public/images/productos/` y agrega al producto `img: '/images/productos/nombre.jpg'`.
Las categorías, la galería y las noticias usan fotos reales de su Instagram y fotos de ejemplo (Unsplash);
si una foto no carga, se muestra la ilustración.

## Cómo funciona el precio por mayor
Cuando la cantidad de un producto llega a `min`, el precio cambia solo a `mayor` en la tarjeta, la ficha
y la cotización, y se muestra cuánto ahorra el cliente. La cotización se envía armada por WhatsApp.
