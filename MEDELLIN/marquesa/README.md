# The Marquesa — sitio web

React 18 + Vite + Tailwind. Burgers & Chill · Aranjuez, San Cayetano, Medellín.

## Uso

    npm install
    npm start          # http://localhost:3000  (la carta completa: /carta.html)
    npm run build      # genera la carpeta build/ lista para subir
    npm run serve      # previsualiza build/

Sube el contenido de `build/` a cualquier hosting estático. Son dos páginas: `index.html` (inicio) y `carta.html` (carta completa, se abre en su propia pestaña).

## Lo primero que debes completar

| Qué | Dónde |
| --- | --- |
| **WhatsApp del restaurante** (si queda vacío, las reservas van por Instagram y el mensaje se copia solo) | `src/i18n.jsx` → `PHONE` |
| Platos, precios (COP), etiquetas favorito / picante / vegetariano | `src/data.js` → `MENU` |
| Platos destacados en el inicio | `src/data.js` → `PICKS` |
| Fotos de la galería | `src/data.js` → `GALLERY` |
| Horario (también calcula "Abierto ahora" con la hora de Colombia) | `src/data.js` → `HOURS` y textos en `src/i18n.jsx` → `visit.days` |
| Textos en los 5 idiomas (ES, EN, PT, FR, DE) | `src/i18n.jsx` |

## Fotos
`public/images/local/` tiene fotos reales tomadas de su Instagram (baja resolución) y el logo circular.
Reemplázalas por los originales **con el mismo nombre** para que todo se vea nítido. Las demás fotos son de Unsplash;
para usar una propia, ponla en `public/images/` y cambia el id por la ruta (`'/images/mi-foto.jpg'`).
Los platos y precios son de ejemplo hasta reemplazarlos por los reales.

## Estructura
- `Loader.jsx` — la hamburguesa se arma capa por capa, el letrero de neón se enciende y suben los globos
- `Hero.jsx` — "Burgers & Chill" en neón, antojo que cambia solo, horario en vivo, logo con aro de neón y fotos en órbita
- `Marquee.jsx` — cintas cruzadas que se aceleran con el scroll
- `Vibe.jsx` — frase que se enciende en rosa y tarjetas que entran girando en 3D
- `Menu.jsx` — categorías gigantes con foto que sigue al cursor, favoritos y "antojo fuera de carta"
- `Party.jsx` — celebraciones: el neón "De la Marquesa con Amor" se escribe solo
- `Gallery.jsx` — túnel 3D: al hacer scroll avanzas entre las fotos; visor con profundidad
- `Visit.jsx` — dirección, horario con el día de hoy, domicilios, reserva, footer
- `CartaPage.jsx` — carta completa por categorías con foto de cada plato
- `lib/scroll.js` — motor de animaciones (solo transform/opacity, scroll 100 % nativo)
