<?php

namespace GuajiraBags\Services;

use GuajiraBags\Helpers\Response;
use PDO;

class ProductoService
{
    public function __construct(
        private PDO $db,
        private FileStorageService $storage
    ) {}

    public function listar(int $pagina, int $porPagina, bool $soloActivos): array
    {
        $where = $soloActivos ? 'WHERE activo = 1' : '';
        $countStmt = $this->db->query("SELECT COUNT(*) FROM productos $where");
        $total = (int) $countStmt->fetchColumn();

        $offset = ($pagina - 1) * $porPagina;
        $stmt = $this->db->prepare(
            "SELECT * FROM productos $where ORDER BY creado_en DESC LIMIT ? OFFSET ?"
        );
        $stmt->bindValue(1, $porPagina, PDO::PARAM_INT);
        $stmt->bindValue(2, $offset, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll();

        $items = array_map(fn($row) => $this->toResponse($row), $rows);

        return [
            'items'        => $items,
            'total'        => $total,
            'pagina'       => $pagina,
            'totalPaginas' => $porPagina > 0 ? (int) ceil($total / $porPagina) : 0,
        ];
    }

    public function obtener(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM productos WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? $this->toResponse($row) : null;
    }

    public function crear(array $req, ?array $imagen): array
    {
        $stmt = $this->db->prepare(
            'INSERT INTO productos (nombre, descripcion, descripcion_larga, precio, imagen_url)
             VALUES (?, ?, ?, ?, ?)'
        );

        $imagenUrl = null;
        if ($imagen) {
            [$ok, $error, $url] = $this->storage->save($imagen, 'productos');
            if (!$ok) {
                throw new \InvalidArgumentException($error);
            }
            $imagenUrl = $url;
        }

        $stmt->execute([
            $req['nombre'],
            $req['descripcion'],
            $req['descripcionLarga'] ?? null,
            $req['precio'],
            $imagenUrl,
        ]);

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

        $stmt = $this->db->prepare('SELECT COUNT(*) FROM producto_imagenes WHERE producto_id = ?');
        $stmt->execute([$productoId]);
        $orden = (int) $stmt->fetchColumn();

        $stmt = $this->db->prepare(
            'INSERT INTO producto_imagenes (producto_id, url, orden) VALUES (?, ?, ?)'
        );
        $stmt->execute([$productoId, $url, $orden]);

        return [true, '', $url];
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

        $fields = [];
        $params = [];

        if (isset($req['nombre'])) {
            $fields[] = 'nombre = ?';
            $params[] = $req['nombre'];
        }
        if (isset($req['descripcion'])) {
            $fields[] = 'descripcion = ?';
            $params[] = $req['descripcion'];
        }
        if (array_key_exists('descripcionLarga', $req)) {
            $fields[] = 'descripcion_larga = ?';
            $params[] = $req['descripcionLarga'];
        }
        if (isset($req['precio'])) {
            $fields[] = 'precio = ?';
            $params[] = $req['precio'];
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

        if (!empty($fields)) {
            $fields[] = 'actualizado_en = NOW()';
            $params[] = $id;
            $sql = 'UPDATE productos SET ' . implode(', ', $fields) . ' WHERE id = ?';
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
        }

        return [true, '', $this->obtener($id)];
    }

    public function eliminar(int $id): bool
    {
        $stmt = $this->db->prepare('SELECT * FROM productos WHERE id = ?');
        $stmt->execute([$id]);
        $producto = $stmt->fetch();

        if (!$producto) {
            return false;
        }

        $this->storage->delete($producto['imagen_url']);

        $stmt = $this->db->prepare('SELECT url FROM producto_imagenes WHERE producto_id = ?');
        $stmt->execute([$id]);
        foreach ($stmt->fetchAll() as $img) {
            $this->storage->delete($img['url']);
        }

        $stmt = $this->db->prepare('DELETE FROM productos WHERE id = ?');
        $stmt->execute([$id]);
        return true;
    }

    private function toResponse(array $row): array
    {
        $stmt = $this->db->prepare(
            'SELECT url FROM producto_imagenes WHERE producto_id = ? ORDER BY orden ASC'
        );
        $stmt->execute([$row['id']]);
        $imagenes = array_column($stmt->fetchAll(), 'url');

        return [
            'id'               => (int) $row['id'],
            'nombre'           => $row['nombre'],
            'descripcion'      => $row['descripcion'],
            'descripcionLarga' => $row['descripcion_larga'],
            'precio'           => (float) $row['precio'],
            'imagenUrl'        => $row['imagen_url'],
            'activo'           => Response::boolFromDb($row['activo']),
            'creadoEn'         => $this->formatDate($row['creado_en']),
            'imagenes'         => $imagenes,
        ];
    }

    private function formatDate(?string $date): ?string
    {
        if (!$date) {
            return null;
        }
        return (new \DateTimeImmutable($date))->format('Y-m-d\TH:i:s');
    }
}
