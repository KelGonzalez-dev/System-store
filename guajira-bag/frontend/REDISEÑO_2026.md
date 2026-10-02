# Guajira Bags — Rediseño 2026

## Qué cambió (resumen)

**Nada de la lógica ni de la conexión con la API cambió**: `src/api.js`,
`src/config.js` y `src/data.js` están intactos, byte a byte. Todos los
endpoints (`/auth/login`, `/productos`, `/galeria`, etc.) funcionan exactamente
igual que antes.

Lo que sí cambió:

1. **Identidad visual nueva** ("Desierto & Telar"): paleta de arcilla/oro/añil
   inspirada en el telar Wayuu, tipografía `Fraunces` para titulares, motivo
   geométrico "kaana" (rombo) como forma-firma en botones, tarjetas y el logo
   del carrito — ya no es la plantilla típica "dorado + serif".
2. **Loading screen original "El Telar"** (`src/components/LoadingScreen.jsx`):
   un rombo tejido con SVG (sin canvas, sin JS por frame) que aparece:
   - al abrir el sitio por primera vez,
   - al entrar a **Catálogo** o **Galería**,
   - al entrar al **Panel Admin** ("Abriendo el taller").
3. **Rutas reales con React Router** (`/`, `/catalogo`, `/galeria`, `/contacto`,
   `/admin`) en vez de un solo estado interno — esto es clave para que Google
   pueda indexar cada sección por separado.
4. **SEO** (`src/components/Seo.jsx` + `public/index.html` + `public/robots.txt`
   + `public/sitemap.xml`): título, meta description, Open Graph, Twitter
   Card, `canonical` y JSON-LD por cada página, con las palabras clave que
   pediste (guajira bags, mochilas wayuu, cultura wayuu, mochilas kankuamas,
   etc.).
5. **Scroll-reveal 3D barato** (`src/hooks/useReveal.js`, `src/hooks/useTilt.js`,
   clases `.reveal` / `.tilt` en `index.css`): solo anima `transform` y
   `opacity` (lo único que el navegador puede mover sin recalcular el layout),
   se apaga solo con `prefers-reduced-motion`, y baja su intensidad en móvil
   automáticamente para que nunca se sienta pegado ni con lag.
6. Todo el resto de pantallas (Catálogo, Galería, Contacto, Panel Admin) se
   repintó con la nueva paleta manteniendo el 100% de su funcionalidad.

## Cómo correrlo

```bash
npm install
npm start          # desarrollo, http://localhost:3000
npm run build       # genera /build listo para producción
```

## Desplegar rutas reales (`/catalogo`, `/galeria`, etc.)

Como el sitio ahora usa URLs reales, el servidor debe redirigir **cualquier**
ruta hacia `index.html` (el enrutamiento lo resuelve React en el navegador).
Ya vienen los dos archivos más comunes listos dentro de `public/` (se copian
solos a `build/` al compilar):

- `_redirects` → para Netlify.
- `.htaccess` → para hosting Apache/cPanel.

Si usas Vercel, agrega un `vercel.json` con un rewrite `"/(.*)" -> "/index.html"`.
Si usas Nginx, agrega `try_files $uri /index.html;` en el bloque `location /`.

## Configurar Google Search Console

1. Sube el sitio ya compilado (o el dominio en producción).
2. Entra a https://search.google.com/search-console y agrega la propiedad
   `https://www.guajirabags.com` (verifícala por DNS o por el archivo HTML
   que te den, subiéndolo a `public/`).
3. Ve a **Sitemaps** y envía: `sitemap.xml` (ya está en
   `https://www.guajirabags.com/sitemap.xml`).
4. Usa **Inspección de URLs** para pedir indexación manual de `/`, `/catalogo`,
   `/galeria` y `/contacto`.
5. Las palabras clave objetivo (guajira bags, mochilas wayuu, mochilas wayuu
   originales, cultura wayuu, mochilas kankuamas, mochilas artesanales
   colombia) ya están en el `<title>`, meta description y `keywords` de cada
   página vía `src/components/Seo.jsx`.

**Importante sobre SEO en una app 100% en el navegador (CRA):** Google
ejecuta JavaScript antes de indexar, así que esto funciona, pero si más
adelante quieres el máximo posible de SEO (fichas de producto individuales
indexables con su precio/foto, tiempos de "primera pintura" más rápidos,
mejor posicionamiento), el siguiente paso natural es migrar a un framework
con renderizado en servidor (Next.js) o generar una versión pre-renderizada
del catálogo. Puedo ayudarte con eso cuando quieras dar ese salto.

## Rendimiento / fluidez

- Todas las animaciones nuevas mueven solo `transform`/`opacity` (compositable
  por GPU), nunca `top/left/width` — así no disparan *layout* ni *repaint*
  costosos.
- El `IntersectionObserver` de scroll-reveal deja de observar un elemento en
  cuanto se revela una vez (cero costo en scrolls posteriores).
- El tilt 3D en hover limita las actualizaciones a **una por frame** via
  `requestAnimationFrame` y se desactiva solo en pantallas táctiles.
- En `prefers-reduced-motion` o pantallas pequeñas, las animaciones se
  simplifican o se desactivan automáticamente.
