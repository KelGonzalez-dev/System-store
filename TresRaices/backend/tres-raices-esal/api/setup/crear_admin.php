<?php

require_once __DIR__ . '/../config/database.php';

header('Content-Type: text/plain; charset=utf-8');

$nombre = 'Kelmer';
$usuario = 'CAMBIAR_USUARIO';
$claveTemporal = 'CAMBIAR_CLAVE_TEMPORAL';

$pdo = obtenerConexion();

$existe = $pdo->prepare('SELECT id FROM usuarios_admin WHERE usuario = :usuario');
$existe->execute(['usuario' => $usuario]);

if ($existe->fetch()) {
    echo "Ya existe un usuario con ese nombre de usuario.\n";
    exit;
}

$hash = password_hash($claveTemporal, PASSWORD_BCRYPT);

$consulta = $pdo->prepare(
    'INSERT INTO usuarios_admin (nombre, usuario, password_hash) VALUES (:nombre, :usuario, :hash)'
);
$consulta->execute(['nombre' => $nombre, 'usuario' => $usuario, 'hash' => $hash]);

echo "Usuario administrador creado correctamente.\n";
echo "Usuario: {$usuario}\n";
echo "Clave temporal: {$claveTemporal}\n";
echo "Borra este archivo (setup/crear_admin.php) ahora mismo.\n";
