<?php

namespace GuajiraBags\Controllers;

use GuajiraBags\Helpers\Response;
use GuajiraBags\Services\GaleriaService;

class GaleriaController
{
    public function __construct(private GaleriaService $service) {}

    public function listar(): void
    {
        $soloActivos = filter_var($_GET['soloActivos'] ?? 'true', FILTER_VALIDATE_BOOLEAN);
        Response::json($this->service->listar($soloActivos), 200, $soloActivos ? 120 : 0);
    }

    public function obtener(int $id): void
    {
        $item = $this->service->obtener($id);
        if (!$item) {
            Response::error('Imagen no encontrada', 404);
        }
        Response::json($item);
    }

    public function crear(): void
    {
        $foto = $_FILES['foto'] ?? null;
        if (!$foto || ($foto['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            Response::error('La foto es obligatoria');
        }

        $caption = $_POST['caption'] ?? null;

        [$ok, $error, $data] = $this->service->crear($foto, $caption ?: null);
        if (!$ok) {
            Response::error($error);
        }

        header('Location: /api/galeria/' . $data['id']);
        Response::json($data, 201);
    }

    public function actualizar(int $id): void
    {
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        [$ok, $error, $data] = $this->service->actualizar($id, $body);
        if (!$ok) {
            Response::error($error);
        }
        Response::json($data);
    }

    public function eliminar(int $id): void
    {
        if (!$this->service->eliminar($id)) {
            Response::error('Imagen no encontrada', 404);
        }
        Response::noContent();
    }
}
