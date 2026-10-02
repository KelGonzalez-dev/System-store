<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';

$pdo = obtenerConexion();
requerirSesionAdmin($pdo);

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    $consulta = $pdo->query(
        'SELECT id, slug, nombre, orden, activa
         FROM categorias_documentos
         ORDER BY orden ASC, nombre ASC'
    );
    responderExito(['categorias' => $consulta->fetchAll()]);
}

if ($metodo === 'POST') {
    $datos = leerCuerpoJson();
    $nombre = trim($datos['nombre'] ?? '');

    if ($nombre === '') {
        responderError('El nombre de la categoría es obligatorio.', 400);
    }

    $slug = trim($datos['slug'] ?? '') ?: strtolower(preg_replace('/[^a-z0-9]+/i', '-', $nombre));
    $slug = trim($slug, '-');
    $orden = (int) ($datos['orden'] ?? 0);

    $consulta = $pdo->prepare(
        'INSERT INTO categorias_documentos (slug, nombre, orden) VALUES (:slug, :nombre, :orden)'
    );

    try {
        $consulta->execute(['slug' => $slug, 'nombre' => $nombre, 'orden' => $orden]);
    } catch (PDOException $error) {
        responderError('Ya existe una categoría con ese identificador.', 409);
    }

    responderExito(['id' => (int) $pdo->lastInsertId()], 201);
}

if ($metodo === 'PUT') {
    $id = (int) ($_GET['id'] ?? 0);
    $datos = leerCuerpoJson();

    if ($id <= 0) {
        responderError('Categoría no válida.', 400);
    }

    $consulta = $pdo->prepare(
        'UPDATE categorias_documentos
         SET nombre = :nombre, orden = :orden, activa = :activa
         WHERE id = :id'
    );
    $consulta->execute([
        'nombre' => trim($datos['nombre'] ?? ''),
        'orden' => (int) ($datos['orden'] ?? 0),
        'activa' => !empty($datos['activa']) ? 1 : 0,
        'id' => $id,
    ]);

    responderExito();
}

if ($metodo === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);

    if ($id <= 0) {
        responderError('Categoría no válida.', 400);
    }

    $conDocumentos = $pdo->prepare('SELECT COUNT(*) AS total FROM documentos_esal WHERE categoria_id = :id');
    $conDocumentos->execute(['id' => $id]);

    if ((int) $conDocumentos->fetch()['total'] > 0) {
        responderError('No se puede eliminar: la categoría tiene documentos asociados.', 409);
    }

    $pdo->prepare('DELETE FROM categorias_documentos WHERE id = :id')->execute(['id' => $id]);
    responderExito();
}

responderError('Método no permitido.', 405);
