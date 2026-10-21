<?php

namespace GuajiraBags\Services;

use PDO;
use PDOException;

/**
 * Reseñas de productos: los clientes califican de 1 a 5 estrellas y dejan su comentario.
 * Todo se guarda en la tabla `resenas` de la base de datos.
 */
class ResenaService
{
    public function __construct(private PDO $db) {}

    /** Reseñas de un producto, con promedio y conteo por estrellas. */
    public function listarDeProducto(int $productoId, int $pagina, int $porPagina): array
    {
        return $this->conTabla(function () use ($productoId, $pagina, $porPagina) {
            $stmt = $this->db->prepare(
                'SELECT calificacion, COUNT(*) AS n FROM resenas WHERE visible = 1 AND producto_id = ? GROUP BY calificacion'
            );
            $stmt->execute([$productoId]);
            $estrellas = ['5' => 0, '4' => 0, '3' => 0, '2' => 0, '1' => 0];
            $total = 0;
            $suma = 0;
            foreach ($stmt->fetchAll() as $r) {
                $n = (int) $r['n'];
                $estrellas[(string) $r['calificacion']] = $n;
                $total += $n;
                $suma += $n * (int) $r['calificacion'];
            }

            $stmt = $this->db->prepare(
                'SELECT * FROM resenas WHERE visible = 1 AND producto_id = ?
                 ORDER BY creado_en DESC, id DESC LIMIT ? OFFSET ?'
            );
            $stmt->bindValue(1, $productoId, PDO::PARAM_INT);
            $stmt->bindValue(2, $porPagina, PDO::PARAM_INT);
            $stmt->bindValue(3, ($pagina - 1) * $porPagina, PDO::PARAM_INT);
            $stmt->execute();

            return [
                'items'        => array_map(fn($r) => $this->toResponse($r), $stmt->fetchAll()),
                'total'        => $total,
                'promedio'     => $total ? round($suma / $total, 1) : 0,
                'estrellas'    => $estrellas,
                'pagina'       => $pagina,
                'totalPaginas' => max(1, (int) ceil($total / $porPagina)),
            ];
        });
    }

    /** Promedio y cantidad de reseñas por producto (estrellas en las tarjetas). */
    public function resumen(array $ids): array
    {
        $ids = array_slice(array_values(array_unique(array_filter(array_map('intval', $ids), fn($i) => $i > 0))), 0, 200);
        if (!$ids) {
            return [];
        }
        return $this->conTabla(function () use ($ids) {
            $in = implode(',', array_fill(0, count($ids), '?'));
            $stmt = $this->db->prepare(
                "SELECT producto_id, ROUND(AVG(calificacion), 1) AS promedio, COUNT(*) AS total
                 FROM resenas WHERE visible = 1 AND producto_id IN ($in) GROUP BY producto_id"
            );
            $stmt->execute($ids);
            $out = [];
            foreach ($stmt->fetchAll() as $r) {
                $out[(string) $r['producto_id']] = ['promedio' => (float) $r['promedio'], 'total' => (int) $r['total']];
            }
            return $out;
        });
    }

    /** Últimas reseñas de 4 y 5 estrellas con su producto (para el inicio). */
    public function recientes(int $n): array
    {
        return $this->conTabla(function () use ($n) {
            $stmt = $this->db->prepare(
                'SELECT r.*, p.nombre AS producto_nombre, p.imagen_url AS producto_imagen
                 FROM resenas r LEFT JOIN productos p ON p.id = r.producto_id
                 WHERE r.visible = 1 AND r.calificacion >= 4 AND (r.producto_id IS NULL OR p.activo = 1)
                 ORDER BY r.creado_en DESC, r.id DESC LIMIT ?'
            );
            $stmt->bindValue(1, $n, PDO::PARAM_INT);
            $stmt->execute();
            $items = array_map(fn($r) => $this->toResponse($r), $stmt->fetchAll());
            $g = $this->db->query('SELECT ROUND(AVG(calificacion), 1) AS promedio, COUNT(*) AS total FROM resenas WHERE visible = 1')->fetch();
            return ['items' => $items, 'promedio' => (float) ($g['promedio'] ?? 0), 'total' => (int) ($g['total'] ?? 0)];
        });
    }

    /** Todas las reseñas visibles (de la tienda y de productos), las más nuevas primero. */
    public function listarTodas(int $pagina, int $porPagina): array
    {
        return $this->conTabla(function () use ($pagina, $porPagina) {
            $g = $this->db->query('SELECT ROUND(AVG(calificacion), 1) AS promedio, COUNT(*) AS total FROM resenas WHERE visible = 1')->fetch();
            $total = (int) ($g['total'] ?? 0);
            $stmt = $this->db->prepare(
                'SELECT r.*, p.nombre AS producto_nombre, p.imagen_url AS producto_imagen
                 FROM resenas r LEFT JOIN productos p ON p.id = r.producto_id
                 WHERE r.visible = 1
                 ORDER BY r.creado_en DESC, r.id DESC LIMIT ? OFFSET ?'
            );
            $stmt->bindValue(1, $porPagina, PDO::PARAM_INT);
            $stmt->bindValue(2, ($pagina - 1) * $porPagina, PDO::PARAM_INT);
            $stmt->execute();
            return [
                'items'        => array_map(fn($r) => $this->toResponse($r), $stmt->fetchAll()),
                'total'        => $total,
                'promedio'     => (float) ($g['promedio'] ?? 0),
                'pagina'       => $pagina,
                'totalPaginas' => max(1, (int) ceil($total / $porPagina)),
            ];
        });
    }

    /**
     * Guarda la reseña de un cliente.
     * $productoId = null → reseña general de la tienda.
     * @return array{0: bool, 1: string, 2: ?array, 3: int}
     */
    public function crear(?int $productoId, array $req): array
    {
        if (trim((string) ($req['web'] ?? '')) !== '') {
            return [false, 'No se pudo publicar la reseña.', null, 400]; // campo trampa: lo llenan los robots
        }
        $nombre = $this->limpiar($req['nombre'] ?? '', 60);
        $ciudad = $this->limpiar($req['ciudad'] ?? '', 60);
        $calificacion = (int) ($req['calificacion'] ?? 0);
        $comentario = $this->limpiarTexto($req['comentario'] ?? '', 1000);

        if (mb_strlen($nombre) < 2) {
            return [false, 'Escribe tu nombre.', null, 400];
        }
        if ($calificacion < 1 || $calificacion > 5) {
            return [false, 'Elige de 1 a 5 estrellas.', null, 400];
        }
        if (mb_strlen($comentario) < 3) {
            return [false, 'Escribe tu reseña.', null, 400];
        }

        return $this->conTabla(function () use ($productoId, $nombre, $ciudad, $calificacion, $comentario) {
            if ($productoId !== null) {
                $stmt = $this->db->prepare('SELECT id FROM productos WHERE id = ?');
                $stmt->execute([$productoId]);
                if (!$stmt->fetch()) {
                    return [false, 'Producto no encontrado.', null, 404];
                }
            }

            $insertar = function () use ($productoId, $nombre, $ciudad, $calificacion, $comentario) {
                $stmt = $this->db->prepare(
                    'INSERT INTO resenas (producto_id, nombre, ciudad, calificacion, comentario) VALUES (?, ?, ?, ?, ?)'
                );
                $stmt->execute([$productoId, $nombre, $ciudad !== '' ? $ciudad : null, $calificacion, $comentario]);
            };
            try {
                $insertar();
            } catch (PDOException $e) {
                // Tablas creadas antes no aceptaban reseñas generales (sin producto): se ajusta sola
                if ($productoId === null && in_array((int) ($e->errorInfo[1] ?? 0), [1048, 1452], true)) {
                    $this->db->exec('ALTER TABLE resenas MODIFY producto_id INT NULL');
                    $insertar();
                } else {
                    throw $e;
                }
            }

            $stmt = $this->db->prepare(
                'SELECT r.*, p.nombre AS producto_nombre, p.imagen_url AS producto_imagen
                 FROM resenas r LEFT JOIN productos p ON p.id = r.producto_id WHERE r.id = ?'
            );
            $stmt->execute([(int) $this->db->lastInsertId()]);
            return [true, '', $this->toResponse($stmt->fetch()), 201];
        });
    }

    // ── Panel administrativo ──────────────────────────────────

    /** Lista para el panel: búsqueda (nombre, texto o mochila) y filtro de visibles/ocultas. */
    public function listarAdmin(int $pagina, int $porPagina, array $f): array
    {
        return $this->conTabla(function () use ($pagina, $porPagina, $f) {
            $where = [];
            $args = [];
            if (($f['visible'] ?? '') === '1' || ($f['visible'] ?? '') === '0') {
                $where[] = 'r.visible = ?';
                $args[] = (int) $f['visible'];
            }
            $q = trim((string) ($f['buscar'] ?? ''));
            if ($q !== '') {
                $where[] = '(r.nombre LIKE ? OR r.comentario LIKE ? OR r.ciudad LIKE ? OR p.nombre LIKE ?)';
                $like = '%' . mb_substr($q, 0, 80) . '%';
                array_push($args, $like, $like, $like, $like);
            }
            $w = $where ? 'WHERE ' . implode(' AND ', $where) : '';
            $stmt = $this->db->prepare("SELECT COUNT(*) FROM resenas r LEFT JOIN productos p ON p.id = r.producto_id $w");
            $stmt->execute($args);
            $total = (int) $stmt->fetchColumn();
            $stmt = $this->db->prepare(
                "SELECT r.*, p.nombre AS producto_nombre, p.imagen_url AS producto_imagen
                 FROM resenas r LEFT JOIN productos p ON p.id = r.producto_id $w
                 ORDER BY r.creado_en DESC, r.id DESC LIMIT ? OFFSET ?"
            );
            $i = 1;
            foreach ($args as $a) {
                $stmt->bindValue($i++, $a);
            }
            $stmt->bindValue($i++, $porPagina, PDO::PARAM_INT);
            $stmt->bindValue($i, ($pagina - 1) * $porPagina, PDO::PARAM_INT);
            $stmt->execute();
            return [
                'items'        => array_map(fn($r) => $this->toResponse($r), $stmt->fetchAll()),
                'total'        => $total,
                'pagina'       => $pagina,
                'totalPaginas' => max(1, (int) ceil($total / $porPagina)),
            ];
        });
    }

    /** @return array{0: bool, 1: string, 2: ?array} */
    public function actualizar(int $id, array $req): array
    {
        $campos = [];
        $args = [];
        if (array_key_exists('nombre', $req)) {
            $v = $this->limpiar($req['nombre'], 60);
            if (mb_strlen($v) < 2) {
                return [false, 'El nombre es muy corto.', null];
            }
            $campos[] = 'nombre = ?';
            $args[] = $v;
        }
        if (array_key_exists('ciudad', $req)) {
            $v = $this->limpiar($req['ciudad'], 60);
            $campos[] = 'ciudad = ?';
            $args[] = $v !== '' ? $v : null;
        }
        if (array_key_exists('calificacion', $req)) {
            $v = (int) $req['calificacion'];
            if ($v < 1 || $v > 5) {
                return [false, 'La calificación debe ser de 1 a 5.', null];
            }
            $campos[] = 'calificacion = ?';
            $args[] = $v;
        }
        if (array_key_exists('comentario', $req)) {
            $v = $this->limpiarTexto($req['comentario'], 1000);
            if (mb_strlen($v) < 3) {
                return [false, 'El comentario es muy corto.', null];
            }
            $campos[] = 'comentario = ?';
            $args[] = $v;
        }
        if (array_key_exists('visible', $req)) {
            $campos[] = 'visible = ?';
            $args[] = filter_var($req['visible'], FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
        }
        return $this->conTabla(function () use ($id, $campos, $args) {
            $stmt = $this->db->prepare('SELECT id FROM resenas WHERE id = ?');
            $stmt->execute([$id]);
            if (!$stmt->fetch()) {
                return [false, 'Reseña no encontrada.', null];
            }
            if ($campos) {
                $args[] = $id;
                $this->db->prepare('UPDATE resenas SET ' . implode(', ', $campos) . ' WHERE id = ?')->execute($args);
            }
            $stmt = $this->db->prepare(
                'SELECT r.*, p.nombre AS producto_nombre, p.imagen_url AS producto_imagen
                 FROM resenas r LEFT JOIN productos p ON p.id = r.producto_id WHERE r.id = ?'
            );
            $stmt->execute([$id]);
            return [true, '', $this->toResponse($stmt->fetch())];
        });
    }

    public function eliminar(int $id): bool
    {
        return $this->conTabla(function () use ($id) {
            $stmt = $this->db->prepare('DELETE FROM resenas WHERE id = ?');
            $stmt->execute([$id]);
            return $stmt->rowCount() > 0;
        });
    }

    // ── Internos ──────────────────────────────────────────────

    /** Ejecuta la consulta; si la tabla aún no existe la crea y lo intenta de nuevo. */
    private function conTabla(callable $fn)
    {
        try {
            return $fn();
        } catch (PDOException $e) {
            if (($e->errorInfo[1] ?? 0) !== 1146) {
                throw $e;
            }
            $this->db->exec(
                "CREATE TABLE IF NOT EXISTS resenas (
                    id             INT AUTO_INCREMENT PRIMARY KEY,
                    producto_id    INT          NULL,
                    nombre         VARCHAR(80)  NOT NULL,
                    ciudad         VARCHAR(80),
                    calificacion   TINYINT      NOT NULL,
                    comentario     TEXT         NOT NULL,
                    visible        TINYINT(1)   NOT NULL DEFAULT 1,
                    creado_en      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_resenas_producto (producto_id, visible, creado_en)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
            );
            return $fn();
        }
    }

    private function limpiar($s, int $max): string
    {
        $s = trim((string) preg_replace('/\s+/u', ' ', strip_tags((string) $s)));
        return mb_substr($s, 0, $max);
    }

    private function limpiarTexto($s, int $max): string
    {
        $s = trim(str_replace("\r", '', strip_tags((string) $s)));
        return mb_substr($s, 0, $max);
    }

    private function toResponse(array $row): array
    {
        return [
            'id'             => (int) $row['id'],
            'productoId'     => $row['producto_id'] !== null ? (int) $row['producto_id'] : null,
            'nombre'         => $row['nombre'],
            'ciudad'         => $row['ciudad'],
            'calificacion'   => (int) $row['calificacion'],
            'visible'        => (bool) (int) ($row['visible'] ?? 1),
            'comentario'     => $row['comentario'],
            'creadoEn'       => $row['creado_en']
                ? (new \DateTimeImmutable($row['creado_en']))->format('Y-m-d\TH:i:s')
                : null,
            'productoNombre' => $row['producto_nombre'] ?? null,
            'productoImagen' => $row['producto_imagen'] ?? null,
        ];
    }
}
