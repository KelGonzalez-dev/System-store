# Jean Paul · Barbería VIP — sitio web

React 18 + Vite + Tailwind. Una sola página con agenda por "concierge" que termina en WhatsApp.

## Uso
    npm install
    npm start          # http://localhost:3000
    npm run build      # genera build/ lista para subir a cualquier hosting

## Antes de publicar (⚠️ en `src/data.js`)
| Qué | Dónde |
| --- | --- |
| **Número de WhatsApp** con 57 adelante. Con él, la cita llega ESCRITA en el chat. | `CONFIG.phone` |
| Horario real (destacado "Horarios") | `HOURS` (minutos desde medianoche; `null` = cerrado) |
| Precios y servicios reales (todos los actuales son de referencia) | `SERVICES` y `EXPERIENCES.from` |
| Métodos de pago (destacado "Métodos de pago") | `CONFIG.payments` |

Sin número, el botón abre el enlace de WhatsApp de su perfil (wa.me/message/…) y **copia la cita**
para que el cliente solo la pegue.

## Fotos
`public/images/local/` tiene fotos reales de su Instagram (recortes). Reemplázalas por las originales con el mismo nombre.
La foto de "Uñas" es de Unsplash; si no carga, queda un fondo con las iniciales JP.

## Piezas
- `components/Loader.jsx` — "La pared de madera": listones con luces LED que se encienden una a una, el nombre escrito
  en pan de oro, y al final los listones giran como persianas desde el centro para abrir la página.
- `components/Hero.jsx` — titular con palabra que cambia, mazo de fotos que se baraja solo en 3D y mini-agendador.
- `components/Experiences.jsx` — 6 experiencias en paneles que se expanden (acordeón horizontal; vertical en celular).
- `components/Ritual.jsx` — "El ritual VIP": fotos que se revelan en un círculo que crece, con anillo de progreso.
- `components/Kids.jsx` — "Cariño para pequeños".
- `components/Prices.jsx` — carta de precios con marco dorado; cada servicio se agenda con un clic.
- `components/Wall.jsx` — galería infinita que se arrastra con efecto lupa y visor a pantalla completa.
- `components/Concierge.jsx` — agenda en forma de chat: preguntas, opciones, ticket y confirmación por WhatsApp.
- `components/Visit.jsx` — mapa (estilo oscuro), horario con "abierto ahora", métodos de pago.
