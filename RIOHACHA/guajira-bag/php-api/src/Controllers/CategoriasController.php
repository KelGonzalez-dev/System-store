<?php

namespace GuajiraBags\Controllers;

use GuajiraBags\Helpers\Response;
use GuajiraBags\Services\CategoriaService;

class CategoriasController
{
    public function __construct(private CategoriaService $service) {}

    /** GET /api/categorias — sin sesión: activas con conteo de productos visibles; con sesión: todas. */
    public function listar(bool $conSesion): void
    {
        Response::json($this->service->listar(!$conSesion), 200, $conSesion ? 0 : 60);
    }

    /** POST /api/categorias { nombre, descripcion?, tallas: ["Mini","Mediana"] } */
    public function crear(): void
    {
        [$ok, $error, $data] = $this->service->crear($this->body());
        if (!$ok) {
            Response::error($error);
        }
        Response::json($data, 201);
    }

    /** PUT /api/categorias/{id} */
    public function actualizar(int $id): void
    {
        [$ok, $error, $data] = $this->service->actualizar($id, $this->body());
        if (!$ok) {
            Response::error($error, $error === 'Categoría no encontrada.' ? 404 : 400);
        }
        Response::json($data);
    }

    /** PUT /api/categorias/orden { ids: [3,1,2] } */
    public function reordenar(): void
    {
        $ids = $this->body()['ids'] ?? [];
        if (!is_array($ids)) {
            Response::error('Orden no válido');
        }
        $this->service->reordenar($ids);
        Response::noContent();
    }

    /** DELETE /api/categorias/{id} — los productos quedan sin categoría (no se borran). */
    public function eliminar(int $id): void
    {
        if (!$this->service->eliminar($id)) {
            Response::error('Categoría no encontrada.', 404);
        }
        Response::noContent();
    }

    private function body(): array
    {
        return json_decode(file_get_contents('php://input'), true) ?? [];
    }
}
