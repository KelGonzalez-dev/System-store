# Gnam Dolce — sitio web

React 18 + Vite + Tailwind. Dos páginas: `index.html` (inicio) y `carta.html` (carta 2026 completa).

## Uso
    npm install
    npm start          # http://localhost:3000   (carta: /carta.html)
    npm run build      # genera build/ lista para subir a cualquier hosting
    npm run serve      # previsualiza build/

## Qué editar
| Qué | Dónde |
| --- | --- |
| Carta completa (precios reales del PDF "Carta final 2026") | `src/data.js` → `CARTA` |
| Horario (martes sin servicio) | `src/data.js` → `HOURS` |
| "Un día en Gnam" y sabores de "Arma tu copa" | `src/data.js` → `DAY`, `FLAVORS` |
| WhatsApp de reservas, Instagram, dirección | `src/i18n.jsx` (arriba) |
| Textos (español / inglés) | `src/i18n.jsx` → `DICT` |

## Identidad
- Logo "Gnam" y la gran "G" de la portada: extraídos en vector de su PDF (`src/lib/logoPath.js`).
- Fondo de damasco: tomado de su carta (`public/images/damasco.jpg`, convertido en mosaico sin costuras).
- Fotos reales de su Instagram en `public/images/local/` (baja resolución: reemplázalas por las originales con el mismo nombre).

## Piezas
- `components/Loader.jsx` — "La copa perfecta": cono, tres bolas de gelato que caen y rebotan, chocolate, fresa,
  el logo Gnam que se escribe y #TULUGARDULCE; sale con cortinas que gotean (crema y chocolate).
- `components/Hero.jsx` — "Vitrina": portada como su carta con columnas de fotos en movimiento inclinadas en 3D,
  que se enderezan al hacer scroll; medallón "Dolce Vita".
- `components/Day.jsx` — "Un día en Gnam": reloj de sol fijo; las tarjetas giran como páginas de la carta.
- `components/Gelato.jsx` — "Arma tu copa": sabores reales, las bolas caen en la copa y recomienda una copa de la carta.
- `components/Menu.jsx` — los cinco mundos de la carta en tarjetas 3D.
- `components/Gallery.jsx` — "Repartir la mesa": fotos apiladas que se reparten en 3D al bajar.
