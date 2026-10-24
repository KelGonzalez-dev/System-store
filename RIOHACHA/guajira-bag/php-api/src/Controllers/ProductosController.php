<?php

namespace GuajiraBags\Controllers;

use GuajiraBags\Helpers\MultipartParser;
use GuajiraBags\Helpers\Response;
use GuajiraBags\Services\ProductoService;

class ProductosController
{
    public function __construct(private ProductoService $service) {}

    /** GET /api/productos?pagina&porPagina&soloActivos&q&orden=recientes|precio_asc|precio_desc|nombre&min&max */
    public function listar(): void
    {
        $pagina      = max(1, (int) ($_GET['pagina'] ?? 1));
        $porPagina   = (int) ($_GET['porPagina'] ?? 15);
        $porPagina   = ($porPagina < 1 || $porPagina > 100) ? 15 : $porPagina;
        $soloActivos = filter_var($_GET['soloActivos'] ?? 'true', FILTER_VALIDATE_BOOLEAN);
        $num = fn($k) => isset($_GET[$k]) && $_GET[$k] !== '' && is_numeric($_GET[$k]) ? (float) $_GET[$k] : null;

        $data = $this->service->listar($pagina, $porPagina, $soloActivos, [
            'q'         => (string) ($_GET['q'] ?? ''),
            'categoria' => (string) ($_GET['categoria'] ?? ''),
            'talla'     => (string) ($_GET['talla'] ?? ''),
            'orden' => (string) ($_GET['orden'] ?? ''),
            'min'   => $num('min'),
            'max'   => $num('max'),
        ]);
        // El catálogo público se puede cachear 60 s; el panel (con sesión) siempre recibe datos frescos
        Response::json($data, 200, $soloActivos ? 60 : 0);
    }

    public function obtener(int $id): void
    {
        $item = $this->service->obtener($id);
        if (!$item) {
            Response::error('Producto no encontrado', 404);
        }
        Response::json($item, 200, 60);
    }

    public function crear(): void
    {
        $nombre      = trim($_POST['nombre'] ?? '');
        $descripcion = trim($_POST['descripcion'] ?? '');
        $precio      = isset($_POST['precio']) && is_numeric($_POST['precio']) ? (float) $_POST['precio'] : null;
        if ($nombre === '') {
            Response::error('El nombre es obligatorio');
        }
        if ($descripcion === '') {
            Response::error('La descripción es obligatoria');
        }
        if ($precio === null || $precio < 0) {
            Response::error('El precio no es válido');
        }
        try {
            $producto = $this->service->crear([
                'codigo'           => $this->texto('codigo', 60),
                'categoriaId'      => $_POST['categoriaId'] ?? null,
                'talla'            => $_POST['talla'] ?? null,
                'nombre'           => mb_substr($nombre, 0, 200),
                'descripcion'      => $descripcion,
                'descripcionLarga' => ($_POST['descripcionLarga'] ?? '') ?: null,
                'precio'           => $precio,
            ], $this->archivo('imagen'));
        } catch (\InvalidArgumentException $e) {
            Response::error($e->getMessage());
        }
        header('Location: /api/productos/' . $producto['id']);
        Response::json($producto, 201);
    }

    public function agregarImagen(int $id): void
    {
        $imagen = $this->archivo('imagen');
        if (!$imagen) {
            Response::error('La imagen es obligatoria');
        }
        [$ok, $error, $url] = $this->service->agregarImagen($id, $imagen);
        if (!$ok) {
            Response::error($error, $error === 'Producto no encontrado' ? 404 : 400);
        }
        Response::json(['url' => $url], 201);
    }

    public function eliminarImagen(int $id, int $imagenId): void
    {
        if (!$this->service->eliminarImagen($id, $imagenId)) {
            Response::error('Foto no encontrada', 404);
        }
        Response::noContent();
    }

    public function actualizar(int $id): void
    {
        // PUT con multipart/form-data: PHP no llena $_POST/$_FILES solo, hay que parsearlo
        MultipartParser::hydrateSuperglobals();
        $req = [];
        foreach (['nombre', 'descripcion'] as $k) {
            if (isset($_POST[$k])) {
                $req[$k] = trim($_POST[$k]);
            }
        }
        if (array_key_exists('descripcionLarga', $_POST)) {
            $req['descripcionLarga'] = $_POST['descripcionLarga'] ?: null;
        }
        if (array_key_exists('codigo', $_POST)) {
            $req['codigo'] = $this->texto('codigo', 60);
        }
        if (array_key_exists('categoriaId', $_POST)) {
            $req['categoriaId'] = $_POST['categoriaId'];
            $req['talla'] = $_POST['talla'] ?? null;
        }
        if (isset($_POST['precio']) && is_numeric($_POST['precio'])) {
            $req['precio'] = (float) $_POST['precio'];
        }
        if (isset($_POST['activo'])) {
            $req['activo'] = filter_var($_POST['activo'], FILTER_VALIDATE_BOOLEAN);
        }
        [$ok, $error, $data] = $this->service->actualizar($id, $req, $this->archivo('nuevaImagen') ?? $this->archivo('imagen'));
        if (!$ok) {
            Response::error($error, $error === 'Producto no encontrado' ? 404 : 400);
        }
        Response::json($data);
    }

    public function eliminar(int $id): void
    {
        if (!$this->service->eliminar($id)) {
            Response::error('Producto no encontrado', 404);
        }
        Response::noContent();
    }

    private function texto(string $k, int $max): ?string
    {
        $v = trim(strip_tags((string) ($_POST[$k] ?? '')));
        return $v === '' ? null : mb_substr($v, 0, $max);
    }

    private function archivo(string $key): ?array
    {
        if (!isset($_FILES[$key]) || $_FILES[$key]['error'] === UPLOAD_ERR_NO_FILE) {
            return null;
        }
        return $_FILES[$key];
    }
}
