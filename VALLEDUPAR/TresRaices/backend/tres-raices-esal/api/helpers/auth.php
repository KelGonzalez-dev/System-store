<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/response.php';

const DURACION_SESION_HORAS = 12;

function generarToken(): string
{
    return bin2hex(random_bytes(32));
}

function hashToken(string $token): string
{
    return hash('sha256', $token);
}

function crearSesion(PDO $pdo, int $usuarioId): string
{
    $token = generarToken();
    $expiraEn = (new DateTime())->modify('+' . DURACION_SESION_HORAS . ' hours')->format('Y-m-d H:i:s');

    $consulta = $pdo->prepare(
        'INSERT INTO sesiones_admin (usuario_id, token_hash, ip_creacion, user_agent, expira_en)
         VALUES (:usuario_id, :token_hash, :ip, :agente, :expira_en)'
    );
    $consulta->execute([
        'usuario_id' => $usuarioId,
        'token_hash' => hashToken($token),
        'ip' => $_SERVER['REMOTE_ADDR'] ?? null,
        'agente' => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255),
        'expira_en' => $expiraEn,
    ]);

    return $token;
}

function obtenerTokenDeCabecera(): ?string
{
    $cabecera = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');

    if (preg_match('/Bearer\s+(.+)/i', $cabecera, $coincidencias)) {
        return trim($coincidencias[1]);
    }

    return null;
}

function requerirSesionAdmin(PDO $pdo): array
{
    $token = obtenerTokenDeCabecera();

    if (!$token) {
        responderError('No se envió un token de autenticación.', 401);
    }

    $consulta = $pdo->prepare(
        'SELECT s.usuario_id, s.expira_en, u.nombre, u.usuario, u.activo
         FROM sesiones_admin s
         INNER JOIN usuarios_admin u ON u.id = s.usuario_id
         WHERE s.token_hash = :token_hash'
    );
    $consulta->execute(['token_hash' => hashToken($token)]);
    $sesion = $consulta->fetch();

    if (!$sesion) {
        responderError('Sesión inválida, inicia sesión de nuevo.', 401);
    }

    if (!$sesion['activo']) {
        responderError('Este usuario está deshabilitado.', 403);
    }

    if (strtotime($sesion['expira_en']) < time()) {
        responderError('La sesión expiró, inicia sesión de nuevo.', 401);
    }

    return [
        'id' => (int) $sesion['usuario_id'],
        'nombre' => $sesion['nombre'],
        'usuario' => $sesion['usuario'],
    ];
}

function cerrarSesionActual(PDO $pdo): void
{
    $token = obtenerTokenDeCabecera();

    if ($token) {
        $consulta = $pdo->prepare('DELETE FROM sesiones_admin WHERE token_hash = :token_hash');
        $consulta->execute(['token_hash' => hashToken($token)]);
    }
}

function limpiarSesionesExpiradas(PDO $pdo): void
{
    $pdo->exec('DELETE FROM sesiones_admin WHERE expira_en < NOW()');
}
