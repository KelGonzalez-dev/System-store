<?php

declare(strict_types=1);

require __DIR__ . '/../src/bootstrap.php';

use GuajiraBags\Controllers\AuthController;
use GuajiraBags\Controllers\GaleriaController;
use GuajiraBags\Controllers\ProductosController;
use GuajiraBags\Database;
use GuajiraBags\Helpers\JwtHelper;
use GuajiraBags\Helpers\Response;
use GuajiraBags\Services\AuthService;
use GuajiraBags\Services\FileStorageService;
use GuajiraBags\Services\GaleriaService;
use GuajiraBags\Services\ProductoService;

$config = require __DIR__ . '/../config/config.php';

// ── CORS ─────────────────────────────────────────────────────
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, $config['cors']['allowed_origins'], true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── Routing ──────────────────────────────────────────────────
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Normalizar URI (quitar trailing slash excepto raíz)
if ($uri !== '/' && str_ends_with($uri, '/')) {
    $uri = rtrim($uri, '/');
}

// Servir archivos estáticos /uploads/* (necesario con PHP built-in server)
if (str_starts_with($uri, '/uploads/')) {
    $filePath = __DIR__ . $uri;
    if (is_file($filePath)) {
        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        $mimeTypes = [
            'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png', 'gif' => 'image/gif',
            'webp' => 'image/webp',
        ];
        header('Content-Type: ' . ($mimeTypes[$ext] ?? 'application/octet-stream'));
        readfile($filePath);
        exit;
    }
    http_response_code(404);
    exit;
}

// Solo manejamos rutas /api/*
if (!str_starts_with($uri, '/api')) {
    http_response_code(404);
    Response::json(['error' => 'Ruta no encontrada'], 404);
}

$path = substr($uri, strlen('/api'));
$db      = Database::get($config);
$storage = new FileStorageService($config);
  
$authCtrl     = new AuthController(new AuthService($db, $config['jwt']));
$productosCtrl = new ProductosController(new ProductoService($db, $storage));
$galeriaCtrl  = new GaleriaController(new GaleriaService($db, $storage));

/** Verifica JWT para rutas protegidas. */
$requireAuth = function () use ($config): void {
    $token = JwtHelper::extractBearerToken();
    if (!$token) {
        Response::error('No autorizado', 401);
    }
    $payload = JwtHelper::decode($token, $config['jwt']);
    if (!$payload) {
        Response::error('Token inválido o expirado', 401);
    }
};

// ── Auth ─────────────────────────────────────────────────────
if ($path === '/auth/register' && $method === 'POST') {
    $authCtrl->register();
}
if ($path === '/auth/login' && $method === 'POST') {
    $authCtrl->login();
}

// ── Productos ────────────────────────────────────────────────
if ($path === '/productos' && $method === 'GET') {
    $productosCtrl->listar();
}
if ($path === '/productos' && $method === 'POST') {
    $requireAuth();
    $productosCtrl->crear();
}
if (preg_match('#^/productos/(\d+)$#', $path, $m)) {
    $id = (int) $m[1];
    if ($method === 'GET') {
        $productosCtrl->obtener($id);
    }
    if ($method === 'PUT') {
        $requireAuth();
        $productosCtrl->actualizar($id);
    }
    if ($method === 'DELETE') {
        $requireAuth();
        $productosCtrl->eliminar($id);
    }
}
if (preg_match('#^/productos/(\d+)/imagenes$#', $path, $m) && $method === 'POST') {
    $requireAuth();
    $productosCtrl->agregarImagen((int) $m[1]);
}

// ── Galería ──────────────────────────────────────────────────
if ($path === '/galeria' && $method === 'GET') {
    $galeriaCtrl->listar();
}
if ($path === '/galeria' && $method === 'POST') {
    $requireAuth();
    $galeriaCtrl->crear();
}
if (preg_match('#^/galeria/(\d+)$#', $path, $m)) {
    $id = (int) $m[1];
    if ($method === 'GET') {
        $galeriaCtrl->obtener($id);
    }
    if ($method === 'PUT') {
        $requireAuth();
        $galeriaCtrl->actualizar($id);
    }
    if ($method === 'DELETE') {
        $requireAuth();
        $galeriaCtrl->eliminar($id);
    }
}

Response::json(['error' => 'Ruta no encontrada'], 404);
