# ESAL Tres Raíces — base de datos y API

## 1. Base de datos
Importa `sql/tres_raices_esal.sql` en MySQL (crea la base, las tablas y las 9 categorías iniciales).

## 2. Configurar la API
Edita `api/config/database.php`: usuario, clave y host de tu hosting.
Edita `api/config/cors.php`: agrega el dominio real si cambia.

## 3. Subir el CONTENIDO de `api/` al subdominio de la API
La API vive en su propio subdominio: `https://api.cooperativatresraices.com/`.
En el hosting, crea ese subdominio apuntando a una carpeta (por ejemplo `api_cooperativatresraices`),
y sube ahí el contenido de `api/` (config, helpers, public, admin, setup, uploads) — no la carpeta `api` en sí,
para que `config/database.php` quede en `https://api.cooperativatresraices.com/config/database.php`.
La carpeta `uploads/esal/` debe tener permisos de escritura (755 o 775 según el hosting).

## 4. Crear el primer usuario administrador
Edita `setup/crear_admin.php` (usuario y clave temporal), entra una sola vez a
`https://api.cooperativatresraices.com/setup/crear_admin.php` desde el navegador,
y luego **borra ese archivo del servidor**.

## Endpoints públicos (los usa la página web)
- `GET https://api.cooperativatresraices.com/public/categorias.php`
- `GET https://api.cooperativatresraices.com/public/documentos.php` y `?categoria=acta-constitucion`
- `GET https://api.cooperativatresraices.com/public/descargar.php?id=5`

## Endpoints de administración (los usa el panel)
Todos menos login llevan la cabecera `Authorization: Bearer <token>` que devuelve el login.

- `POST https://api.cooperativatresraices.com/admin/login.php` → `{ "usuario": "...", "clave": "..." }`
- `POST https://api.cooperativatresraices.com/admin/logout.php`
- `GET https://api.cooperativatresraices.com/admin/perfil.php`
- `GET https://api.cooperativatresraices.com/admin/documentos.php` (incluye ocultos)
- `POST https://api.cooperativatresraices.com/admin/documentos.php` (multipart/form-data: `categoria_id`, `titulo`, `descripcion`, `archivo`)
- `PUT https://api.cooperativatresraices.com/admin/documentos.php?id=5` → `{ "titulo", "descripcion", "categoria_id", "visible", "orden" }`
- `DELETE https://api.cooperativatresraices.com/admin/documentos.php?id=5`
- `GET/POST/PUT/DELETE https://api.cooperativatresraices.com/admin/categorias.php`

## Seguridad ya incluida
- Contraseñas con `password_hash` (bcrypt).
- Sesión por token opaco guardado con hash en `sesiones_admin`, vence en 12 horas, se puede cerrar (logout) o revocar borrando la fila.
- Bloqueo de 15 minutos tras 5 intentos fallidos de login.
- Solo se aceptan PDF, JPG, PNG, DOC, DOCX, XLS, XLSX; máximo 15 MB.
- El nombre del archivo se reemplaza por uno aleatorio; el nombre original solo se guarda para mostrarlo.
- `.htaccess` en `uploads/esal/` impide ejecutar PHP ahí y bloquea el listado de la carpeta.

## Pendiente para ti
- Reemplazar usuario/clave de la base de datos en `database.php`.
- Reemplazar usuario/clave en `crear_admin.php` y borrar el archivo después de usarlo.
- Ajustar `origenesPermitidos` en `cors.php` si agregas otro dominio (por ejemplo, un panel en otra dirección).
