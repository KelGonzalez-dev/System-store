<?php

namespace GuajiraBags\Services;

/**
 * Optimización de imágenes con GD (viene en casi todos los hostings).
 *
 * - optimizeUpload(): la foto subida se guarda intacta (máxima calidad); solo las enormes se reducen a 3000 px.
 * - thumbnail(): genera versiones pequeñas bajo demanda (/img/400/uploads/...) y las guarda en caché
 *   en public/img/. La siguiente visita la sirve Apache directamente, sin pasar por PHP.
 */
class ImageService
{
    public const WIDTHS = [160, 320, 480, 640, 960, 1280];
    private const MAX_SIDE = 3000;

    public function __construct(private string $publicDir) {}

    public static function available(): bool
    {
        return extension_loaded('gd') && function_exists('imagecreatefromstring');
    }

    public static function webp(): bool
    {
        return function_exists('imagewebp') && (gd_info()['WebP Support'] ?? false);
    }

    /**
     * Foto recién subida: se guarda TAL CUAL (sin volver a comprimir) para no perder calidad.
     * Solo si es enorme (más de 3000 px o más de 8 MB) se reduce a 3000 px con calidad 92.
     * Devuelve la nueva extensión si la reescribió, o null si la dejó intacta.
     */
    public function optimizeUpload(string $path): ?string
    {
        $info = @getimagesize($path);
        if (!$info) {
            return null;
        }
        [$w, $h] = $info;
        if (max($w, $h) <= self::MAX_SIDE && filesize($path) <= 8 * 1024 * 1024) {
            return null; // original intacto: máxima calidad
        }
        if (!self::available()) {
            return null;
        }
        @ini_set('memory_limit', '384M');
        $img = $this->load($path);
        if (!$img) {
            return null;
        }
        $img = $this->fit($img, self::MAX_SIDE);
        $ext = self::webp() ? 'webp' : 'jpg';
        $ok = $this->save($img, $path . '.tmp', $ext, 92);
        imagedestroy($img);
        if (!$ok) {
            @unlink($path . '.tmp');
            return null;
        }
        rename($path . '.tmp', $path);
        return $ext;
    }

    /**
     * Miniatura en caché. $relative = "uploads/productos/abc.jpg".
     * @return array{0: string, 1: string}|null [ruta del archivo, content-type]
     */
    public function thumbnail(string $relative, int $width): ?array
    {
        $relative = ltrim(str_replace('\\', '/', $relative), '/');
        if (!preg_match('#^uploads/(productos|galeria)/[A-Za-z0-9._-]+\.(jpe?g|png|webp|gif)$#i', $relative)) {
            return null;
        }
        $width = $this->nearest($width);
        $source = $this->publicDir . '/' . $relative;
        if (!is_file($source)) {
            return null;
        }
        $ext = self::webp() ? 'webp' : 'jpg';
        $cache = $this->publicDir . "/img/$width/$relative.$ext";
        $type = $ext === 'webp' ? 'image/webp' : 'image/jpeg';
        if (is_file($cache) && filemtime($cache) >= filemtime($source)) {
            return [$cache, $type];
        }
        if (!self::available()) {
            return [$source, mime_content_type($source) ?: 'image/jpeg'];
        }
        @ini_set('memory_limit', '256M');
        $img = $this->load($source);
        if (!$img) {
            return [$source, mime_content_type($source) ?: 'image/jpeg'];
        }
        $img = $this->fit($img, $width, true);
        $this->sharpen($img);
        if (!is_dir(dirname($cache))) {
            @mkdir(dirname($cache), 0755, true);
        }
        $ok = $this->save($img, $cache . '.tmp', $ext, 90);
        imagedestroy($img);
        if ($ok && @rename($cache . '.tmp', $cache)) {
            return [$cache, $type];
        }
        @unlink($cache . '.tmp');
        return [$source, mime_content_type($source) ?: 'image/jpeg'];
    }

    /** Borra todas las miniaturas de una foto (al eliminarla o reemplazarla). */
    public function purge(string $relative): void
    {
        $relative = ltrim($relative, '/');
        foreach (self::WIDTHS as $w) {
            foreach (['webp', 'jpg'] as $e) {
                @unlink($this->publicDir . "/img/$w/$relative.$e");
            }
        }
    }

    private function nearest(int $w): int
    {
        foreach (self::WIDTHS as $s) {
            if ($w <= $s) {
                return $s;
            }
        }
        return end(self::WIDTHS);
    }

    private function load(string $path): \GdImage|false
    {
        $data = @file_get_contents($path);
        if ($data === false) {
            return false;
        }
        $img = @imagecreatefromstring($data);
        if (!$img) {
            return false;
        }
        // Enderezar fotos de celular según EXIF
        if (function_exists('exif_read_data') && preg_match('/\.jpe?g$/i', $path)) {
            $o = (int) (@exif_read_data($path)['Orientation'] ?? 1);
            $img = match ($o) {
                3 => imagerotate($img, 180, 0),
                6 => imagerotate($img, -90, 0),
                8 => imagerotate($img, 90, 0),
                default => $img,
            };
        }
        if (!imageistruecolor($img)) {
            imagepalettetotruecolor($img);
        }
        return $img;
    }

    /** Reduce (nunca agranda). $byWidth: limita solo el ancho; si no, el lado mayor. */
    private function fit(\GdImage $img, int $max, bool $byWidth = false): \GdImage
    {
        $w = imagesx($img);
        $h = imagesy($img);
        $scale = $byWidth ? $max / $w : $max / max($w, $h);
        if ($scale >= 1) {
            return $img;
        }
        $nw = max(1, (int) round($w * $scale));
        $nh = max(1, (int) round($h * $scale));
        $out = imagecreatetruecolor($nw, $nh);
        imagealphablending($out, false);
        imagesavealpha($out, true);
        imagecopyresampled($out, $img, 0, 0, 0, 0, $nw, $nh, $w, $h);
        imagedestroy($img);
        return $out;
    }

    /** Enfoque suave después de reducir (las fotos reducidas suelen verse un poco "blandas"). */
    private function sharpen(\GdImage $img): void
    {
        if (function_exists('imageconvolution')) {
            @imageconvolution($img, [[-1, -1, -1], [-1, 20, -1], [-1, -1, -1]], 12, 0);
        }
    }

    private function save(\GdImage $img, string $path, string $ext, int $q): bool
    {
        if ($ext === 'webp') {
            return @imagewebp($img, $path, $q);
        }
        // JPEG: fondo blanco para transparencias
        $w = imagesx($img);
        $h = imagesy($img);
        $bg = imagecreatetruecolor($w, $h);
        imagefill($bg, 0, 0, imagecolorallocate($bg, 255, 255, 255));
        imagecopy($bg, $img, 0, 0, 0, 0, $w, $h);
        imageinterlace($bg, true);
        $ok = @imagejpeg($bg, $path, $q + 4);
        imagedestroy($bg);
        return $ok;
    }
}
