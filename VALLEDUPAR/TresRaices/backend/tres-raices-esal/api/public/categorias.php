<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    responderError('Método no permitido.', 405);
}

$pdo = obtenerConexion();

$consulta = $pdo->query(
    'SELECT id, slug, nombre
     FROM categorias_documentos
     WHERE activa = 1
     ORDER BY orden ASC, nombre ASC'
);

responderExito(['categorias' => $consulta->fetchAll()]);
