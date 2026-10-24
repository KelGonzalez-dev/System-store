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
    private const VERSION = 'v4';

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
            self::categorias($db);
            @file_put_contents($flag, date('c'));
        } catch (Throwable $e) {
            error_log('[GuajiraBags] Migración: ' . $e->getMessage());
        }
    }

    /** Categorías del catálogo: tabla, columnas en productos y categorías iniciales (solo la primera vez). */
    private static function categorias(PDO $db): void
    {
        $db->exec("CREATE TABLE IF NOT EXISTS categorias (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(80) NOT NULL,
            slug VARCHAR(90) NOT NULL,
            descripcion VARCHAR(255) NULL,
            tallas VARCHAR(255) NULL,
            orden INT NOT NULL DEFAULT 0,
            activo TINYINT(1) NOT NULL DEFAULT 1,
            creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uq_categorias_slug (slug)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        if (!self::hasColumn($db, 'productos', 'categoria_id')) {
            $db->exec('ALTER TABLE productos ADD COLUMN categoria_id INT NULL AFTER codigo');
        }
        if (!self::hasColumn($db, 'productos', 'talla')) {
            $db->exec('ALTER TABLE productos ADD COLUMN talla VARCHAR(30) NULL AFTER categoria_id');
        }
        self::index($db, 'productos', 'idx_productos_categoria', '(activo, categoria_id, talla)');

        if ((int) $db->query('SELECT COUNT(*) FROM categorias')->fetchColumn() > 0) {
            return; // ya hay categorías: no tocar nada
        }
        // Categorías que pidió la administradora
        $iniciales = [
            ['Mochilas recamadas', 'recamadas', 'Mini,Mediana,Grande'],
            ['Mochilas doble uso', 'doble-uso', 'Mini,Mediana'],
            ['Mochilas primavera', 'primavera', 'Mini,Mediana'],
            ['Mochilas tradicionales', 'tradicionales', 'Mini,Mediana,Grande'],
            ['Mochilones Wayuu', 'mochilones', 'Mini,Mediana,Grande'],
            ['Sobres Wayuu', 'sobres', null],
            ['Bolsos exclusivos', 'exclusivos', null],
        ];
        $ins = $db->prepare('INSERT INTO categorias (nombre, slug, tallas, orden) VALUES (?, ?, ?, ?)');
        foreach ($iniciales as $i => [$n, $slug, $tallas]) {
            $ins->execute([$n, $slug, $tallas, $i + 1]);
        }
        // Organizar las mochilas que ya existían (solo si el id y el nombre coinciden, y aún no tienen categoría)
        $asignar = [
            [10, 'Mochila VICTORIA', 'recamadas', 'Mini'], [14, 'Mochila perla Rose', 'recamadas', 'Mini'],
            [15, 'Mochila Mini Golden Khaki', 'recamadas', 'Mini'], [22, 'Mochila mini perla', 'recamadas', 'Mini'],
            [31, 'Aurelia Bleu', 'recamadas', 'Mini'], [32, 'Mochila', 'recamadas', 'Mini'],
            [13, 'Mochila VALERIA', 'recamadas', 'Mediana'], [35, 'Aurora boreal', 'recamadas', 'Mediana'],
            [36, 'Mochila Katia', 'recamadas', 'Mediana'], [38, 'Mochila Rose perlas mediana', 'recamadas', 'Mediana'],
            [30, 'Mochila Amélie doble uso', 'doble-uso', 'Mini'], [34, 'Mochila doble uso', 'doble-uso', 'Mediana'],
            [16, 'Mochila Mini Éclat Floral', 'primavera', 'Mini'], [23, 'Mochila mini Floré', 'primavera', 'Mini'],
            [24, 'Mochila Mini Floré Soleil', 'primavera', 'Mini'], [28, 'Mochila Jardín imperial', 'primavera', 'Mediana'],
            [29, 'Mochila Noir Nude', 'primavera', 'Mediana'],
            [4, 'Mochila Wayuu', 'tradicionales', 'Mini'], [5, 'Mochila Wayuu mini contemporánea', 'tradicionales', 'Mini'],
            [37, 'Tradición Wayuu', 'tradicionales', 'Mediana'], [17, 'Mochila wayuu tradicional', 'tradicionales', 'Grande'],
            [18, 'Mochila Isabella', 'exclusivos', null], [19, 'Mochila Alessia', 'exclusivos', null], [20, 'Mochila Siena', 'exclusivos', null],
        ];
        $upd = $db->prepare(
            "UPDATE productos SET categoria_id = (SELECT id FROM categorias WHERE slug = ?), talla = ?
             WHERE id = ? AND categoria_id IS NULL
               AND LOWER(REPLACE(nombre, ' ', '')) = LOWER(REPLACE(?, ' ', ''))"
        );
        foreach ($asignar as [$id, $nombre, $slug, $talla]) {
            $upd->execute([$slug, $talla, $id, $nombre]);
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
