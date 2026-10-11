# Quile Parrilla Riohacha — sitio web

React 18 + Vite + Tailwind. Dos páginas: `index.html` (inicio) y `carta.html` (carta completa).

## Uso
    npm install
    npm start          # http://localhost:3000   (carta: /carta.html)
    npm run build      # genera build/ lista para subir a cualquier hosting
    npm run serve      # previsualiza build/

## Qué editar
| Qué | Dónde |
| --- | --- |
| Platos, precios, fotos de la carta (ES/EN) | `src/data.js` → `MENU` |
| Fotos y textos de la galería | `src/data.js` → `GALLERY` |
| Los 3 platos para compartir | `src/data.js` → `SHARE_IDS` |
| Tamaños del selector de salchipapa | `src/data.js` → `SIZES` |
| WhatsApp, Instagram, dirección | `src/i18n.jsx` (arriba) |
| Textos (español / inglés) | `src/i18n.jsx` → `DICT` |

Sándwiches cubanos, perros calientes, fajitas, cócteles y bebidas tienen los precios REALES de su carta.
Parrilla, salchipapas, hamburguesas, mazorcadas y entradas tienen precios de REFERENCIA: reemplázalos por los reales.

## Fotos
`public/images/local/` tiene fotos reales de su Instagram y Google (baja resolución).
Reemplázalas por las originales con el mismo nombre. Los platos sin foto propia usan Unsplash;
para usar una foto propia, ponla en `public/images/local/` y cambia el id por la ruta.

## Piezas
- `components/Loader.jsx` — "Encendido": cae una chispa y enciende la parrilla, sube un fuego real (simulación en canvas), una antorcha escribe el logo dejando chispas (sale al rojo vivo y se enfría hasta su azul), la llama de la "i" explota en chispas, cuelga la tablilla, la frase se enciende letra por letra, el termómetro llega a 400 °C y el fuego cubre la pantalla y la quema para revelar la página.
