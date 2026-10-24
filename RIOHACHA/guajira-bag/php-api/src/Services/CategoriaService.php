<?php

namespace GuajiraBags\Services;

use PDO;

/**
 * Categorías del catálogo (Mochilas recamadas, Doble uso, Primavera…). Cada una puede tener tallas
 * (Mini, Mediana, Grande) que se eligen al crear o editar un producto.
 */
class CategoriaService
{
    public function __construct(private PDO $db) {}

    /** Lista con cantidad de productos. $publico: solo categorías activas y conteo de productos activos. */
    public function listar(bool $publico): array
    {
        $cond = $publico ? 'p.activo = 1' : '1 = 1';
        $rows = $this->db->query(
            "SELECT c.*, COUNT(p.id) AS total, MIN(p.precio) AS pmin, MAX(p.precio) AS pmax
             FROM categorias c LEFT JOIN productos p ON p.categoria_id = c.id AND $cond
             " . ($publico ? 'WHERE c.activo = 1' : '') . '
             GROUP BY c.id ORDER BY c.orden ASC, c.nombre ASC'
        )->fetchAll();

        // Conteo por talla (para mostrar "Mini (4) · Mediana (3)")
        $porTalla = [];
        foreach ($this->db->query("SELECT categoria_id, talla, COUNT(*) n FROM productos p WHERE $cond AND categoria_id IS NOT NULL AND talla IS NOT NULL GROUP BY categoria_id, talla")->fetchAll() as $r) {
            $porTalla[(int) $r['categoria_id']][$r['talla']] = (int) $r['n'];
        }
        $sin = (int) $this->db->query("SELECT COUNT(*) FROM productos p WHERE $cond AND (categoria_id IS NULL OR categoria_id NOT IN (SELECT id FROM categorias" . ($publico ? ' WHERE activo = 1' : '') . '))')->fetchColumn();
        $precios = $this->db->query("SELECT MIN(precio), MAX(precio) FROM productos p WHERE $cond")->fetch(PDO::FETCH_NUM);

        return [
            'categorias'   => array_map(fn($r) => $this->toResponse($r, $porTalla[(int) $r['id']] ?? []), $rows),
            'sinCategoria' => $sin,
            'precioMin'    => $precios[0] !== null ? (float) $precios[0] : 0,
            'precioMax'    => $precios[1] !== null ? (float) $precios[1] : 0,
        ];
    }

    public function obtener(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT c.*, (SELECT COUNT(*) FROM productos WHERE categoria_id = c.id) AS total FROM categorias c WHERE c.id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? $this->toResponse($row, []) : null;
    }

    /** Busca por id o por slug. */
    public function buscar(string $idOSlug): ?array
    {
        $stmt = ctype_digit($idOSlug)
            ? $this->db->prepare('SELECT * FROM categorias WHERE id = ?')
            : $this->db->prepare('SELECT * FROM categorias WHERE slug = ?');
        $stmt->execute([$idOSlug]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    /** @return array{0: bool, 1: string, 2: ?array} */
    public function crear(array $req): array
    {
        $nombre = $this->texto($req['nombre'] ?? '', 80);
        if (mb_strlen($nombre) < 2) {
            return [false, 'Escribe el nombre de la categoría.', null];
        }
        $slug = $this->slugUnico($nombre);
        $orden = (int) $this->db->query('SELECT COALESCE(MAX(orden), 0) + 1 FROM categorias')->fetchColumn();
        $this->db->prepare('INSERT INTO categorias (nombre, slug, descripcion, tallas, orden, activo) VALUES (?, ?, ?, ?, ?, 1)')
            ->execute([$nombre, $slug, $this->texto($req['descripcion'] ?? '', 255) ?: null, $this->tallas($req['tallas'] ?? []), $orden]);
        return [true, '', $this->obtener((int) $this->db->lastInsertId())];
    }

    /** @return array{0: bool, 1: string, 2: ?array} */
    public function actualizar(int $id, array $req): array
    {
        if (!$this->obtener($id)) {
            return [false, 'Categoría no encontrada.', null];
        }
        $campos = [];
        $args = [];
        if (array_key_exists('nombre', $req)) {
            $nombre = $this->texto($req['nombre'], 80);
            if (mb_strlen($nombre) < 2) {
                return [false, 'Escribe el nombre de la categoría.', null];
            }
            $campos[] = 'nombre = ?';
            $args[] = $nombre;
            $campos[] = 'slug = ?';
            $args[] = $this->slugUnico($nombre, $id);
        }
        if (array_key_exists('descripcion', $req)) {
            $campos[] = 'descripcion = ?';
            $args[] = $this->texto($req['descripcion'], 255) ?: null;
        }
        if (array_key_exists('tallas', $req)) {
            $tallas = $this->tallas($req['tallas']);
            $campos[] = 'tallas = ?';
            $args[] = $tallas;
            // Si una talla deja de existir, los productos con esa talla quedan "sin talla"
            $lista = $tallas ? explode(',', $tallas) : [];
            if ($lista) {
                $in = implode(',', array_fill(0, count($lista), '?'));
                $this->db->prepare("UPDATE productos SET talla = NULL WHERE categoria_id = ? AND talla IS NOT NULL AND talla NOT IN ($in)")->execute([$id, ...$lista]);
            } else {
                $this->db->prepare('UPDATE productos SET talla = NULL WHERE categoria_id = ?')->execute([$id]);
            }
        }
        if (array_key_exists('orden', $req)) {
            $campos[] = 'orden = ?';
            $args[] = (int) $req['orden'];
        }
        if (array_key_exists('activo', $req)) {
            $campos[] = 'activo = ?';
            $args[] = filter_var($req['activo'], FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
        }
        if ($campos) {
            $args[] = $id;
            $this->db->prepare('UPDATE categorias SET ' . implode(', ', $campos) . ' WHERE id = ?')->execute($args);
        }
        return [true, '', $this->obtener($id)];
    }

    /** Cambia el orden de todas las categorías de una vez: [id, id, id…] */
    public function reordenar(array $ids): void
    {
        $stmt = $this->db->prepare('UPDATE categorias SET orden = ? WHERE id = ?');
        foreach (array_values($ids) as $i => $id) {
            $stmt->execute([$i + 1, (int) $id]);
        }
    }

    /** Elimina la categoría. Sus productos NO se borran: quedan "sin categoría". */
    public function eliminar(int $id): bool
    {
        if (!$this->obtener($id)) {
            return false;
        }
        $this->db->prepare('UPDATE productos SET categoria_id = NULL, talla = NULL WHERE categoria_id = ?')->execute([$id]);
        $this->db->prepare('DELETE FROM categorias WHERE id = ?')->execute([$id]);
        return true;
    }

    /** Valida categoría y talla de un producto. @return array{0: ?int, 1: ?string} */
    public function validarAsignacion(mixed $categoriaId, mixed $talla): array
    {
        $cid = (int) $categoriaId;
        if ($cid <= 0) {
            return [null, null];
        }
        $stmt = $this->db->prepare('SELECT tallas FROM categorias WHERE id = ?');
        $stmt->execute([$cid]);
        $tallas = $stmt->fetchColumn();
        if ($tallas === false) {
            return [null, null];
        }
        $lista = $tallas ? explode(',', $tallas) : [];
        $talla = trim((string) $talla);
        return [$cid, in_array($talla, $lista, true) ? $talla : null];
    }

    private function toResponse(array $r, array $porTalla): array
    {
        $tallas = $r['tallas'] ? explode(',', $r['tallas']) : [];
        return [
            'id'          => (int) $r['id'],
            'nombre'      => $r['nombre'],
            'slug'        => $r['slug'],
            'descripcion' => $r['descripcion'] ?? null,
            'tallas'      => $tallas,
            'porTalla'    => (object) $porTalla,
            'orden'       => (int) $r['orden'],
            'activo'      => (bool) (int) $r['activo'],
            'total'       => (int) ($r['total'] ?? 0),
            'precioMin'   => isset($r['pmin']) && $r['pmin'] !== null ? (float) $r['pmin'] : null,
            'precioMax'   => isset($r['pmax']) && $r['pmax'] !== null ? (float) $r['pmax'] : null,
        ];
    }

    private function tallas(mixed $v): ?string
    {
        $lista = is_array($v) ? $v : explode(',', (string) $v);
        $limpias = [];
        foreach ($lista as $t) {
            $t = str_replace(',', ' ', $this->texto($t, 30));
            if ($t !== '' && !in_array(mb_strtolower($t), array_map('mb_strtolower', $limpias), true)) {
                $limpias[] = mb_strtoupper(mb_substr($t, 0, 1)) . mb_substr($t, 1);
            }
        }
        return $limpias ? implode(',', array_slice($limpias, 0, 8)) : null;
    }

    private function texto(mixed $v, int $max): string
    {
        $v = trim(preg_replace('/\s+/u', ' ', strip_tags((string) $v)));
        return mb_substr($v, 0, $max);
    }

    private function slugUnico(string $nombre, ?int $exceptoId = null): string
    {
        $base = strtolower(trim(preg_replace('/[^a-z0-9]+/i', '-', iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $nombre) ?: $nombre), '-')) ?: 'categoria';
        $slug = $base;
        for ($i = 2; ; $i++) {
            $stmt = $this->db->prepare('SELECT id FROM categorias WHERE slug = ?' . ($exceptoId ? ' AND id <> ?' : ''));
            $stmt->execute($exceptoId ? [$slug, $exceptoId] : [$slug]);
            if (!$stmt->fetch()) {
                return $slug;
            }
            $slug = "$base-$i";
        }
    }
}
