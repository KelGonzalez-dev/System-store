<?php
/**
 * Configuración de la API Guajira Bags
 * Copia config.local.php.example → config.local.php para sobreescribir en producción.
 */

$config = [
    'db' => [
        'host'     => 'localhost',
        'port'     => 3306,
        'database' => 'guajira_bags',
        'username' => 'root',
        'password' => '',
        'charset'  => 'utf8mb4',
    ],
    'jwt' => [
        'key'              => 'GuajiraBagsJWT2026ClaveSuperSecreta123456789',
        'issuer'           => 'guajira-bags-api',
        'audience'         => 'guajira-bags-frontend',
        'expires_in_minutes' => 1440,
    ],
    'cors' => [
        'allowed_origins' => [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5173',
        ],
    ],
    'uploads' => [
        'folder'        => __DIR__ . '/../public/uploads',
        'max_size_mb'   => 5,
        'allowed_ext'   => ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    ],
];

$localConfig = __DIR__ . '/config.local.php';
if (file_exists($localConfig)) {
    $local = require $localConfig;
    $config = array_replace_recursive($config, $local);
}

return $config;
