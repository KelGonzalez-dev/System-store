# Don Juan Barber Club — sitio web

React 18 + Vite + Tailwind. Una sola página con reserva en línea que llega por WhatsApp.

## Uso
    npm install
    npm start          # http://localhost:3000
    npm run build      # genera build/ lista para subir a cualquier hosting

## Antes de publicar (⚠️ en `src/data.js`)
| Qué | Dónde |
| --- | --- |
| **WhatsApp de reservas** (todas las reservas llegan aquí) | `CONFIG.whatsapp` |
| Horario de cada sede (destacado "HORARIOS") | `SEDES[].hours` (minutos desde medianoche; `null` = cerrado) |
| Nombres reales de los barberos / especialistas ("DON JUANES") | `TEAM` |
| Precios: Corte $29.990 y Corte + barba $44.990 son de sus publicaciones; los demás son de referencia | `SERVICES` |
| Bebidas del bar | `BAR` |

## Fotos
`public/images/local/` tiene fotos reales de su Instagram (recortes de pantalla). Reemplázalas por las originales en alta
con el mismo nombre. Los servicios de "Ella" usan fotos de Unsplash; si una no carga, queda un fondo elegante con ⚜.

## Piezas
- `components/Loader.jsx` — "El corte": el tubo de neón dibuja "Don Juan" (logo original vectorizado), parpadea al encender,
  se prenden BARBER CLUB letra por letra; una navaja cruza la pantalla y la imagen se parte en dos.
- `components/Hero.jsx` — "Cine": las fotos del club pasan solas con movimiento de cámara, grano de película y destellos;
  logo de neón, tarjeta de miembro VIP 3D holográfica (sigue el mouse y se voltea al bajar) y cifras que cuentan solas.
- `components/Zones.jsx` — "El club por dentro": recorrido horizontal 3D por las 6 zonas (barbería, uñas, bar, snacks,
  pantallas y tienda).
- `components/Team.jsx` — "25" gigante en dorado 3D que gira con el scroll + tira de fotos del equipo.
- `components/Services.jsx` — carta de servicios Él / Ella estilo editorial con vista previa grande (en celular se despliega).
- `components/Bar.jsx` — estantería retroiluminada: cervezas, ron, tequila, whisky, granizados y snacks.
- `components/Shop.jsx` — tienda para caballeros con productos que giran sobre pedestales iluminados.
- `components/Booking.jsx` — reserva en 5 pasos con ticket VIP en vivo y elección de la bebida de cortesía.
- `components/Covers.jsx` — "Don Juan Magazine": cada cliente es portada, en un carrusel 3D que se arrastra.
- `components/Sedes.jsx` — 3 sedes con "abierto ahora", horario de la semana y atención a domicilio.

## También para completar
- `SHELF` (bar): marcas y opciones reales. `SHOP` (tienda): productos y precios reales.
