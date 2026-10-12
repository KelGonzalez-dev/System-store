# BELO · Cocina & Rooftop — sitio web

React 18 + Vite + Tailwind. Dos páginas: `index.html` (inicio) y `carta.html` (carta completa).

## Uso
    npm install
    npm start          # http://localhost:3000   (carta: /carta.html)
    npm run build      # genera build/ lista para subir a cualquier hosting
    npm run serve      # previsualiza build/

## Qué editar
| Qué | Dónde |
| --- | --- |
| WhatsApp de reservas, Instagram, dirección, enlace a la carta digital | `src/i18n.jsx` (arriba) |
| Platos, precios y fotos (ES/EN) | `src/data.js` → `MENU` (`real: true` = tomado de su carta digital) |
| Nuevos platos del inicio, cócteles y botellas | `src/data.js` → `DISH_IDS`, `COCKTAIL_IDS`, `BOTTLE_IDS` |
| Galería | `src/data.js` → `GALLERY` |
| Textos (español / inglés) | `src/i18n.jsx` → `DICT` |

Platos y precios REALES (de belo.cluvi.co): Burrata Divina, Ensalada Mediterránea con Pulpo y Calamar,
Don Julio Reposado, Johnnie Walker Gold Label, Macallan 12 años, Ron Zacapa 23 años, Belo de Luxe, Ilegal y Lunch Day desde $25.000.
El resto son de REFERENCIA (se marcan como "Referencia" en la carta): reemplázalos por los reales.

## Fotos
`public/images/local/` tiene fotos reales de su Instagram y su carta (baja resolución). Reemplázalas por las originales con el mismo nombre.

## Piezas
- `components/Loader.jsx` — "Golden hour en el rooftop": el sol se hunde en el mar, el cielo pasa de coral a noche,
  salen las estrellas y la silueta del Centro Histórico con la catedral y la Sierra Nevada, se encienden las luces del rooftop,
  BELO se traza en oro y brilla, el indicador art déco del ascensor sube al rooftop y la página aparece a través de la "O".
- `components/Floors.jsx` — "Dos pisos, dos mundos": al bajar se sube como en ascensor de la cocina al rooftop (giro 3D).
- `components/Dishes.jsx` — nuevos platos con inclinación 3D y brillo.
- `components/Lunch.jsx` — Lunch Day con reloj art déco que gira con el scroll.
- `components/Bar.jsx` — cócteles de autor y licores para compartir.
- `components/Events.jsx` — cumpleaños, fútbol y noches de rooftop en abanico 3D.
- `components/Gallery.jsx` — paseo horizontal con cuadros que giran en 3D y visor a pantalla completa.
