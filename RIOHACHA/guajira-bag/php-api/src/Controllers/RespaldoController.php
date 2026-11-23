<?php

namespace GuajiraBags\Controllers;

use GuajiraBags\Helpers\Response;
use GuajiraBags\Services\FileStorageService;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use ZipArchive;

/** GET /api/respaldo/fotos — descarga un .zip con todas las fotos (para guardar una copia en el computador). */
class RespaldoController
{
    public function __construct(private FileStorageService $storage) {}

    public function fotos(): void
    {
        if (!class_exists(ZipArchive::class)) {
            Response::error('El servidor no tiene la extensión ZIP de PHP. Pide al hosting que la active.', 501);
        }
        @set_time_limit(300);
        [$publica, $respaldo] = $this->storage->carpetas();
        $tmp = tempnam(sys_get_temp_dir(), 'gbfotos');
        $zip = new ZipArchive();
        if ($zip->open($tmp, ZipArchive::OVERWRITE) !== true) {
            Response::error('No se pudo crear el archivo de respaldo.', 500);
        }
        $agregadas = [];
        // Primero las fotos públicas; luego las del respaldo que falten en public
        foreach ([$publica, $respaldo] as $base) {
            if (!$base || !is_dir($base)) {
                continue;
            }
            $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($base, RecursiveDirectoryIterator::SKIP_DOTS));
            foreach ($it as $f) {
                if (!$f->isFile() || !preg_match('/\.(jpe?g|png|webp|gif)$/i', $f->getFilename())) {
                    continue;
                }
                $rel = 'uploads/' . str_replace('\\', '/', substr($f->getPathname(), strlen($base) + 1));
                if (isset($agregadas[$rel])) {
                    continue;
                }
                $zip->addFile($f->getPathname(), $rel);
                $agregadas[$rel] = true;
            }
        }
        $zip->close();
        if (!$agregadas) {
            @unlink($tmp);
            Response::error('No hay fotos para respaldar.', 404);
        }
        header('Content-Type: application/zip');
        header('Content-Disposition: attachment; filename="guajira-bags-fotos-' . date('Y-m-d') . '.zip"');
        header('Content-Length: ' . filesize($tmp));
        header('Cache-Control: no-store');
        readfile($tmp);
        @unlink($tmp);
        exit;
    }
}
