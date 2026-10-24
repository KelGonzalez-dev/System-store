# Guajira Bags v5.1 — Categorías + SEO profesional

## 1. Base de datos (si aún no lo hiciste)
phpMyAdmin → tu base → pestaña SQL → pega `guajira-bags-categorias.sql` → Continuar.

## 2. API — sube SOLO los archivos de `api-archivos-para-subir/php-api/` (reemplazando)
| Archivo | Va en el servidor en |
|---|---|
| `index.php`, `.user.ini` | `php-api/public/` |
| `Schema.php` | `php-api/src/` |
| `ProductoService.php`, `CategoriaService.php`, `ImageService.php`, `FileStorageService.php`, `GaleriaService.php` | `php-api/src/Services/` |
| `ProductosController.php`, `CategoriasController.php`, `SitemapController.php` (nuevo) | `php-api/src/Controllers/` |

⚠️ No toques `config/config.php` ni `public/uploads/`. Nunca subas la carpeta `php-api` completa encima.
Prueba: abre `https://api.guajirabags.com/sitemap.xml` → debe mostrar la lista de direcciones.

## 3. Tienda
En `guajira-bags-frontend`: `npm install` y `npm run build`.
Sube **todo** el contenido de `build/` (incluida la carpeta `__p` y el archivo `.htaccess`).

## 4. Google
Sigue `guajira-bags-frontend/SEO_GOOGLE.md` (enviar los dos sitemaps en Search Console).
