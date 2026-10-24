# Guajira Bags en Google — qué hace la página y qué hacer en Search Console

## Lo que ya hace el código
- **Una dirección propia y limpia** para cada sección, categoría y mochila:
  `/catalogo`, `/catalogo/recamadas`, `/mochila/35-aurora-boreal`, `/galeria`, `/contacto`.
- **Páginas listas para Google** (`npm run build` las crea en `build/__p/`): cada una ya trae su título,
  descripción, vista previa para WhatsApp/Facebook/X, datos estructurados y el texto visible,
  aunque Google no ejecute el JavaScript.
- **Datos estructurados (schema.org)** para resultados enriquecidos:
  - Tienda y organización (nombre, logo, Riohacha, WhatsApp, Instagram, TikTok).
  - Sitio web con **cuadro de búsqueda** (lleva al buscador del catálogo).
  - **Producto** en cada mochila: fotos, precio en COP, disponibilidad, envío a Colombia y
    **estrellas de reseñas** cuando las tiene.
  - Migas de pan (Inicio › Catálogo › Categoría › Mochila), listas de productos y galería de imágenes.
- **Sitemaps con fotos** (para Google Imágenes):
  - `https://www.guajirabags.com/sitemap.xml` → se genera al compilar.
  - `https://api.guajirabags.com/sitemap.xml` → lo genera la API **en el momento**: incluye las mochilas
    nuevas apenas se suben, sin volver a compilar.
- `robots.txt` anuncia los dos sitemaps y excluye `/admin`.
- Las búsquedas internas (`?q=`) llevan `noindex` para no crear páginas duplicadas.
- Textos alternativos descriptivos en las fotos (nombre, categoría y talla).

## Lo que debes hacer en Google Search Console (una sola vez)
1. Entra a https://search.google.com/search-console con la propiedad **de dominio** `guajirabags.com`
   (la que verificaste con el registro TXT en el DNS: cubre `www` y `api`).
2. Menú **Sitemaps** → agrega `https://www.guajirabags.com/sitemap.xml` → Enviar.
3. En la misma pantalla agrega `https://api.guajirabags.com/sitemap.xml` → Enviar.
4. Menú **Inspección de URL** → pega `https://www.guajirabags.com/catalogo` → **Solicitar indexación**.
   Repite con cada categoría (`/catalogo/recamadas`, `/catalogo/primavera`…).
5. Prueba una mochila en https://search.google.com/test/rich-results (pega su dirección
   `https://www.guajirabags.com/mochila/…`): debe salir **Producto** y **Migas de pan** como válidos.

## Recomendaciones
- En el panel del hosting activa **"Forzar HTTPS"** y deja una sola versión del dominio (con `www`).
- Después de subir varias mochilas nuevas, vuelve a ejecutar `npm run build` y sube `build/`:
  así sus páginas también quedan preparadas (el sitemap de la API ya las incluye solo).
- Nombres y descripciones claros en cada mochila ("Mochila Wayuu recamada mini con perlas…")
  ayudan muchísimo. Las reseñas reales hacen que salgan estrellas en Google.
- Crea o completa la ficha de **Google Business Profile** (Riohacha, fotos, WhatsApp, horario).
- El posicionamiento tarda semanas: nadie puede garantizar el primer lugar, pero todo lo técnico está listo.
