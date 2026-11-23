# Rodriguez Perfumería · sitio web

React + Vite + Tailwind. Sin backend.

    npm install
    npm start
    npm run build

## Qué editar

- Contenido, WhatsApp, Instagram, productos, precios y asesor: `src/data/content.js`
- WhatsApp configurado: +57 323 834 9710 (`CONTACT.whatsapp`)
- Fotos de la página: objeto `IMG` en `src/data/content.js` (fotos gratis de Unsplash). Para usar fotos propias, cambia la función `photo` para que apunte a archivos en `public/`.
- Fotos de productos: agrega `img: 'foto.jpg'` al producto (guarda la foto en `public/`).
- Logo y favicon: `public/logo.webp`, `public/favicon.png`
- Duración mínima del loading: `MIN` en `src/loader/Loader.jsx`
- Colores y fuentes: `tailwind.config.js` + `index.html`
