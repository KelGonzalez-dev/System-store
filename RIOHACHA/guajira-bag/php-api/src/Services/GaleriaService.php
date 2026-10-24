<?php

namespace GuajiraBags\Services;

use GuajiraBags\Helpers\Response;
use PDO;

class GaleriaService
{
    public function __construct(private PDO $db, private FileStorageService $storage) {}

    public function listar(bool $soloActivos = true): array
    {
        $sql = 'SELECT * FROM galeria' . ($soloActivos ? ' WHERE activo = 1' : '') . ' ORDER BY orden ASC, creado_en DESC';
        $items = array_map(fn($r) => $this->toResponse($r), $this->db->query($sql)->fetchAll());
        // En la página pública no se muestran fotos cuyo archivo no está en el servidor
        return $soloActivos ? array_values(array_filter($items, fn($i) => !$i['faltante'])) : $items;
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
        $orden = (int) $this->db->query('SELECT COALESCE(MAX(orden), 0) + 1 FROM galeria')->fetchColumn();
        $this->db->prepare('INSERT INTO galeria (url, caption, orden) VALUES (?, ?, ?)')->execute([$url, $caption, $orden]);
        return [true, '', $this->obtener((int) $this->db->lastInsertId())];
    }

    /** @return array{0: bool, 1: string, 2: ?array} */
    public function actualizar(int $id, array $req): array
    {
        if (!$this->obtener($id)) {
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
        if ($fields) {
            $params[] = $id;
            $this->db->prepare('UPDATE galeria SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($params);
        }
        return [true, '', $this->obtener($id)];
    }

    public function eliminar(int $id): bool
    {
        $item = $this->obtener($id);
        if (!$item) {
            return false;
        }
        $this->db->prepare('DELETE FROM galeria WHERE id = ?')->execute([$id]);
        $this->storage->delete($item['url']);
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
            'creadoEn' => $row['creado_en'] ? str_replace(' ', 'T', $row['creado_en']) : null,
            'faltante' => !$this->storage->exists($row['url']),
        ];
    }
}
