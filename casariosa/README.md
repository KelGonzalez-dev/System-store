# Casa Riosa — sitio web

React + Vite. Sin backend. Bilingüe español/inglés (detecta el idioma del
navegador y recuerda la elección).

    npm install
    npm start        # desarrollo
    npm run build    # producción (carpeta build/)

- Textos ES/EN: `src/i18n/translations.js`
- Teléfono, Instagram, dirección, menú digital, imágenes: `src/data/content.js`
- Loading (el corazón del logo se dibuja solo): `src/loader/HeartLoader.jsx`
- Logo recortado del Instagram (`public/logo-badge.png`): si el dueño te pasa
  el archivo original en alta resolución, reemplázalo — el actual viene de una
  captura de pantalla y pierde algo de nitidez al verse muy grande.
