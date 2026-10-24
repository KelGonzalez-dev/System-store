<?php

declare(strict_types=1);

/*
 * GUAJIRA BAGS — API v3
 * Front controller: CORS, miniaturas de imágenes, archivos estáticos y rutas /api.
 */

// ── CORS (antes que nada, para que incluso un error lleve los encabezados) ──
$origenes = [
    'https://www.guajirabags.com',
    'https://guajirabags.com',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$enviarCors = static function () use (&$origenes, $origin): void {
    if (headers_sent()) {
        return;
    }
    if ($origin !== '' && in_array($origin, $origenes, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
        header('Vary: Origin', false);
    }
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Max-Age: 86400'); // el navegador no repite la verificación previa durante 24 h
};
$enviarCors();

// Si algo falla de forma grave, responder JSON con CORS (en vez de una página de error sin encabezados)
ini_set('display_errors', '0');
register_shutdown_function(static function () use ($enviarCors): void {
    $e = error_get_last();
    if (!$e || !in_array($e['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        return;
    }
    error_log('[GuajiraBags] Error fatal: ' . $e['message'] . ' @ ' . $e['file'] . ':' . $e['line']);
    if (!headers_sent()) {
        http_response_code(500);
        $enviarCors();
        header('Content-Type: application/json; charset=utf-8');
    }
    echo json_encode(['error' => 'Error interno del servidor']);
});

// Ubicar src/ y config/ (funciona sin importar cómo quedó la carpeta en el hosting)
$baseApi = null;
foreach ([dirname(__DIR__), __DIR__, __DIR__ . '/php-api', dirname(__DIR__) . '/php-api'] as $dir) {
    if (is_file($dir . '/src/bootstrap.php') && is_file($dir . '/config/config.php')) {
        $baseApi = $dir;
        break;
    }
}
if ($baseApi === null) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'No se encuentran las carpetas src/ y config/ junto a public/.']);
    exit;
}
$config = require $baseApi . '/config/config.php';
$origenes = array_unique(array_merge($origenes, $config['cors']['allowed_origins'] ?? []));
$enviarCors();

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require $baseApi . '/src/bootstrap.php';

use GuajiraBags\Controllers\AuthController;
use GuajiraBags\Controllers\CategoriasController;
use GuajiraBags\Controllers\GaleriaController;
use GuajiraBags\Controllers\ImagenController;
use GuajiraBags\Controllers\ProductosController;
use GuajiraBags\Controllers\ResenasController;
use GuajiraBags\Database;
use GuajiraBags\Helpers\JwtHelper;
use GuajiraBags\Helpers\Response;
use GuajiraBags\Schema;
use GuajiraBags\Services\AuthService;
use GuajiraBags\Services\CategoriaService;
use GuajiraBags\Services\FileStorageService;
use GuajiraBags\Services\GaleriaService;
use GuajiraBags\Services\ImageService;
use GuajiraBags\Services\ProductoService;
use GuajiraBags\Services\ResenaService;

$uri = rawurldecode((string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH));
if ($uri !== '/' && str_ends_with($uri, '/')) {
    $uri = rtrim($uri, '/');
}
$images = new ImageService(__DIR__);

// ── Miniaturas: /img/{ancho}/uploads/... (no necesita base de datos) ──
if ($method === 'GET' && preg_match('#^/img/(\d{2,4})/(uploads/.+)$#', $uri, $m)) {
    (new ImagenController($images))->servir((int) $m[1], $m[2]);
}

// ── Archivos /uploads/* (solo si Apache no los sirvió directo, p. ej. con el servidor de PHP) ──
if (str_starts_with($uri, '/uploads/')) {
    $file = realpath(__DIR__ . $uri);
    if ($file && str_starts_with($file, realpath(__DIR__ . '/uploads')) && is_file($file)) {
        $types = ['jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png', 'gif' => 'image/gif', 'webp' => 'image/webp'];
        header('Content-Type: ' . ($types[strtolower(pathinfo($file, PATHINFO_EXTENSION))] ?? 'application/octet-stream'));
        header('Cache-Control: public, max-age=31536000, immutable');
        header('Access-Control-Allow-Origin: *');
        header('Content-Length: ' . filesize($file));
        readfile($file);
        exit;
    }
    http_response_code(404);
    exit;
}

// ── Sitemap siempre actualizado para Google ──
if ($method === 'GET' && $uri === '/sitemap.xml') {
    $esHttps = (($_SERVER['HTTPS'] ?? '') === 'on') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    $apiUrl = ($esHttps ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'api.guajirabags.com');
    (new GuajiraBags\Controllers\SitemapController(Database::get($config), rtrim($config['site_url'] ?? 'https://www.guajirabags.com', '/'), $apiUrl))->servir();
}

if (!str_starts_with($uri, '/api')) {
    Response::error('Ruta no encontrada', 404);
}
$path = substr($uri, 4) ?: '/';

// ── Foto demasiado pesada para el límite del servidor: avisarlo claro (PHP descarta todo en silencio) ──
$aBytes = static function (string $v): int {
    $n = (float) $v;
    return (int) match (strtolower(substr(trim($v), -1))) { 'g' => $n * 1073741824, 'm' => $n * 1048576, 'k' => $n * 1024, default => $n };
};
$limite = min($aBytes((string) ini_get('post_max_size')), $aBytes((string) ini_get('upload_max_filesize')));
if (in_array($method, ['POST', 'PUT'], true) && $limite > 0 && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > $aBytes((string) ini_get('post_max_size'))) {
    Response::error(sprintf('La foto pesa %.1f MB y el servidor solo permite hasta %.0f MB. Prueba con una foto más liviana.', ((int) $_SERVER['CONTENT_LENGTH']) / 1048576, $limite / 1048576), 413);
}
foreach ($_FILES as $f) {
    $err = is_array($f['error'] ?? null) ? 0 : (int) ($f['error'] ?? 0);
    if ($err === UPLOAD_ERR_INI_SIZE || $err === UPLOAD_ERR_FORM_SIZE) {
        Response::error(sprintf('La foto supera el máximo que permite el servidor (%.0f MB). Prueba con una foto más liviana.', $limite / 1048576), 413);
    }
}

// ── Dependencias (se crean solo cuando se usan) ──
$db = Database::get($config);
$storageDir = is_dir($baseApi . '/storage') ? $baseApi . '/storage' : sys_get_temp_dir();
Schema::ensure($db, $storageDir);
$storage = new FileStorageService($config, $images);

$tieneSesion = static function () use ($config): bool {
    $token = JwtHelper::extractBearerToken();
    return $token && JwtHelper::decode($token, $config['jwt']);
};
$requireAuth = static function () use ($config): array {
    $token = JwtHelper::extractBearerToken();
    $payload = $token ? JwtHelper::decode($token, $config['jwt']) : null;
    if (!$payload) {
        Response::error($token ? 'Token inválido o expirado' : 'No autorizado', 401);
    }
    return $payload;
};
$productos = static fn() => new ProductosController(new ProductoService($db, $storage));
$galeria   = static fn() => new GaleriaController(new GaleriaService($db, $storage));
$resenas   = static fn() => new ResenasController(new ResenaService($db));
$auth      = static fn() => new AuthController(new AuthService($db, $config['jwt']));
$categorias = static fn() => new CategoriasController(new CategoriaService($db));

// ── Rutas: [método, patrón, protegida, acción] ──
$routes = [
    ['POST',   '#^/auth/login$#',                         false, fn() => $auth()->login()],
    ['POST',   '#^/auth/register$#',                      true,  fn() => $auth()->register()],

    ['GET',    '#^/productos$#',                          false, fn() => $productos()->listar()],
    ['POST',   '#^/productos$#',                          true,  fn() => $productos()->crear()],
    ['GET',    '#^/productos/(\d+)$#',                    false, fn($id) => $productos()->obtener((int) $id)],
    ['PUT',    '#^/productos/(\d+)$#',                    true,  fn($id) => $productos()->actualizar((int) $id)],
    ['DELETE', '#^/productos/(\d+)$#',                    true,  fn($id) => $productos()->eliminar((int) $id)],
    ['POST',   '#^/productos/(\d+)/imagenes$#',           true,  fn($id) => $productos()->agregarImagen((int) $id)],
    ['DELETE', '#^/productos/(\d+)/imagenes/(\d+)$#',     true,  fn($id, $img) => $productos()->eliminarImagen((int) $id, (int) $img)],

    ['GET',    '#^/productos/(\d+)/resenas$#',            false, fn($id) => $resenas()->listarDeProducto((int) $id)],
    ['POST',   '#^/productos/(\d+)/resenas$#',            false, fn($id) => $resenas()->crear((int) $id)],
    ['GET',    '#^/resenas/resumen$#',                    false, fn() => $resenas()->resumen()],
    ['GET',    '#^/resenas/recientes$#',                  false, fn() => $resenas()->recientes()],
    // Sin sesión: todas las reseñas visibles (inicio). Con sesión: listado del panel.
    ['GET',    '#^/resenas$#',                            false, fn() => $tieneSesion() ? $resenas()->listarAdmin() : $resenas()->listarTodas()],
    // Reseña desde el inicio (de la tienda o de una mochila)
    ['POST',   '#^/resenas$#',                            false, fn() => $resenas()->crearGeneral()],
    ['PUT',    '#^/resenas/(\d+)$#',                      true,  fn($id) => $resenas()->actualizar((int) $id)],
    ['DELETE', '#^/resenas/(\d+)$#',                      true,  fn($id) => $resenas()->eliminar((int) $id)],

    ['GET',    '#^/categorias$#',                         false, fn() => $categorias()->listar($tieneSesion())],
    ['POST',   '#^/categorias$#',                         true,  fn() => $categorias()->crear()],
    ['PUT',    '#^/categorias/orden$#',                   true,  fn() => $categorias()->reordenar()],
    ['PUT',    '#^/categorias/(\d+)$#',                   true,  fn($id) => $categorias()->actualizar((int) $id)],
    ['DELETE', '#^/categorias/(\d+)$#',                   true,  fn($id) => $categorias()->eliminar((int) $id)],

    ['GET',    '#^/galeria$#',                            false, fn() => $galeria()->listar()],
    ['POST',   '#^/galeria$#',                            true,  fn() => $galeria()->crear()],
    ['GET',    '#^/galeria/(\d+)$#',                      false, fn($id) => $galeria()->obtener((int) $id)],
    ['PUT',    '#^/galeria/(\d+)$#',                      true,  fn($id) => $galeria()->actualizar((int) $id)],
    ['DELETE', '#^/galeria/(\d+)$#',                      true,  fn($id) => $galeria()->eliminar((int) $id)],

];

try {
    $existe = false;
    foreach ($routes as [$verb, $pattern, $protegida, $action]) {
        if (!preg_match($pattern, $path, $m)) {
            continue;
        }
        $existe = true;
        if ($verb !== $method) {
            continue;
        }
        if ($protegida) {
            $requireAuth();
        }
        $action(...array_slice($m, 1));
    }
    Response::error($existe ? 'Método no permitido' : 'Ruta no encontrada', $existe ? 405 : 404);
} catch (Throwable $e) {
    error_log('[GuajiraBags] ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    Response::error('Ocurrió un error en el servidor', 500);
}
