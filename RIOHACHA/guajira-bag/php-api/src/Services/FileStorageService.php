<?php

namespace GuajiraBags\Services;

/**
 * Fotos de productos y galería.
 *
 * - Se guardan en public/uploads/ (la carpeta que el servidor muestra en internet).
 * - Cada foto tiene además una COPIA DE RESPALDO en storage/fotos/ (fuera de internet).
 *   Si algún día una foto desaparece de public/uploads/ (por ejemplo al reemplazar carpetas al
 *   actualizar), la API la RESTAURA SOLA desde el respaldo la próxima vez que alguien la pida.
 * - Las fotos que ya existían se respaldan solas la primera vez que la tienda las muestra.
 */
class FileStorageService
{
    private string $uploadFolder;
    private ?string $backupFolder;
    private int $maxBytes;
    private array $allowedExt;

    public function __construct(array $config, private ImageService $images, ?string $backupFolder = null)
    {
        // La carpeta real de fotos es siempre public/uploads (junto a index.php). La de config.php solo
        // se usa si esa no existe, para que una configuración vieja nunca deje las fotos en otro lugar.
        $publica = $images->publicDir() . DIRECTORY_SEPARATOR . 'uploads';
        $this->uploadFolder = is_dir($publica) || !isset($config['uploads']['folder'])
            ? $publica
            : rtrim($config['uploads']['folder'], '/\\');
        if (!is_dir($this->uploadFolder)) {
            @mkdir($this->uploadFolder, 0755, true);
        }
        $this->backupFolder = $backupFolder ? rtrim($backupFolder, '/\\') : null;
        // Mínimo 20 MB aunque config.php diga menos (las fotos de celular pesan bastante)
        $this->maxBytes     = (int) (max(20, (float) ($config['uploads']['max_size_mb'] ?? 20)) * 1024 * 1024);
        $this->allowedExt   = array_values(array_unique(array_merge(['jpg', 'jpeg', 'png', 'webp', 'gif'], $config['uploads']['allowed_ext'] ?? [])));
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
        if (in_array($ext, ['heic', 'heif'], true)) {
            return [false, 'Las fotos en formato HEIC del iPhone no se pueden publicar en la web. Envíala como JPG (en el iPhone: Ajustes › Cámara › Formatos › "Más compatible"), o ábrela y guárdala/compártela como JPG.', ''];
        }
        if (!in_array($ext, $this->allowedExt, true)) {
            return [false, 'Extensión no permitida. Use: ' . implode(', ', array_map(fn($e) => ".$e", $this->allowedExt)), ''];
        }
        // Verificar que de verdad sea una imagen
        if (@getimagesize($file['tmp_name']) === false) {
            return [false, 'El archivo no es una imagen válida', ''];
        }

        $dest = $this->uploadFolder . DIRECTORY_SEPARATOR . $subfolder;
        if (!is_dir($dest)) {
            @mkdir($dest, 0755, true);
        }
        if (!is_dir($dest) || !is_writable($dest)) {
            error_log("[GuajiraBags] Sin permiso para escribir en $dest");
            return [false, "El servidor no deja guardar fotos en la carpeta public/uploads/$subfolder. En el Administrador de archivos crea esa carpeta (si no existe) y dale permisos 755.", ''];
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
        $this->respaldar("uploads/$subfolder/$fileName");

        return [true, '', "/uploads/$subfolder/$fileName"];
    }

    /** ¿Existe de verdad el archivo de esta foto en el servidor? */
    public function exists(?string $relativeUrl): bool
    {
        if (!$relativeUrl) {
            return false;
        }
        if (preg_match('#^https?://#', $relativeUrl)) {
            return true; // foto externa: no se puede comprobar aquí
        }
        $relative = ltrim($relativeUrl, '/');
        if (!str_starts_with($relative, 'uploads/') || str_contains($relative, '..')) {
            return false;
        }
        $full = $this->ruta($relative);
        if (is_file($full)) {
            $this->respaldar($relative); // respalda las fotos antiguas la primera vez que se ven
            return true;
        }
        return $this->restaurar($relative); // si falta, intenta traerla del respaldo
    }

    /** Ruta completa en public/ de "uploads/productos/x.jpg". */
    private function ruta(string $relative): string
    {
        return dirname($this->uploadFolder) . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relative);
    }

    private function rutaRespaldo(string $relative): ?string
    {
        if (!$this->backupFolder) {
            return null;
        }
        return $this->backupFolder . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, substr($relative, strlen('uploads/')));
    }

    /** Copia la foto al respaldo (solo si aún no está). */
    private function respaldar(string $relative): void
    {
        $dst = $this->rutaRespaldo($relative);
        if (!$dst || is_file($dst)) {
            return;
        }
        if (!is_dir(dirname($dst))) {
            @mkdir(dirname($dst), 0755, true);
        }
        @copy($this->ruta($relative), $dst);
    }

    /** Devuelve la foto a public/uploads desde el respaldo. */
    private function restaurar(string $relative): bool
    {
        $src = $this->rutaRespaldo($relative);
        if (!$src || !is_file($src)) {
            return false;
        }
        $dst = $this->ruta($relative);
        if (!is_dir(dirname($dst))) {
            @mkdir(dirname($dst), 0755, true);
        }
        return @copy($src, $dst) && is_file($dst);
    }

    /** Carpeta de fotos y de respaldo (para descargar la copia desde el panel). */
    public function carpetas(): array
    {
        return [$this->uploadFolder, $this->backupFolder];
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
        $full = $this->ruta($relative);
        if (is_file($full)) {
            @unlink($full);
        }
        $bk = $this->rutaRespaldo($relative);
        if ($bk && is_file($bk)) {
            @unlink($bk); // se borró a propósito desde el panel: también sale del respaldo
        }
        $this->images->purge($relative);
    }
}
