<?php
/**
 * OPCIONAL — Genera de una vez las miniaturas de TODAS las fotos ya subidas
 * (si no lo ejecutas, se generan solas la primera vez que alguien las ve).
 *
 *   php scripts/optimizar-fotos.php
 */
require __DIR__ . '/../src/bootstrap.php';

$images = new GuajiraBags\Services\ImageService(__DIR__ . '/../public');
$n = 0;
foreach (['productos', 'galeria'] as $dir) {
    foreach (glob(__DIR__ . "/../public/uploads/$dir/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG}", GLOB_BRACE) as $file) {
        foreach ([320, 640, 960] as $w) {
            $images->thumbnail("uploads/$dir/" . basename($file), $w);
        }
        $n++;
        echo "✓ $dir/" . basename($file) . "\n";
    }
}
echo "Listo: $n fotos con sus miniaturas.\n";
