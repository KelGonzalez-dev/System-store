# Guajira Bags v4.0 — cómo instalar

## 1. Tienda (lo principal de esta versión)
1. En `guajira-bags-frontend`: `npm install` y luego `npm run build`.
2. Sube el contenido de `build/` como siempre.

## 2. API — solo un archivo cambió (calidad de las fotos)
1. Sube `php-api/src/Services/ImageService.php` reemplazando el del servidor.
2. En el Administrador de archivos, entra a `php-api/public/img/` y **borra las carpetas con números**
   (`320`, `480`, `640`, `960`…). **No borres el archivo `.htaccess`** de esa carpeta.
   Así las miniaturas se vuelven a crear solas con la calidad nueva.
3. ⚠️ No toques `config/config.php` ni la carpeta `public/uploads/` (tus fotos).

Las fotos que se suban desde ahora quedan con más calidad. Si alguna foto ya subida se ve
con menos calidad, vuelve a subirla desde el panel.
