# Guajira Bags — API v3

## Qué hace
- **Miniaturas automáticas** `/img/{ancho}/uploads/...` (WebP). La primera vez las genera PHP;
  después Apache las sirve directo desde `public/img/` con caché de 1 año.
- **Fotos nuevas optimizadas al subirlas**: enderezadas, máx. 2000 px, WebP de alta calidad.
- **Productos**: búsqueda `q`, orden `orden=recientes|precio_asc|precio_desc|nombre`, precio `min`/`max`,
  campo `codigo`, `fotos` con id; una sola consulta para todas las fotos de la página.
- **Reseñas** compatibles con tu tabla actual: de una mochila o **de la tienda** (sin producto), y gestión desde el panel.
- Respuestas JSON comprimidas, con ETag (304) y caché de 60 s en el catálogo público
  (el panel con sesión siempre recibe datos frescos).
- CORS para guajirabags.com, www y localhost, **también cuando hay un error**.
- `public/index.php` encuentra solo las carpetas `src/` y `config/` aunque el hosting tenga otra estructura;
  `.htaccess` en la raíz por si el dominio apunta a `php-api/` en vez de a `public/`.
- Ajustes automáticos de la base de datos (una sola vez): columna `codigo`, índices y tabla de reseñas. No borra nada.
- Seguridad: `/auth/register` requiere sesión; se valida que lo subido sea una imagen real;
  `config/` y `storage/` bloqueados; campo trampa contra robots en las reseñas.

Requiere PHP 8.0+ con GD (sin GD funciona igual, pero entrega las fotos originales).

## Rutas
| Método | Ruta | Acceso |
| --- | --- | --- |
| POST | /api/auth/login | público |
| POST | /api/auth/register | sesión |
| GET | /api/productos?pagina&porPagina&soloActivos&q&orden&min&max | público |
| GET | /api/productos/{id} | público |
| POST / PUT / DELETE | /api/productos, /api/productos/{id} | sesión |
| POST | /api/productos/{id}/imagenes | sesión |
| DELETE | /api/productos/{id}/imagenes/{imagenId} | sesión |
| GET / POST | /api/productos/{id}/resenas | público |
| POST | /api/resenas (de la tienda, o con `producto_id`) | público |
| GET | /api/resenas — sin sesión: todas las visibles · con sesión: panel (`visible`, `buscar`) | público / sesión |
| GET | /api/resenas/resumen?ids=1,2 · /api/resenas/recientes | público |
| PUT / DELETE | /api/resenas/{id} | sesión |
| GET | /api/galeria · /api/galeria/{id} | público |
| POST / PUT / DELETE | /api/galeria, /api/galeria/{id} | sesión |
| GET | /img/{ancho}/uploads/... | público (miniatura) |

## Opcional
`php scripts/optimizar-fotos.php` genera de una vez las miniaturas de todas las fotos ya subidas.
