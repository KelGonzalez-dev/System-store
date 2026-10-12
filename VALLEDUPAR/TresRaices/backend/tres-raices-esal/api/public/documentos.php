<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    responderError('Método no permitido.', 405);
}

$pdo = obtenerConexion();

$sql = 'SELECT d.id, d.titulo, d.descripcion, d.nombre_original, d.tipo_mime,
               d.tamano_bytes, d.creado_en, c.slug AS categoria_slug, c.nombre AS categoria_nombre
        FROM documentos_esal d
        INNER JOIN categorias_documentos c ON c.id = d.categoria_id
        WHERE d.visible = 1 AND c.activa = 1';

$parametros = [];

if (!empty($_GET['categoria'])) {
    $sql .= ' AND c.slug = :categoria';
    $parametros['categoria'] = $_GET['categoria'];
}

$sql .= ' ORDER BY c.orden ASC, d.orden ASC, d.creado_en DESC';

$consulta = $pdo->prepare($sql);
$consulta->execute($parametros);

responderExito(['documentos' => $consulta->fetchAll()]);
