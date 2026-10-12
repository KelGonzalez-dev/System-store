<?php

namespace GuajiraBags\Controllers;

use GuajiraBags\Helpers\MultipartParser;
use GuajiraBags\Helpers\Response;
use GuajiraBags\Services\ProductoService;

class ProductosController
{
    public function __construct(private ProductoService $service) {}

    public function listar(): void
    {
        $pagina      = max(1, (int) ($_GET['pagina'] ?? 1));
        $porPagina   = (int) ($_GET['porPagina'] ?? 15);
        $porPagina   = ($porPagina < 1 || $porPagina > 100) ? 15 : $porPagina;
        $soloActivos = filter_var($_GET['soloActivos'] ?? 'true', FILTER_VALIDATE_BOOLEAN);

        Response::json($this->service->listar($pagina, $porPagina, $soloActivos));
    }

    public function obtener(int $id): void
    {
        $item = $this->service->obtener($id);
        if (!$item) {
            http_response_code(404);
            exit;
        }
        Response::json($item);
    }

    public function crear(): void
    {
        $nombre           = trim($_POST['nombre'] ?? '');
        $descripcion      = trim($_POST['descripcion'] ?? '');
        $descripcionLarga = $_POST['descripcionLarga'] ?? null;
        $precio           = isset($_POST['precio']) ? (float) $_POST['precio'] : null;

        if ($nombre === '') {
            Response::error('El nombre es obligatorio');
        }
        if ($descripcion === '') {
            Response::error('La descripción es obligatoria');
        }
        if ($precio === null || $precio < 0) {
            Response::error('El precio no puede ser negativo');
        }

        $imagen = $this->getUploadedFile('imagen');

        try {
            $producto = $this->service->crear([
                'nombre'           => $nombre,
                'descripcion'      => $descripcion,
                'descripcionLarga' => $descripcionLarga ?: null,
                'precio'           => $precio,
            ], $imagen);
        } catch (\InvalidArgumentException $e) {
            Response::error($e->getMessage());
        }

        http_response_code(201);
        header('Location: /api/productos/' . $producto['id']);
        Response::json($producto, 201);
    }

    public function agregarImagen(int $id): void
    {
        $imagen = $this->getUploadedFile('imagen');
        if (!$imagen) {
            Response::error('La imagen es obligatoria');
        }

        [$ok, $error, $url] = $this->service->agregarImagen($id, $imagen);
        if (!$ok) {
            Response::error($error);
        }
        Response::json(['url' => $url]);
    }

    public function actualizar(int $id): void
    {
        // IMPORTANTE: PHP solo llena $_POST/$_FILES automáticamente para
        // peticiones POST. Esta ruta recibe un PUT con multipart/form-data
        // (nombre, descripción, precio y opcionalmente una imagen nueva),
        // así que hay que parsear el body a mano antes de leer $_POST.
        // Sin esto, $_POST siempre llegaba vacío, ningún campo se detectaba
        // como "a actualizar" y el UPDATE nunca se ejecutaba, aunque la API
        // respondiera 200 como si todo hubiera salido bien.
        MultipartParser::hydrateSuperglobals();

        $req = [];
        if (isset($_POST['nombre'])) {
            $req['nombre'] = trim($_POST['nombre']);
        }
        if (isset($_POST['descripcion'])) {
            $req['descripcion'] = trim($_POST['descripcion']);
        }
        if (array_key_exists('descripcionLarga', $_POST)) {
            $req['descripcionLarga'] = $_POST['descripcionLarga'] ?: null;
        }
        if (isset($_POST['precio'])) {
            $req['precio'] = (float) $_POST['precio'];
        }
        if (isset($_POST['activo'])) {
            $req['activo'] = filter_var($_POST['activo'], FILTER_VALIDATE_BOOLEAN);
        }

        $nuevaImagen = $this->getUploadedFile('nuevaImagen')
            ?? $this->getUploadedFile('imagen');

        [$ok, $error, $data] = $this->service->actualizar($id, $req, $nuevaImagen);
        if (!$ok) {
            Response::error($error);
        }
        Response::json($data);
    }

    public function eliminar(int $id): void
    {
        if (!$this->service->eliminar($id)) {
            http_response_code(404);
            exit;
        }
        Response::noContent();
    }

    private function getUploadedFile(string $key): ?array
    {
        if (!isset($_FILES[$key]) || $_FILES[$key]['error'] === UPLOAD_ERR_NO_FILE) {
            return null;
        }
        return $_FILES[$key];
    }
}