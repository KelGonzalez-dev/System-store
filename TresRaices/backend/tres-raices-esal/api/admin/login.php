<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responderError('Método no permitido.', 405);
}

$datos = leerCuerpoJson();
$usuario = trim($datos['usuario'] ?? '');
$clave = $datos['clave'] ?? '';

if ($usuario === '' || $clave === '') {
    responderError('Usuario y clave son obligatorios.', 400);
}

$pdo = obtenerConexion();
limpiarSesionesExpiradas($pdo);

$consulta = $pdo->prepare('SELECT * FROM usuarios_admin WHERE usuario = :usuario');
$consulta->execute(['usuario' => $usuario]);
$fila = $consulta->fetch();

if (!$fila) {
    responderError('Usuario o clave incorrectos.', 401);
}

if ($fila['bloqueado_hasta'] && strtotime($fila['bloqueado_hasta']) > time()) {
    responderError('Cuenta bloqueada temporalmente por varios intentos fallidos. Intenta más tarde.', 423);
}

if (!password_verify($clave, $fila['password_hash'])) {
    $intentos = (int) $fila['intentos_fallidos'] + 1;
    $bloqueadoHasta = null;

    if ($intentos >= 5) {
        $bloqueadoHasta = (new DateTime())->modify('+15 minutes')->format('Y-m-d H:i:s');
        $intentos = 0;
    }

    $pdo->prepare('UPDATE usuarios_admin SET intentos_fallidos = :intentos, bloqueado_hasta = :bloqueado WHERE id = :id')
        ->execute(['intentos' => $intentos, 'bloqueado' => $bloqueadoHasta, 'id' => $fila['id']]);

    responderError('Usuario o clave incorrectos.', 401);
}

if (!$fila['activo']) {
    responderError('Este usuario está deshabilitado.', 403);
}

$pdo->prepare(
    'UPDATE usuarios_admin
     SET intentos_fallidos = 0, bloqueado_hasta = NULL, ultimo_login = NOW()
     WHERE id = :id'
)->execute(['id' => $fila['id']]);

$token = crearSesion($pdo, (int) $fila['id']);

responderExito([
    'token' => $token,
    'usuario' => [
        'id' => (int) $fila['id'],
        'nombre' => $fila['nombre'],
        'usuario' => $fila['usuario'],
    ],
]);
