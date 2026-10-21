<?php

namespace GuajiraBags\Controllers;

use GuajiraBags\Services\ImageService;

/** GET /img/{ancho}/uploads/... → miniatura optimizada (se genera una vez y queda en caché). */
class ImagenController
{
    public function __construct(private ImageService $images) {}

    public function servir(int $width, string $relative): void
    {
        $res = $this->images->thumbnail($relative, $width);
        if (!$res) {
            http_response_code(404);
            exit;
        }
        [$file, $type] = $res;
        $mtime = filemtime($file);
        $etag = '"' . dechex($mtime) . '-' . dechex(filesize($file)) . '"';
        header('Content-Type: ' . $type);
        header('Cache-Control: public, max-age=31536000, immutable');
        header('ETag: ' . $etag);
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $mtime) . ' GMT');
        header('Access-Control-Allow-Origin: *');
        if (trim($_SERVER['HTTP_IF_NONE_MATCH'] ?? '') === $etag) {
            http_response_code(304);
            exit;
        }
        header('Content-Length: ' . filesize($file));
        readfile($file);
        exit;
    }
}
