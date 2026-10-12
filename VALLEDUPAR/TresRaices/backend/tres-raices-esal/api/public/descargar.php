<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    responderError('Método no permitido.', 405);
}

$id = (int) ($_GET['id'] ?? 0);

if ($id <= 0) {
    responderError('Documento no válido.', 400);
}

$pdo = obtenerConexion();

$consulta = $pdo->prepare(
    'SELECT nombre_archivo, nombre_original, tipo_mime
     FROM documentos_esal
     WHERE id = :id AND visible = 1'
);
$consulta->execute(['id' => $id]);
$documento = $consulta->fetch();

if (!$documento) {
    responderError('Documento no encontrado.', 404);
}

$rutaArchivo = __DIR__ . '/../uploads/esal/' . $documento['nombre_archivo'];

if (!is_file($rutaArchivo)) {
    responderError('El archivo ya no está disponible.', 404);
}

$pdo->prepare('UPDATE documentos_esal SET descargas = descargas + 1 WHERE id = :id')
    ->execute(['id' => $id]);

header('Content-Type: ' . $documento['tipo_mime']);
header('Content-Disposition: inline; filename="' . $documento['nombre_original'] . '"');
header('Content-Length: ' . filesize($rutaArchivo));
readfile($rutaArchivo);
exit;
