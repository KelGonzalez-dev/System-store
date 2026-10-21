<?php

namespace GuajiraBags;

use PDO;
use PDOException;

/** Conexión única y perezosa: solo se abre si la ruta realmente necesita la base de datos. */
class Database
{
    private static ?PDO $instance = null;

    public static function get(array $config): PDO
    {
        if (self::$instance === null) {
            $db = $config['db'];
            $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=%s', $db['host'], $db['port'] ?? 3306, $db['database'], $db['charset'] ?? 'utf8mb4');
            try {
                self::$instance = new PDO($dsn, $db['username'], $db['password'], [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ]);
            } catch (PDOException $e) {
                error_log('[GuajiraBags] DB: ' . $e->getMessage());
                Helpers\Response::error('Error de conexión a la base de datos', 500);
            }
        }
        return self::$instance;
    }
}
