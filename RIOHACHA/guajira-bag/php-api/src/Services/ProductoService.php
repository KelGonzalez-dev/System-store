<?php

namespace GuajiraBags\Services;

use GuajiraBags\Helpers\Response;
use GuajiraBags\Schema;
use PDO;

class ProductoService
{
    private ?bool $conCodigo = null;
    private ?bool $conCategoria = null;

    public function __construct(private PDO $db, private FileStorageService $storage) {}

    /**
     * Lista paginada con búsqueda y orden en el servidor.
     * Las fotos de TODOS los productos de la página se traen en una sola consulta (antes era una por producto).
     */
    public function listar(int $pagina, int $porPagina, bool $soloActivos, array $f = []): array
    {
        $where = [];
        $args = [];
        if ($soloActivos) {
            $where[] = 'p.activo = 1';
        }
        if ($this->conCategoria()) {
            $cat = trim((string) ($f['categoria'] ?? ''));
            if ($cat === 'sin') {
                $where[] = '(p.categoria_id IS NULL OR c.id IS NULL)';
            } elseif ($cat !== '') {
                $where[] = ctype_digit($cat) ? 'p.categoria_id = ?' : 'c.slug = ?';
                $args[] = ctype_digit($cat) ? (int) $cat : $cat;
            }
            $talla = trim((string) ($f['talla'] ?? ''));
            if ($talla !== '') {
                $where[] = 'p.talla = ?';
                $args[] = $talla;
            }
        }
        $q = trim((string) ($f['q'] ?? ''));
        if ($q !== '') {
            $like = '%' . mb_substr($q, 0, 80) . '%';
            $cols = ['p.nombre', 'p.descripcion'];
            if ($this->conCodigo()) {
                $cols[] = 'p.codigo';
            }
            $where[] = '(' . implode(' OR ', array_map(fn($c) => "$c LIKE ?", $cols)) . ')';
            foreach ($cols as $_) {
                $args[] = $like;
            }
        }
        if (isset($f['min']) && $f['min'] !== null) {
            $where[] = 'p.precio >= ?';
            $args[] = (float) $f['min'];
        }
        if (isset($f['max']) && $f['max'] !== null) {
            $where[] = 'p.precio <= ?';
            $args[] = (float) $f['max'];
        }
        $w = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $order = match ($f['orden'] ?? '') {
            'precio_asc'  => 'p.precio ASC, p.id DESC',
            'precio_desc' => 'p.precio DESC, p.id DESC',
            'nombre'      => 'p.nombre ASC',
            default       => 'p.creado_en DESC, p.id DESC',
        };

        $from = $this->from();
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM $from $w");
        $stmt->execute($args);
        $total = (int) $stmt->fetchColumn();

        $stmt = $this->db->prepare("SELECT {$this->campos()} FROM $from $w ORDER BY $order LIMIT ? OFFSET ?");
        $i = 1;
        foreach ($args as $a) {
            $stmt->bindValue($i++, $a);
        }
        $stmt->bindValue($i++, $porPagina, PDO::PARAM_INT);
        $stmt->bindValue($i, ($pagina - 1) * $porPagina, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll();

        $fotos = $this->fotosDe(array_column($rows, 'id'));
        return [
            'items'        => array_map(fn($r) => $this->toResponse($r, $fotos[(int) $r['id']] ?? []), $rows),
            'total'        => $total,
            'pagina'       => $pagina,
            'porPagina'    => $porPagina,
            'totalPaginas' => $porPagina > 0 ? max(1, (int) ceil($total / $porPagina)) : 1,
        ];
    }

    public function obtener(int $id): ?array
    {
        $stmt = $this->db->prepare("SELECT {$this->campos()} FROM {$this->from()} WHERE p.id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? $this->toResponse($row, $this->fotosDe([$id])[$id] ?? []) : null;
    }

    public function crear(array $req, ?array $imagen): array
    {
        $imagenUrl = null;
        if ($imagen) {
            [$ok, $error, $url] = $this->storage->save($imagen, 'productos');
            if (!$ok) {
                throw new \InvalidArgumentException($error);
            }
            $imagenUrl = $url;
        }
        if ($this->conCategoria()) {
            [$cid, $talla] = $this->asignacion($req['categoriaId'] ?? null, $req['talla'] ?? null);
            $stmt = $this->db->prepare('INSERT INTO productos (codigo, categoria_id, talla, nombre, descripcion, descripcion_larga, precio, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
            $stmt->execute([$req['codigo'] ?? null, $cid, $talla, $req['nombre'], $req['descripcion'], $req['descripcionLarga'] ?? null, $req['precio'], $imagenUrl]);
        } elseif ($this->conCodigo()) {
            $stmt = $this->db->prepare('INSERT INTO productos (codigo, nombre, descripcion, descripcion_larga, precio, imagen_url) VALUES (?, ?, ?, ?, ?, ?)');
            $stmt->execute([$req['codigo'] ?? null, $req['nombre'], $req['descripcion'], $req['descripcionLarga'] ?? null, $req['precio'], $imagenUrl]);
        } else {
            $stmt = $this->db->prepare('INSERT INTO productos (nombre, descripcion, descripcion_larga, precio, imagen_url) VALUES (?, ?, ?, ?, ?)');
            $stmt->execute([$req['nombre'], $req['descripcion'], $req['descripcionLarga'] ?? null, $req['precio'], $imagenUrl]);
        }
        return $this->obtener((int) $this->db->lastInsertId());
    }

    /** @return array{0: bool, 1: string, 2: string} */
    public function agregarImagen(int $productoId, array $imagen): array
    {
        $stmt = $this->db->prepare('SELECT id FROM productos WHERE id = ?');
        $stmt->execute([$productoId]);
        if (!$stmt->fetch()) {
            return [false, 'Producto no encontrado', ''];
        }
        [$ok, $error, $url] = $this->storage->save($imagen, 'productos');
        if (!$ok) {
            return [false, $error, ''];
        }
        $stmt = $this->db->prepare('SELECT COALESCE(MAX(orden) + 1, 0) FROM producto_imagenes WHERE producto_id = ?');
        $stmt->execute([$productoId]);
        $orden = (int) $stmt->fetchColumn();
        $this->db->prepare('INSERT INTO producto_imagenes (producto_id, url, orden) VALUES (?, ?, ?)')->execute([$productoId, $url, $orden]);
        return [true, '', $url];
    }

    public function eliminarImagen(int $productoId, int $imagenId): bool
    {
        $stmt = $this->db->prepare('SELECT url FROM producto_imagenes WHERE id = ? AND producto_id = ?');
        $stmt->execute([$imagenId, $productoId]);
        $url = $stmt->fetchColumn();
        if ($url === false) {
            return false;
        }
        $this->db->prepare('DELETE FROM producto_imagenes WHERE id = ?')->execute([$imagenId]);
        $this->storage->delete($url);
        return true;
    }

    /** @return array{0: bool, 1: string, 2: ?array} */
    public function actualizar(int $id, array $req, ?array $nuevaImagen): array
    {
        $stmt = $this->db->prepare('SELECT * FROM productos WHERE id = ?');
        $stmt->execute([$id]);
        $producto = $stmt->fetch();
        if (!$producto) {
            return [false, 'Producto no encontrado', null];
        }

        $map = ['nombre' => 'nombre', 'descripcion' => 'descripcion', 'precio' => 'precio'];
        $fields = [];
        $params = [];
        foreach ($map as $k => $col) {
            if (isset($req[$k])) {
                $fields[] = "$col = ?";
                $params[] = $req[$k];
            }
        }
        if (array_key_exists('descripcionLarga', $req)) {
            $fields[] = 'descripcion_larga = ?';
            $params[] = $req['descripcionLarga'];
        }
        if (array_key_exists('codigo', $req) && $this->conCodigo()) {
            $fields[] = 'codigo = ?';
            $params[] = $req['codigo'];
        }
        if (array_key_exists('categoriaId', $req) && $this->conCategoria()) {
            [$cid, $talla] = $this->asignacion($req['categoriaId'], $req['talla'] ?? null);
            $fields[] = 'categoria_id = ?';
            $params[] = $cid;
            $fields[] = 'talla = ?';
            $params[] = $talla;
        }
        if (isset($req['activo'])) {
            $fields[] = 'activo = ?';
            $params[] = $req['activo'] ? 1 : 0;
        }
        if ($nuevaImagen) {
            [$ok, $error, $url] = $this->storage->save($nuevaImagen, 'productos');
            if (!$ok) {
                return [false, $error, null];
            }
            $this->storage->delete($producto['imagen_url']);
            $fields[] = 'imagen_url = ?';
            $params[] = $url;
        }
        if ($fields) {
            $fields[] = 'actualizado_en = NOW()';
            $params[] = $id;
            $this->db->prepare('UPDATE productos SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($params);
        }
        return [true, '', $this->obtener($id)];
    }

    public function eliminar(int $id): bool
    {
        $stmt = $this->db->prepare('SELECT imagen_url FROM productos WHERE id = ?');
        $stmt->execute([$id]);
        $principal = $stmt->fetchColumn();
        if ($principal === false) {
            return false;
        }
        $fotos = $this->fotosDe([$id])[$id] ?? [];
        $this->db->prepare('DELETE FROM productos WHERE id = ?')->execute([$id]);
        $this->storage->delete($principal);
        foreach ($fotos as $f) {
            $this->storage->delete($f['url']);
        }
        return true;
    }

    /** @return array<int, array<int, array{id:int,url:string}>> */
    private function fotosDe(array $ids): array
    {
        $ids = array_values(array_unique(array_map('intval', $ids)));
        if (!$ids) {
            return [];
        }
        $in = implode(',', array_fill(0, count($ids), '?'));
        $stmt = $this->db->prepare("SELECT id, producto_id, url FROM producto_imagenes WHERE producto_id IN ($in) ORDER BY producto_id, orden, id");
        $stmt->execute($ids);
        $out = [];
        foreach ($stmt->fetchAll() as $r) {
            $out[(int) $r['producto_id']][] = ['id' => (int) $r['id'], 'url' => $r['url']];
        }
        return $out;
    }

    private function conCategoria(): bool
    {
        return $this->conCategoria ??= Schema::hasColumn($this->db, 'productos', 'categoria_id');
    }

    private function from(): string
    {
        return $this->conCategoria() ? 'productos p LEFT JOIN categorias c ON c.id = p.categoria_id' : 'productos p';
    }

    private function campos(): string
    {
        return $this->conCategoria() ? 'p.*, c.nombre AS categoria_nombre, c.slug AS categoria_slug' : 'p.*';
    }

    /** Categoría y talla válidas (la talla debe pertenecer a la categoría). @return array{0: ?int, 1: ?string} */
    private function asignacion(mixed $categoriaId, mixed $talla): array
    {
        return (new CategoriaService($this->db))->validarAsignacion($categoriaId, $talla);
    }

    private function conCodigo(): bool
    {
        return $this->conCodigo ??= Schema::hasColumn($this->db, 'productos', 'codigo');
    }

    private function toResponse(array $row, array $fotos): array
    {
        // Solo se publican las fotos cuyo archivo existe en el servidor: así nunca sale una foto rota.
        $principalOk = $this->storage->exists($row['imagen_url']);
        $fotosOk = array_values(array_filter($fotos, fn($f) => $this->storage->exists($f['url'])));
        $faltantes = ($row['imagen_url'] && !$principalOk ? 1 : 0) + (count($fotos) - count($fotosOk));
        $principal = $principalOk ? $row['imagen_url'] : ($fotosOk[0]['url'] ?? null);
        if (!$principalOk && $fotosOk) {
            array_shift($fotosOk); // la primera foto extra pasa a ser la principal
        }
        return [
            'id'               => (int) $row['id'],
            'codigo'           => $row['codigo'] ?? null,
            'categoria'        => !empty($row['categoria_nombre']) ? ['id' => (int) $row['categoria_id'], 'nombre' => $row['categoria_nombre'], 'slug' => $row['categoria_slug']] : null,
            'categoriaId'      => !empty($row['categoria_nombre']) ? (int) $row['categoria_id'] : null,
            'talla'            => !empty($row['categoria_nombre']) ? ($row['talla'] ?? null) : null,
            'nombre'           => $row['nombre'],
            'descripcion'      => $row['descripcion'],
            'descripcionLarga' => $row['descripcion_larga'],
            'precio'           => (float) $row['precio'],
            'imagenUrl'        => $principal,
            'activo'           => Response::boolFromDb($row['activo']),
            'creadoEn'         => $row['creado_en'] ? str_replace(' ', 'T', $row['creado_en']) : null,
            'imagenes'         => array_column($fotosOk, 'url'), // compatibilidad: solo URLs
            'fotos'            => $fotosOk,                      // con id, para poder borrarlas desde el panel
            'fotosFaltantes'   => $faltantes,                    // fotos registradas cuyo archivo no está en el servidor
        ];
    }
}
