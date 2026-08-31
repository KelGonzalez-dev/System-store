<?php

namespace GuajiraBags\Services;

use GuajiraBags\Helpers\Response;
use PDO;

class GaleriaService
{
    public function __construct(
        private PDO $db,
        private FileStorageService $storage
    ) {}

    public function listar(bool $soloActivos = true): array
    {
        $sql = 'SELECT * FROM galeria';
        if ($soloActivos) {
            $sql .= ' WHERE activo = 1';
        }
        $sql .= ' ORDER BY orden ASC, creado_en DESC';

        $rows = $this->db->query($sql)->fetchAll();
        return array_map(fn($row) => $this->toResponse($row), $rows);
    }

    public function obtener(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM galeria WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? $this->toResponse($row) : null;
    }

    /** @return array{0: bool, 1: string, 2: ?array} */
    public function crear(array $foto, ?string $caption): array
    {
        [$ok, $error, $url] = $this->storage->save($foto, 'galeria');
        if (!$ok) {
            return [false, $error, null];
        }

        $maxOrden = (int) $this->db->query('SELECT COALESCE(MAX(orden), 0) FROM galeria')->fetchColumn();

        $stmt = $this->db->prepare(
            'INSERT INTO galeria (url, caption, orden) VALUES (?, ?, ?)'
        );
        $stmt->execute([$url, $caption, $maxOrden + 1]);

        return [true, '', $this->obtener((int) $this->db->lastInsertId())];
    }

    /** @return array{0: bool, 1: string, 2: ?array} */
    public function actualizar(int $id, array $req): array
    {
        $stmt = $this->db->prepare('SELECT * FROM galeria WHERE id = ?');
        $stmt->execute([$id]);
        $item = $stmt->fetch();

        if (!$item) {
            return [false, 'Imagen no encontrada', null];
        }

        $fields = [];
        $params = [];

        if (array_key_exists('caption', $req)) {
            $fields[] = 'caption = ?';
            $params[] = $req['caption'];
        }
        if (isset($req['orden'])) {
            $fields[] = 'orden = ?';
            $params[] = (int) $req['orden'];
        }
        if (isset($req['activo'])) {
            $fields[] = 'activo = ?';
            $params[] = $req['activo'] ? 1 : 0;
        }

        if (!empty($fields)) {
            $params[] = $id;
            $sql = 'UPDATE galeria SET ' . implode(', ', $fields) . ' WHERE id = ?';
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
        }

        return [true, '', $this->obtener($id)];
    }

    public function eliminar(int $id): bool
    {
        $stmt = $this->db->prepare('SELECT * FROM galeria WHERE id = ?');
        $stmt->execute([$id]);
        $item = $stmt->fetch();

        if (!$item) {
            return false;
        }

        $this->storage->delete($item['url']);
        $stmt = $this->db->prepare('DELETE FROM galeria WHERE id = ?');
        $stmt->execute([$id]);
        return true;
    }

    private function toResponse(array $row): array
    {
        return [
            'id'       => (int) $row['id'],
            'url'      => $row['url'],
            'caption'  => $row['caption'],
            'orden'    => (int) $row['orden'],
            'activo'   => Response::boolFromDb($row['activo']),
            'creadoEn' => $row['creado_en']
                ? (new \DateTimeImmutable($row['creado_en']))->format('Y-m-d\TH:i:s')
                : null,
        ];
    }
}
