<?php

namespace GuajiraBags\Services;

use GuajiraBags\Helpers\Response;
use GuajiraBags\Schema;
use PDO;

class ProductoService
{
    private ?bool $conCodigo = null;

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
            $where[] = 'activo = 1';
        }
        $q = trim((string) ($f['q'] ?? ''));
        if ($q !== '') {
            $like = '%' . mb_substr($q, 0, 80) . '%';
            $cols = ['nombre', 'descripcion'];
            if ($this->conCodigo()) {
                $cols[] = 'codigo';
            }
            $where[] = '(' . implode(' OR ', array_map(fn($c) => "$c LIKE ?", $cols)) . ')';
            foreach ($cols as $_) {
                $args[] = $like;
            }
        }
        if (isset($f['min']) && $f['min'] !== null) {
            $where[] = 'precio >= ?';
            $args[] = (float) $f['min'];
        }
        if (isset($f['max']) && $f['max'] !== null) {
            $where[] = 'precio <= ?';
            $args[] = (float) $f['max'];
        }
        $w = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $order = match ($f['orden'] ?? '') {
            'precio_asc'  => 'precio ASC, id DESC',
            'precio_desc' => 'precio DESC, id DESC',
            'nombre'      => 'nombre ASC',
            default       => 'creado_en DESC, id DESC',
        };

        $stmt = $this->db->prepare("SELECT COUNT(*) FROM productos $w");
        $stmt->execute($args);
        $total = (int) $stmt->fetchColumn();

        $stmt = $this->db->prepare("SELECT * FROM productos $w ORDER BY $order LIMIT ? OFFSET ?");
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
        $stmt = $this->db->prepare('SELECT * FROM productos WHERE id = ?');
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
        if ($this->conCodigo()) {
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

    private function conCodigo(): bool
    {
        return $this->conCodigo ??= Schema::hasColumn($this->db, 'productos', 'codigo');
    }

    private function toResponse(array $row, array $fotos): array
    {
        return [
            'id'               => (int) $row['id'],
            'codigo'           => $row['codigo'] ?? null,
            'nombre'           => $row['nombre'],
            'descripcion'      => $row['descripcion'],
            'descripcionLarga' => $row['descripcion_larga'],
            'precio'           => (float) $row['precio'],
            'imagenUrl'        => $row['imagen_url'],
            'activo'           => Response::boolFromDb($row['activo']),
            'creadoEn'         => $row['creado_en'] ? str_replace(' ', 'T', $row['creado_en']) : null,
            'imagenes'         => array_column($fotos, 'url'), // compatibilidad: solo URLs
            'fotos'            => $fotos,                      // con id, para poder borrarlas desde el panel
        ];
    }
}
