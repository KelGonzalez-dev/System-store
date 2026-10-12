<?php

namespace GuajiraBags\Services;

class FileStorageService
{
    private string $uploadFolder;
    private int $maxBytes;
    private array $allowedExt;

    public function __construct(array $config)
    {
        $this->uploadFolder = rtrim($config['uploads']['folder'], '/\\');
        $this->maxBytes     = (int) ($config['uploads']['max_size_mb'] * 1024 * 1024);
        $this->allowedExt   = $config['uploads']['allowed_ext'];

        foreach (['productos', 'galeria'] as $sub) {
            $dir = $this->uploadFolder . DIRECTORY_SEPARATOR . $sub;
            if (!is_dir($dir)) {
                mkdir($dir, 0755, true);
            }
        }
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
            $mb = $this->maxBytes / 1024 / 1024;
            return [false, "El archivo supera el máximo permitido ({$mb} MB)", ''];
        }

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, $this->allowedExt, true)) {
            $list = implode(', ', array_map(fn($e) => ".$e", $this->allowedExt));
            return [false, "Extensión no permitida. Use: $list", ''];
        }

        $destFolder = $this->uploadFolder . DIRECTORY_SEPARATOR . $subfolder;
        if (!is_dir($destFolder)) {
            mkdir($destFolder, 0755, true);
        }

        $fileName = bin2hex(random_bytes(16)) . '.' . $ext;
        $fullPath = $destFolder . DIRECTORY_SEPARATOR . $fileName;

        // move_uploaded_file() solo funciona con archivos subidos "de verdad"
        // por el SAPI de PHP (is_uploaded_file() debe ser true). Los PUT con
        // multipart/form-data se parsean a mano (ver MultipartParser) y el
        // archivo temporal resultante NO cuenta como "uploaded" para PHP,
        // así que en ese caso hay que usar rename() en su lugar.
        if (is_uploaded_file($file['tmp_name'])) {
            $moved = move_uploaded_file($file['tmp_name'], $fullPath);
        } else {
            $moved = rename($file['tmp_name'], $fullPath);
        }

        if (!$moved) {
            return [false, 'No se pudo guardar el archivo', ''];
        }

        return [true, '', "/uploads/$subfolder/$fileName"];
    }

    public function delete(?string $relativeUrl): void
    {
        if (!$relativeUrl) {
            return;
        }

        $relative = ltrim($relativeUrl, '/');
        if (!str_starts_with($relative, 'uploads/')) {
            return;
        }

        $fullPath = dirname($this->uploadFolder) . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relative);
        if (is_file($fullPath)) {
            unlink($fullPath);
        }
    }
}