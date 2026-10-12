# Feel Fresco — sitio web

React 18 + Vite + Tailwind. "Don't stress, feel fresco" · Smash burgers en Bucaramanga y Floridablanca.

## Uso

    npm install
    npm start          # http://localhost:3000  (menú completo: /carta.html)
    npm run build      # genera la carpeta build/ lista para subir
    npm run serve      # previsualiza build/

Sube el contenido de `build/` a cualquier hosting estático. Dos páginas: `index.html` (inicio) y `carta.html` (menú completo).

## Lo primero que debes completar

| Qué | Dónde |
| --- | --- |
| **WhatsApp de cada casa** (Terrazas y Cañaveral). Si quedan vacíos, "Domicilios" abre su Linktree y las reservas van por Instagram con el mensaje copiado | `src/i18n.jsx` → `HOUSES[].phone` |
| Direcciones (confirmar Cañaveral: en Instagram dice "Calle 33 # 26-73" y en Linktree "Cra. 23 #27-73") | `src/i18n.jsx` → `HOUSES[].address` |
| Platos, precios, etiquetas | `src/data.js` → `MENU` |
| Favoritas del inicio | `src/data.js` → `PICKS` |
| Horario y qué días son "fin de semana" (11:00 p. m.) | `src/data.js` → `HOURS` y textos `houses.hours` en `src/i18n.jsx` |
| Textos en 5 idiomas | `src/i18n.jsx` |

## Fotos
`public/images/local/` tiene fotos reales tomadas de su Instagram (baja resolución): `burger.jpg`, `casa-rosa.jpg`, `letrero.jpg`.
Reemplázalas por los originales con el mismo nombre. Las demás son de Unsplash; para usar una propia, ponla en
`public/images/` y cambia el id por la ruta. Los platos y precios son de ejemplo.

## Estructura
- `Mascot.jsx` — la mascota recreada en SVG: cabeza al ritmo, gorra, melena, gafas con brillo, labios chiflando y notas musicales; y el sello "Don't stress · Feel fresco"
- `Loader.jsx` — sol giratorio, palmeras, sello con la mascota chiflando, letras que rebotan y salida en ola
- `Hero.jsx` — "Don't stress, feel fresco." en tipografía retro, hamburguesa real en marco ondulado, stickers, horario en vivo
- `Smash.jsx` — al hacer scroll la espátula aplasta la carne, se dora, cae el queso y el pan
- `Menu.jsx`, `CartaPage.jsx` — menú con stickers de categoría y tarjetas estilo Linktree
- `Club.jsx` — Burger Club · `Houses.jsx` — las dos casas rosas ilustradas · `Gallery.jsx` — polaroids y visor que se desliza como cartas
- `Reserve.jsx` — reservas gratis por casa, footer y botón "Pedir"
- `lib/scroll.js` — animaciones con transform/opacity y scroll nativo
