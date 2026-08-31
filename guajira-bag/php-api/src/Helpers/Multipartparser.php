<?php

namespace GuajiraBags\Helpers;

/**
 * PHP solo llena $_POST y $_FILES automáticamente cuando el método es POST.
 * En peticiones PUT (o PATCH) con Content-Type: multipart/form-data, el
 * cuerpo llega intacto en php://input y hay que parsearlo a mano.
 *
 * Sin este parser, un PUT con FormData (como el que usa el panel de admin
 * para editar productos) llega con $_POST y $_FILES completamente vacíos,
 * por lo que el backend no detecta ningún campo para actualizar y el
 * UPDATE nunca se ejecuta — aunque la API responda 200 "OK".
 */
class MultipartParser
{
    /** @return array{0: array<string,string>, 1: array<string,array>} [$post, $files] */
    public static function parse(): array
    {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
        if (!preg_match('/boundary=(.*)$/i', $contentType, $m)) {
            return [[], []];
        }
        $boundary = trim($m[1], '"');

        $raw = file_get_contents('php://input');
        if ($raw === false || $raw === '') {
            return [[], []];
        }

        $blocks = preg_split('/-+' . preg_quote($boundary, '/') . '/', $raw);
        $post  = [];
        $files = [];

        foreach ($blocks as $block) {
            $block = trim($block, "\r\n");
            if ($block === '' || $block === '--') {
                continue;
            }

            $parts = explode("\r\n\r\n", $block, 2);
            if (count($parts) !== 2) {
                continue;
            }
            [$rawHeaders, $content] = $parts;
            // Quitar el \r\n final que separa el contenido del siguiente boundary
            $content = preg_replace('/\r\n$/', '', $content);

            if (!preg_match('/name="([^"]+)"/', $rawHeaders, $nameMatch)) {
                continue;
            }
            $name = $nameMatch[1];

            if (preg_match('/filename="([^"]*)"/', $rawHeaders, $fileMatch)) {
                $filename = $fileMatch[1];
                if ($filename === '') {
                    // <input type="file"> enviado sin seleccionar archivo
                    continue;
                }

                preg_match('/Content-Type:\s*([^\r\n]+)/i', $rawHeaders, $typeMatch);
                $mimeType = trim($typeMatch[1] ?? 'application/octet-stream');

                $tmpPath = tempnam(sys_get_temp_dir(), 'gb_upload_');
                file_put_contents($tmpPath, $content);

                $files[$name] = [
                    'name'     => $filename,
                    'type'     => $mimeType,
                    'tmp_name' => $tmpPath,
                    'error'    => UPLOAD_ERR_OK,
                    'size'     => strlen($content),
                ];
            } else {
                $post[$name] = $content;
            }
        }

        return [$post, $files];
    }

    /**
     * Si la petición es PUT/PATCH y trae multipart/form-data, parsea el
     * body y llena $_POST y $_FILES para que el resto del código (que
     * usa $_POST/$_FILES como siempre) funcione sin cambios.
     */
    public static function hydrateSuperglobals(): void
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? '';
        $contentType = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';

        if (!in_array($method, ['PUT', 'PATCH'], true)) {
            return;
        }
        if (stripos($contentType, 'multipart/form-data') === false) {
            return;
        }

        [$post, $files] = self::parse();
        $_POST  = $post;
        $_FILES = $files;
    }
}