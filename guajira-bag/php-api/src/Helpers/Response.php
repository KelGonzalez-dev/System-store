<?php

namespace GuajiraBags\Helpers;

class Response
{
    public static function json(mixed $data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
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

    /** Convierte snake_case de filas MySQL a camelCase para el frontend. */
    public static function toCamelCase(array $row): array
    {
        $result = [];
        foreach ($row as $key => $value) {
            $camel = lcfirst(str_replace(' ', '', ucwords(str_replace('_', ' ', $key))));
            $result[$camel] = $value;
        }
        return $result;
    }

    public static function boolFromDb(mixed $value): bool
    {
        return (bool) (int) $value;
    }
}
