<?php

namespace GuajiraBags;

use PDO;
use Throwable;

/**
 * Migraciones automáticas: se ejecutan UNA sola vez y dejan una marca en storage/.
 * No borran nada: solo agregan la columna, los índices y la tabla que falten.
 */
class Schema
{
    private const VERSION = 'v3b';

    public static function ensure(PDO $db, string $storageDir): void
    {
        $flag = rtrim($storageDir, '/\\') . DIRECTORY_SEPARATOR . 'schema-' . self::VERSION . '.done';
        if (is_file($flag)) {
            return;
        }
        try {
            if (!self::hasColumn($db, 'productos', 'codigo')) {
                $db->exec('ALTER TABLE productos ADD COLUMN codigo VARCHAR(60) NULL AFTER id');
            }
            self::index($db, 'productos', 'idx_productos_activo_fecha', '(activo, creado_en)');
            self::index($db, 'producto_imagenes', 'idx_prodimg_orden', '(producto_id, orden)');
            self::index($db, 'galeria', 'idx_galeria_activo_orden', '(activo, orden)');
            $db->exec("CREATE TABLE IF NOT EXISTS resenas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                producto_id INT NULL,
                nombre VARCHAR(80) NOT NULL,
                ciudad VARCHAR(80) NULL,
                calificacion TINYINT NOT NULL,
                comentario TEXT NOT NULL,
                visible TINYINT(1) NOT NULL DEFAULT 1,
                creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_resenas_producto (producto_id, visible, creado_en)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
            @file_put_contents($flag, date('c'));
        } catch (Throwable $e) {
            error_log('[GuajiraBags] Migración: ' . $e->getMessage());
        }
    }

    public static function hasColumn(PDO $db, string $table, string $column): bool
    {
        $stmt = $db->prepare('SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?');
        $stmt->execute([$table, $column]);
        return (int) $stmt->fetchColumn() > 0;
    }

    private static function index(PDO $db, string $table, string $name, string $cols): void
    {
        $stmt = $db->prepare('SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?');
        $stmt->execute([$table, $name]);
        if ((int) $stmt->fetchColumn() === 0) {
            $db->exec("CREATE INDEX $name ON $table $cols");
        }
    }
}
