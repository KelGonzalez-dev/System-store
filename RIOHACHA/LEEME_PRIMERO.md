# Guajira Bags v3.3 — cómo instalar

## 1. API (Administrador de archivos del hosting)
1. Haz una copia de seguridad de tu carpeta `php-api` actual.
2. Sube el contenido de `php-api/` de este paquete **reemplazando** los archivos
   (`.htaccess`, `public/index.php`, `public/.htaccess`, `public/img/`, `src/`, `scripts/`, `storage/`, `database/`).
   - ⚠️ **NO reemplaces ni borres `config/config.php` del servidor**: tiene tus claves.
   - Conserva tu carpeta `public/uploads/` (tus fotos).
3. **Borra del servidor** estos archivos si siguen ahí: `public/verificar.php`, `public/diagnostico.php`,
   `public/recuperar-fotos.php` y `public/ping.php`.
4. Prueba: abre `https://api.guajirabags.com/api/productos` → debe mostrar tus mochilas en texto.

Las reseñas que ya tienes se conservan. La base de datos se ajusta sola (no borra nada).

## 2. Tienda
1. En `guajira-bags-frontend`: `npm install` y luego `npm run build`.
2. Sube el contenido de `build/` como siempre.
