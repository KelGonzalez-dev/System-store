<?php

$origenesPermitidos = [
    'https://cooperativatresraices.com',
    'https://www.cooperativatresraices.com',
    'http://localhost:5173',
];

$origen = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origen, $origenesPermitidos, true)) {
    header("Access-Control-Allow-Origin: {$origen}");
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
