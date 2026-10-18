<?php
/**
 * Genera el hash BCrypt para el usuario admin.
 * Uso: php scripts/setup-admin.php
 *
 * Actualiza el password_hash del usuario 'admin' en la base de datos.
 */ 

require __DIR__ . '/../src/bootstrap.php';

$config = require __DIR__ . '/../config/config.php';
$db = GuajiraBags\Database::get($config);

$password = $argv[1] ?? 'Admin123!';
$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

$stmt = $db->prepare('SELECT id FROM usuarios WHERE username = ?');
$stmt->execute(['admin']);

if ($stmt->fetch()) {
    $stmt = $db->prepare('UPDATE usuarios SET password_hash = ? WHERE username = ?');
    $stmt->execute([$hash, 'admin']);
    echo "Contraseña del admin actualizada.\n";
} else {
    $stmt = $db->prepare(
        'INSERT INTO usuarios (username, email, password_hash, rol) VALUES (?, ?, ?, ?)'
    );
    $stmt->execute(['admin', 'admin@guajirabags.com', $hash, 'admin']);
    echo "Usuario admin creado.\n";
}

echo "Usuario: admin\n";
echo "Contraseña: $password\n";
echo "Hash: $hash\n";
