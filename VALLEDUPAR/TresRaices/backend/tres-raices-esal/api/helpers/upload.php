<?php

require_once __DIR__ . '/response.php';

const TIPOS_PERMITIDOS = [
    'application/pdf' => 'pdf',
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'application/msword' => 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
    'application/vnd.ms-excel' => 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'xlsx',
];

const TAMANO_MAXIMO_BYTES = 15 * 1024 * 1024;

function procesarArchivoSubido(array $archivo): array
{
    if (($archivo['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        responderError('No se pudo recibir el archivo.', 400);
    }

    if ($archivo['size'] > TAMANO_MAXIMO_BYTES) {
        responderError('El archivo supera el tamaño máximo permitido (15 MB).', 413);
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $tipoMime = finfo_file($finfo, $archivo['tmp_name']);
    finfo_close($finfo);

    if (!isset(TIPOS_PERMITIDOS[$tipoMime])) {
        responderError('Tipo de archivo no permitido. Usa PDF, JPG, PNG, DOC, DOCX, XLS o XLSX.', 415);
    }

    $extension = TIPOS_PERMITIDOS[$tipoMime];
    $nombreArchivo = bin2hex(random_bytes(16)) . '.' . $extension;
    $carpetaDestino = __DIR__ . '/../uploads/esal/';
    $rutaDestino = $carpetaDestino . $nombreArchivo;

    if (!move_uploaded_file($archivo['tmp_name'], $rutaDestino)) {
        responderError('No se pudo guardar el archivo en el servidor.', 500);
    }

    return [
        'nombre_original' => basename($archivo['name']),
        'nombre_archivo' => $nombreArchivo,
        'tipo_mime' => $tipoMime,
        'tamano_bytes' => $archivo['size'],
    ];
}

function eliminarArchivoFisico(string $nombreArchivo): void
{
    $ruta = __DIR__ . '/../uploads/esal/' . $nombreArchivo;

    if (is_file($ruta)) {
        unlink($ruta);
    }
}
