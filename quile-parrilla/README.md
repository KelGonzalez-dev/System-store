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
| Los 3 platos para compartir | `src/data.js` → `SHARE_IDS` |
| Tamaños del selector de salchipapa | `src/data.js` → `SIZES` |
| WhatsApp, Instagram, dirección | `src/i18n.jsx` (arriba) |
| Textos (español / inglés) | `src/i18n.jsx` → `DICT` |

Los precios son de REFERENCIA: reemplázalos por los reales.

## Fotos
`public/images/local/` tiene fotos reales de su Instagram y Google (baja resolución).
Reemplázalas por las originales con el mismo nombre. Los platos sin foto propia usan Unsplash;
para usar una foto propia, ponla en `public/images/local/` y cambia el id por la ruta.

## Piezas
- `components/Loader.jsx` — "marcado a fuego": brasas que suben, el logo sale al rojo vivo y se enfría hasta su azul,
  la llama se enciende, cuelga la tablilla PARRILLA y la pantalla se quema para revelar la página.
- `components/Brand.jsx` + `lib/logoPath.js` — el logo de Quile vectorizado de su imagen original.
- `lib/embers.js` — brasas en canvas (se pausan solas fuera de pantalla).
- `components/Share.jsx` — 3 platos para compartir + selector "¿Cuántos son en la mesa?".
- `components/Menu.jsx`, `CartaPage.jsx` — carta con foto de cada plato y botón de pedido por WhatsApp.
- `components/Visit.jsx` — dirección, mapa (carga al tocarlo), reserva por WhatsApp, footer.
