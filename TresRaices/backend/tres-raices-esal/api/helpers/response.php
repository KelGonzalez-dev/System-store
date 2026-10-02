<?php

function responderJson(array $datos, int $codigo = 200): void
{
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

function responderError(string $mensaje, int $codigo = 400): void
{
    responderJson(['exito' => false, 'error' => $mensaje], $codigo);
}

function responderExito(array $datos = [], int $codigo = 200): void
{
    responderJson(array_merge(['exito' => true], $datos), $codigo);
}

function leerCuerpoJson(): array
{
    $crudo = file_get_contents('php://input');
    $datos = json_decode($crudo, true);
    return is_array($datos) ? $datos : [];
}
