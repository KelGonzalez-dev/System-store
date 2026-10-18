# Guajira Bags — frontend

React (Create React App) + React Router. Sin Tailwind, sin framer-motion: todo el
CSS y las animaciones son propias (transform/opacity, sin librerías).

## Instalar y correr

    npm install
    npm start        # desarrollo, http://localhost:3000
    npm run build     # producción → carpeta build/

## Variables de entorno

`.env` y `.env.production` ya traen `REACT_APP_API_URL` apuntando a la API real.
Cámbialo si el dominio de la API cambia.

## Qué se rediseñó

- Todo el CSS es nuevo: paleta tomada del logo (dorado/madera/marfil), sin azul.
- El `theme-color` del `index.html` estaba en azul añil (`#17233B`) — eso pintaba
  la barra del navegador en el celular. Ya está en el café oscuro de la marca.
- Loading nuevo: un rombo dorado (motivo kaana) se teje y revela el logo.
- Animaciones con scroll (`useReveal`), inclinación 3D en tarjetas (`useTilt`) y
  parallax ligero — todo con CSS nativo, sin librerías de animación.
- Misma lógica de negocio que el sitio original: catálogo con paginación y
  buscador, carrito con pedido por WhatsApp, galería con visor, panel admin
  (productos y galería) con las mismas llamadas a la API.
- `robots.txt`, `sitemap.xml`, `.htaccess` y `_redirects` se conservaron igual.

## Pendiente de tu parte

- Revisar el catálogo y la galería con la API real conectada (aquí no pude
  probarlos con datos reales).
- Reemplazar `mochila1.webp`/`mochila2.webp` del inicio si quieres otras fotos
  destacadas.
