# Cannario Rooftop — sitio web

React 18 + Vite + Tailwind. Animaciones con un motor de scroll propio (solo `transform`, un único requestAnimationFrame). El scroll es 100 % nativo, así que responde a la velocidad exacta del usuario en cualquier dispositivo.

## Uso

    npm install
    npm start          # servidor local en http://localhost:3000
    npm run build      # genera la carpeta build/ lista para subir
    npm run serve      # previsualiza la carpeta build/

Sube el contenido de `build/` a cualquier hosting estático (Netlify, Vercel, Hostinger, cPanel…).

## Qué editar

| Qué | Dónde |
| --- | --- |
| Platos, precios (COP), etiquetas chef/vegetariano | `src/data.js` → `MENU` |
| Platos destacados en el inicio | `src/components/Menu.jsx` → `PICKS` (ids de `MENU`) |
| Fotos de la carta, galería, hero y arcos | `src/data.js` (`img`, `GALLERY`, `HERO_IMG`, `PILLAR_IMG`, `CAT_IMG`) |
| Textos del sitio en los 5 idiomas | `src/i18n.jsx` → `DICT` |
| Teléfono / WhatsApp | `src/i18n.jsx` → `PHONE` |
| Colores y tipografías | `tailwind.config.js` y `:root` en `src/index.css` |
| Tiempos del loading | `src/components/Loader.jsx` → constante `T` |

### Fotos reales del local
En `public/images/local/` hay 6 fotos de Cannario tomadas de su Instagram (salon, plato, letrero, barra, postre, mesa) y `hero-fondo.jpg` (el salón desenfocado para el fondo del inicio).
Son de baja resolución: reemplázalas por los archivos originales **con el mismo nombre** y todo el sitio se verá nítido
(inicio, arcos de la experiencia y galería).

### Usar fotos propias
Copia la foto a `public/images/` (por ejemplo `public/images/terraza.jpg`) y en `src/data.js` reemplaza el id de Unsplash por `'/images/terraza.jpg'`.
Las fotos actuales son de Unsplash (uso libre); lo ideal es reemplazarlas por fotos reales del local.

## Idiomas
Español, inglés, portugués, francés y alemán. El sitio detecta el idioma del navegador y recuerda la elección del visitante. Al cambiar de idioma aparece un aviso de 2 segundos ("Cambiando idioma a…").

## Estructura
- `src/components/Loader.jsx` — pájaros que forman el emblema mientras se escribe el nombre
- `src/components/Hero.jsx` — fondo con foto real desenfocada, titular con brillo dorado, emblema circular con el letrero del local, anillo de texto giratorio y pájaros dorados
- `src/components/Experience.jsx` — frase que se enciende y arcos con giro 3D
- `src/components/Menu.jsx` — favoritos del chef en el inicio y tarjeta de plato reutilizable
- `src/components/CartaPage.jsx` — página de la carta completa por categorías, con foto de cada plato
- `src/components/Gallery.jsx` — anillo 3D que gira con el scroll o arrastrando; al tocar una foto se abre un visor que también gira en 3D con las flechas, el teclado o deslizando
- `src/components/LangSwitch.jsx` — aviso de 2 s al cambiar de idioma
- `src/components/Reserve.jsx` — reserva por WhatsApp, footer y botón flotante
- `src/lib/scroll.js` — motor de animaciones de scroll

Los precios y platos son de ejemplo hasta reemplazarlos por los reales.
