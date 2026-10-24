<?php

namespace GuajiraBags\Controllers;

use PDO;

/**
 * GET /sitemap.xml — sitemap SIEMPRE actualizado para Google (lo genera la API en el momento),
 * con todas las categorías, todas las mochilas y sus fotos (sitemap de imágenes).
 * Se anuncia en el robots.txt de la tienda.
 */
class SitemapController
{
    public function __construct(private PDO $db, private string $sitio, private string $api) {}

    public function servir(): void
    {
        $urls = [
            ['/', '1.0', 'daily', [], null],
            ['/catalogo', '0.9', 'daily', [], null],
            ['/galeria', '0.6', 'weekly', [], null],
            ['/contacto', '0.5', 'monthly', [], null],
        ];
        $hayCategorias = (int) $this->db->query("SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'categorias'")->fetchColumn() > 0;
        if ($hayCategorias) {
            foreach ($this->db->query('SELECT c.slug FROM categorias c WHERE c.activo = 1 AND EXISTS (SELECT 1 FROM productos p WHERE p.categoria_id = c.id AND p.activo = 1) ORDER BY c.orden')->fetchAll() as $c) {
                $urls[] = ['/catalogo/' . $c['slug'], '0.8', 'weekly', [], null];
            }
        }
        $fotos = [];
        foreach ($this->db->query('SELECT producto_id, url FROM producto_imagenes ORDER BY producto_id, orden, id')->fetchAll() as $f) {
            $fotos[(int) $f['producto_id']][] = $f['url'];
        }
        foreach ($this->db->query('SELECT id, nombre, imagen_url, creado_en, actualizado_en FROM productos WHERE activo = 1 ORDER BY id')->fetchAll() as $p) {
            $imgs = array_values(array_filter([$p['imagen_url'], ...($fotos[(int) $p['id']] ?? [])]));
            $fecha = $p['actualizado_en'] ?? $p['creado_en'];
            $urls[] = ['/mochila/' . $p['id'] . '-' . $this->slug($p['nombre']), '0.7', 'weekly', $imgs, $fecha ? substr($fecha, 0, 10) : null];
        }
        $galeria = array_column($this->db->query('SELECT url FROM galeria WHERE activo = 1 ORDER BY orden')->fetchAll(), 'url');
        $urls[2][3] = $galeria;

        $x = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:image=\"http://www.google.com/schemas/sitemap-image/1.1\">\n";
        foreach ($urls as [$ruta, $prioridad, $freq, $imgs, $fecha]) {
            $x .= "  <url>\n    <loc>" . $this->e($this->sitio . $ruta) . "</loc>\n";
            if ($fecha) {
                $x .= "    <lastmod>$fecha</lastmod>\n";
            }
            $x .= "    <changefreq>$freq</changefreq>\n    <priority>$prioridad</priority>\n";
            foreach (array_slice($imgs, 0, 20) as $img) {
                $src = preg_match('#^https?://#', $img) ? $img : $this->api . '/' . ltrim($img, '/');
                $x .= '    <image:image><image:loc>' . $this->e($src) . "</image:loc></image:image>\n";
            }
            $x .= "  </url>\n";
        }
        $x .= "</urlset>\n";

        header('Content-Type: application/xml; charset=utf-8');
        header('Cache-Control: public, max-age=3600');
        echo $x;
        exit;
    }

    private function slug(string $s): string
    {
        // Igual que la tienda: quitar tildes (á→a, ñ→n…) sin depender de la configuración del servidor
        $s = strtr($s, ['á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', 'ü' => 'u', 'ñ' => 'n', 'Á' => 'a', 'É' => 'e', 'Í' => 'i', 'Ó' => 'o', 'Ú' => 'u', 'Ü' => 'u', 'Ñ' => 'n', 'à' => 'a', 'è' => 'e', 'ì' => 'i', 'ò' => 'o', 'ù' => 'u', 'â' => 'a', 'ê' => 'e', 'î' => 'i', 'ô' => 'o', 'û' => 'u', 'ç' => 'c', 'Ç' => 'c']);
        $s = trim(preg_replace('/[^a-z0-9]+/', '-', strtolower($s)), '-');
        return substr($s, 0, 70) ?: 'mochila';
    }

    private function e(string $s): string
    {
        return htmlspecialchars($s, ENT_XML1 | ENT_QUOTES, 'UTF-8');
    }
}
