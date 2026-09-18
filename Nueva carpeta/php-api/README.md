# Guajira Bags — API PHP

API REST en PHP para MySQL/MariaDB. Reemplaza la API anterior en C#/.NET.

## Requisitos

- PHP 8.1+
- MySQL 5.7+ / MariaDB 10.3+
- Extensión PDO MySQL habilitada
- Apache con mod_rewrite (producción) o PHP built-in server (desarrollo)

## Instalación

### 1. Crear la base de datos

Ejecuta el script SQL que tienes (crea `guajira_bags` con tablas `usuarios`, `productos`, `producto_imagenes`, `galeria`).

### 2. Configurar conexión

Copia el ejemplo y edita tus credenciales:

```bash
cp config/config.local.php.example config/config.local.php
```

### 3. Configurar usuario admin

El script SQL incluye un hash placeholder. Genera uno real:

```bash
php scripts/setup-admin.php
# o con otra contraseña:
php scripts/setup-admin.php "TuContraseñaSegura"
```

Credenciales por defecto: `admin` / `Admin123!`

### 4. Iniciar servidor (desarrollo)

```bash
cd php-api/public
php -S localhost:8080

Para ejecutar la api "C:\php\php.exe -S localhost:8080"  Si no funciona con ese comando usar este "C:\php\php.exe -S localhost:8080 -t public public/index.php"
```

La API queda en `http://localhost:8080/api`

## Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /api/auth/login | No | Iniciar sesión |
| POST | /api/auth/register | No | Registrar admin |
| GET | /api/productos | No | Listar productos (paginado) |
| GET | /api/productos/{id} | No | Obtener producto |
| POST | /api/productos | Sí | Crear producto |
| PUT | /api/productos/{id} | Sí | Actualizar producto |
| DELETE | /api/productos/{id} | Sí | Eliminar producto |
| POST | /api/productos/{id}/imagenes | Sí | Agregar imagen extra |
| GET | /api/galeria | No | Listar galería |
| GET | /api/galeria/{id} | No | Obtener imagen |
| POST | /api/galeria | Sí | Subir foto |
| PUT | /api/galeria/{id} | Sí | Actualizar caption/orden/activo |
| DELETE | /api/galeria/{id} | Sí | Eliminar imagen |

## Despliegue en hosting compartido

1. Sube la carpeta `php-api/` a tu hosting.
2. Apunta el document root a `php-api/public/`.
3. Crea `config/config.local.php` con credenciales de MySQL del hosting.
4. Ejecuta `setup-admin.php` vía SSH o crea el admin manualmente.
5. Asegúrate de que `public/uploads/` tenga permisos de escritura (755 o 775).

## Frontend

El frontend React debe apuntar a esta API:

```
REACT_APP_API_URL=http://localhost:8080
```

Las imágenes se sirven desde `/uploads/productos/` y `/uploads/galeria/`.
