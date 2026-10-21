<?php

namespace GuajiraBags\Services;

/** Guarda las fotos subidas ya optimizadas (ver ImageService) y borra las que se reemplazan. */
class FileStorageService
{
    private string $uploadFolder;
    private int $maxBytes;
    private array $allowedExt;

    public function __construct(array $config, private ImageService $images)
    {
        $this->uploadFolder = rtrim($config['uploads']['folder'], '/\\');
        $this->maxBytes     = (int) (($config['uploads']['max_size_mb'] ?? 12) * 1024 * 1024);
        $this->allowedExt   = $config['uploads']['allowed_ext'] ?? ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    }

    /** @return array{0: bool, 1: string, 2: string} */
    public function save(array $file, string $subfolder): array
    {
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            return [false, 'El archivo está vacío o hubo un error al subirlo', ''];
        }
        if (($file['size'] ?? 0) === 0) {
            return [false, 'El archivo está vacío', ''];
        }
        if ($file['size'] > $this->maxBytes) {
            return [false, 'El archivo supera el máximo permitido (' . round($this->maxBytes / 1048576) . ' MB)', ''];
        }
        $ext = strtolower(pathinfo($file['name'] ?? '', PATHINFO_EXTENSION));
        if (!in_array($ext, $this->allowedExt, true)) {
            return [false, 'Extensión no permitida. Use: ' . implode(', ', array_map(fn($e) => ".$e", $this->allowedExt)), ''];
        }
        // Verificar que de verdad sea una imagen
        if (@getimagesize($file['tmp_name']) === false) {
            return [false, 'El archivo no es una imagen válida', ''];
        }

        $dest = $this->uploadFolder . DIRECTORY_SEPARATOR . $subfolder;
        if (!is_dir($dest)) {
            mkdir($dest, 0755, true);
        }
        $name = bin2hex(random_bytes(16));
        $tmpPath = $dest . DIRECTORY_SEPARATOR . $name . '.upload';
        $moved = is_uploaded_file($file['tmp_name']) ? move_uploaded_file($file['tmp_name'], $tmpPath) : @rename($file['tmp_name'], $tmpPath);
        if (!$moved) {
            return [false, 'No se pudo guardar el archivo', ''];
        }

        // Optimizar (WebP/JPEG, máx. 1800 px). Si GD no está disponible se guarda tal cual.
        $finalExt = $this->images->optimizeUpload($tmpPath) ?? ($ext === 'jpeg' ? 'jpg' : $ext);
        $fileName = "$name.$finalExt";
        rename($tmpPath, $dest . DIRECTORY_SEPARATOR . $fileName);
        @chmod($dest . DIRECTORY_SEPARATOR . $fileName, 0644);

        return [true, '', "/uploads/$subfolder/$fileName"];
    }

    public function delete(?string $relativeUrl): void
    {
        if (!$relativeUrl) {
            return;
        }
        $relative = ltrim($relativeUrl, '/');
        if (!str_starts_with($relative, 'uploads/') || str_contains($relative, '..')) {
            return;
        }
        $full = dirname($this->uploadFolder) . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relative);
        if (is_file($full)) {
            @unlink($full);
        }
        $this->images->purge($relative);
    }
}
