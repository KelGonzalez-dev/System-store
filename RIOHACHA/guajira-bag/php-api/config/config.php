<?php

return [
    'db' => [
        'host'     => 'sdb-73.hosting.stackcp.net',
        'port'     => 3306,
        'database' => 'guajira_bags-35303633f0ae',
        'username' => 'guajira_bags-35303633f0ae',
        'password' => '3$1MyVk![H)z',
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
