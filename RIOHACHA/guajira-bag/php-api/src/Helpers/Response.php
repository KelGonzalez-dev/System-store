<?php

namespace GuajiraBags\Helpers;

class Response
{
    /**
     * JSON comprimido (gzip) y con ETag. Las rutas públicas pueden cachearse unos segundos;
     * si el navegador ya tiene la misma respuesta se devuelve 304 sin cuerpo.
     * Las peticiones con sesión (panel) nunca se cachean.
     */
    public static function json(mixed $data, int $status = 200, int $maxAge = 0): void
    {
        $body = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('X-Content-Type-Options: nosniff');

        $conSesion = !empty($_SERVER['HTTP_AUTHORIZATION']) || !empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
        if ($status === 200 && $maxAge > 0 && !$conSesion) {
            $etag = '"' . md5($body) . '"';
            header('ETag: ' . $etag);
            header("Cache-Control: public, max-age=$maxAge, stale-while-revalidate=" . ($maxAge * 5));
            header('Vary: Accept-Encoding, Origin');
            if (trim($_SERVER['HTTP_IF_NONE_MATCH'] ?? '') === $etag) {
                http_response_code(304);
                exit;
            }
        } else {
            header('Cache-Control: no-store');
        }

        if (str_contains($_SERVER['HTTP_ACCEPT_ENCODING'] ?? '', 'gzip') && strlen($body) > 1024
            && function_exists('gzencode') && !ini_get('zlib.output_compression')) {
            $body = gzencode($body, 6);
            header('Content-Encoding: gzip');
        }
        header('Content-Length: ' . strlen($body));
        echo $body;
        exit;
    }

    public static function error(string $message, int $status = 400): void
    {
        self::json(['error' => $message], $status);
    }

    public static function noContent(): void
    {
        http_response_code(204);
        exit;
    }

    public static function boolFromDb(mixed $value): bool
    {
        return (bool) (int) $value;
    }
}
