<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/upload.php';

$pdo = obtenerConexion();
$usuario = requerirSesionAdmin($pdo);

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    $consulta = $pdo->query(
        'SELECT d.id, d.titulo, d.descripcion, d.nombre_original, d.tipo_mime, d.tamano_bytes,
                d.visible, d.orden, d.descargas, d.creado_en,
                c.id AS categoria_id, c.nombre AS categoria_nombre
         FROM documentos_esal d
         INNER JOIN categorias_documentos c ON c.id = d.categoria_id
         ORDER BY c.orden ASC, d.orden ASC, d.creado_en DESC'
    );
    responderExito(['documentos' => $consulta->fetchAll()]);
}

if ($metodo === 'POST') {
    $categoriaId = (int) ($_POST['categoria_id'] ?? 0);
    $titulo = trim($_POST['titulo'] ?? '');
    $descripcion = trim($_POST['descripcion'] ?? '');

    if ($categoriaId <= 0 || $titulo === '') {
        responderError('La categoría y el título son obligatorios.', 400);
    }

    if (empty($_FILES['archivo'])) {
        responderError('Debes adjuntar un archivo.', 400);
    }

    $archivo = procesarArchivoSubido($_FILES['archivo']);

    $consulta = $pdo->prepare(
        'INSERT INTO documentos_esal
            (categoria_id, titulo, descripcion, nombre_original, nombre_archivo, tipo_mime, tamano_bytes, subido_por)
         VALUES
            (:categoria_id, :titulo, :descripcion, :nombre_original, :nombre_archivo, :tipo_mime, :tamano_bytes, :subido_por)'
    );
    $consulta->execute([
        'categoria_id' => $categoriaId,
        'titulo' => $titulo,
        'descripcion' => $descripcion ?: null,
        'nombre_original' => $archivo['nombre_original'],
        'nombre_archivo' => $archivo['nombre_archivo'],
        'tipo_mime' => $archivo['tipo_mime'],
        'tamano_bytes' => $archivo['tamano_bytes'],
        'subido_por' => $usuario['id'],
    ]);

    responderExito(['id' => (int) $pdo->lastInsertId()], 201);
}

if ($metodo === 'PUT') {
    $id = (int) ($_GET['id'] ?? 0);
    $datos = leerCuerpoJson();

    if ($id <= 0) {
        responderError('Documento no válido.', 400);
    }

    $consulta = $pdo->prepare(
        'UPDATE documentos_esal
         SET titulo = :titulo, descripcion = :descripcion, categoria_id = :categoria_id,
             visible = :visible, orden = :orden
         WHERE id = :id'
    );
    $consulta->execute([
        'titulo' => trim($datos['titulo'] ?? ''),
        'descripcion' => trim($datos['descripcion'] ?? '') ?: null,
        'categoria_id' => (int) ($datos['categoria_id'] ?? 0),
        'visible' => !empty($datos['visible']) ? 1 : 0,
        'orden' => (int) ($datos['orden'] ?? 0),
        'id' => $id,
    ]);

    responderExito();
}

if ($metodo === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);

    if ($id <= 0) {
        responderError('Documento no válido.', 400);
    }

    $consulta = $pdo->prepare('SELECT nombre_archivo FROM documentos_esal WHERE id = :id');
    $consulta->execute(['id' => $id]);
    $documento = $consulta->fetch();

    if (!$documento) {
        responderError('Documento no encontrado.', 404);
    }

    $pdo->prepare('DELETE FROM documentos_esal WHERE id = :id')->execute(['id' => $id]);
    eliminarArchivoFisico($documento['nombre_archivo']);

    responderExito();
}

responderError('Método no permitido.', 405);
