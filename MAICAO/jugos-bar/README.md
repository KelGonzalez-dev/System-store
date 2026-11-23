# Jugos Bar · sitio web

React + Vite + Tailwind. Sin backend.

    npm install
    npm start
    npm run build

## Qué editar (todo en `src/data/content.js`)

- `SEDES`: nombre, dirección y WhatsApp de cada sede (los números actuales son de ejemplo)
- `ITEMS`: menú. Cada producto puede ser exclusivo de sedes (`only`), excluirse de otras (`not`) o cambiar de precio por sede (`adj`)
- `INSTAGRAM`: enlace y usuario
- Fotos: objeto `IMG` (fotos gratis de Unsplash). Para usar fotos propias, cambia la función `photo`
- Logo: `public/logo.svg`, `public/favicon.svg` y `src/data/logoData.js` (usado en el loading y la barra)
- Colores y fuentes: `tailwind.config.js` e `index.html`
- Modo claro y oscuro: variables al inicio de `src/index.css` (`--s1`, `--s2`, `--card`, `--fg`, `--acc`). El botón está en la barra y la elección se guarda en el navegador
