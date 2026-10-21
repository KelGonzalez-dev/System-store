<?php

namespace GuajiraBags\Controllers;

use GuajiraBags\Helpers\Response;
use GuajiraBags\Services\ResenaService;

class ResenasController
{
    public function __construct(private ResenaService $service) {}

    /** GET /api/productos/{id}/resenas?pagina=1&porPagina=5 */
    public function listarDeProducto(int $productoId): void
    {
        $pagina = max(1, (int) ($_GET['pagina'] ?? 1));
        $porPagina = min(30, max(1, (int) ($_GET['porPagina'] ?? 5)));
        Response::json($this->service->listarDeProducto($productoId, $pagina, $porPagina));
    }

    /** POST /api/productos/{id}/resenas  { nombre, ciudad, calificacion, comentario } */
    public function crear(int $productoId): void
    {
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        [$ok, $error, $data, $status] = $this->service->crear($productoId, $body);
        if (!$ok) {
            Response::error($error, $status);
        }
        Response::json($data, 201);
    }

    /** GET /api/resenas?pagina=1&porPagina=6 — todas las reseñas visibles (inicio) */
    public function listarTodas(): void
    {
        $pagina = max(1, (int) ($_GET['pagina'] ?? 1));
        $porPagina = min(30, max(1, (int) ($_GET['porPagina'] ?? 6)));
        Response::json($this->service->listarTodas($pagina, $porPagina));
    }

    /** POST /api/resenas  { nombre, ciudad, calificacion, comentario, producto_id? } — sin producto = reseña de la tienda */
    public function crearGeneral(): void
    {
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $pid = (int) ($body['producto_id'] ?? $body['productoId'] ?? 0);
        [$ok, $error, $data, $status] = $this->service->crear($pid > 0 ? $pid : null, $body);
        if (!$ok) {
            Response::error($error, $status);
        }
        Response::json($data, 201);
    }

    /** GET /api/resenas/resumen?ids=1,2,3 */
    public function resumen(): void
    {
        $ids = explode(',', (string) ($_GET['ids'] ?? ''));
        Response::json((object) $this->service->resumen($ids));
    }

    /** GET /api/resenas/recientes?n=6 */
    public function recientes(): void
    {
        $n = min(12, max(1, (int) ($_GET['n'] ?? 6)));
        Response::json($this->service->recientes($n));
    }

    /** GET /api/resenas (con sesión) — panel: ?pagina&porPagina&visible=todas|1|0&buscar */
    public function listarAdmin(): void
    {
        $pagina = max(1, (int) ($_GET['pagina'] ?? 1));
        $porPagina = min(50, max(1, (int) ($_GET['porPagina'] ?? 20)));
        Response::json($this->service->listarAdmin($pagina, $porPagina, [
            'visible' => (string) ($_GET['visible'] ?? 'todas'),
            'buscar'  => (string) ($_GET['buscar'] ?? ''),
        ]));
    }

    /** PUT /api/resenas/{id} (con sesión) */
    public function actualizar(int $id): void
    {
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        [$ok, $error, $data] = $this->service->actualizar($id, $body);
        if (!$ok) {
            Response::error($error, $error === 'Reseña no encontrada.' ? 404 : 400);
        }
        Response::json($data);
    }

    /** DELETE /api/resenas/{id} (con sesión) */
    public function eliminar(int $id): void
    {
        if (!$this->service->eliminar($id)) {
            Response::error('Reseña no encontrada.', 404);
        }
        Response::noContent();
    }
}
