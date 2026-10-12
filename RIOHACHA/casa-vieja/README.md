# Casa Vieja · Café & Bar — sitio web

React 18 + Vite + Tailwind. Dos páginas: `index.html` (inicio) y `carta.html` (carta completa).

## Uso
    npm install
    npm start          # http://localhost:3000   (carta: /carta.html)
    npm run build      # genera build/ lista para subir a cualquier hosting
    npm run serve      # previsualiza build/

## Qué editar
| Qué | Dónde |
| --- | --- |
| **Dirección exacta** | `src/i18n.jsx` → `ADDRESS` (y `MAPS` si quieres un enlace exacto) |
| WhatsApp, Instagram | `src/i18n.jsx` (arriba) |
| Horario (y el domingo, que no aparece en su Instagram) | `src/data.js` → `HOURS` |
| Platos, precios, fotos (ES/EN) | `src/data.js` → `MENU` |
| Galería | `src/data.js` → `GALLERY` |
| Textos (español / inglés) | `src/i18n.jsx` → `DICT` |

Los platos y precios son de REFERENCIA: reemplázalos por los reales.

## Fotos
`public/images/local/` tiene fotos reales de su Instagram (baja resolución). Reemplázalas por las originales con el mismo nombre.

## Piezas
- `components/Loader.jsx` — "Bienvenidos a casa": la puerta azul colonial con la lámpara encendida y el piso de baldosas,
  el sello de Casa Vieja se pinta en un giro, sube el vapor del café, se escribe "Bienvenidos a casa", tocan la puerta
  (toc, toc) y las dos hojas se abren en 3D dejando entrar la luz.
- `components/Brand.jsx` + `lib/logoPath.js` — el sello de Casa Vieja vectorizado de su imagen original.
- `components/Hero.jsx` — modo De día (café) / De noche (bar y karaoke); se elige solo según la hora de Riohacha.
- `components/House.jsx` — baldosas de colores que se voltean en 3D en ola al hacer scroll.
- `components/Moments.jsx` — sus 5 historias destacadas (Café, Desayunos, Tortas, Bar, Karaoke) con tarjeta que gira en 3D.
- `components/Night.jsx` — letrero de neón, ecualizador y bombillas.
- `components/Gallery.jsx` — columnas con profundidad (parallax 3D) y visor a pantalla completa.
- `components/Visit.jsx` — horario con el día de hoy y "abierto ahora", domicilios y reservas por WhatsApp.
