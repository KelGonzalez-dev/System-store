<?php
/**
 * GUAJIRA BAGS — configuración de la API
 *
 * ⚠️ En el servidor YA tienes tu config/config.php con tus datos: NO lo reemplaces.
 *    Este archivo es solo de referencia (para una instalación nueva, cópialo como config.php).
 */
return [
    'db' => [
        'host'     => 'localhost',
        'port'     => 3306,
        'database' => 'guajira_bags',
        'username' => 'root',
        'password' => '',
        'charset'  => 'utf8mb4',
    ],
    'jwt' => [
        'key'                => 'pon-aqui-una-frase-larga-y-secreta-de-mas-de-32-caracteres',
        'issuer'             => 'guajira-bags-api',
        'audience'           => 'guajira-bags-frontend',
        'expires_in_minutes' => 1440,
    ],
    'cors' => [
        // guajirabags.com, www.guajirabags.com y localhost ya vienen permitidos en index.php
        'allowed_origins' => [],
    ],
    'uploads' => [
        'folder'      => __DIR__ . '/../public/uploads',
        'max_size_mb' => 12,  // las fotos se optimizan al subirlas (quedan en ~200 KB)
        'allowed_ext' => ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    ],
];
