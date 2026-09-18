<?php

namespace GuajiraBags\Services;

use GuajiraBags\Helpers\JwtHelper;
use GuajiraBags\Helpers\Response;
use PDO;

class AuthService
{
    public function __construct(
        private PDO $db,
        private array $jwtConfig
    ) {}

    /** @return array{0: bool, 1: string, 2: ?array} */
    public function register(array $req): array
    {
        $username = trim($req['username'] ?? '');
        $email    = trim($req['email'] ?? '');
        $password = $req['password'] ?? '';

        if (strlen($username) < 3 || strlen($username) > 60) {
            return [false, 'El nombre de usuario debe tener entre 3 y 60 caracteres', null];
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [false, 'Correo electrónico inválido', null];
        }
        if (strlen($password) < 8) {
            return [false, 'La contraseña debe tener al menos 8 caracteres', null];
        }

        $stmt = $this->db->prepare('SELECT id FROM usuarios WHERE username = ?');
        $stmt->execute([$username]);
        if ($stmt->fetch()) {
            return [false, 'El nombre de usuario ya existe', null];
        }

        $stmt = $this->db->prepare('SELECT id FROM usuarios WHERE email = ?');
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            return [false, 'El correo ya está registrado', null];
        }

        $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
        $stmt = $this->db->prepare(
            'INSERT INTO usuarios (username, email, password_hash, rol) VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([$username, $email, $hash, 'admin']);
        $id = (int) $this->db->lastInsertId();

        return [true, '', $this->generarToken($id, $username, $email, 'admin')];
    }

    /** @return array{0: bool, 1: string, 2: ?array} */
    public function login(array $req): array
    {
        $username = trim($req['username'] ?? '');
        $password = $req['password'] ?? '';

        if ($username === '' || $password === '') {
            return [false, 'Credenciales incorrectas', null];
        }

        $stmt = $this->db->prepare(
            'SELECT id, username, email, password_hash, rol FROM usuarios WHERE username = ? AND activo = 1'
        );
        $stmt->execute([$username]);
        $usuario = $stmt->fetch();

        if (!$usuario || !password_verify($password, $usuario['password_hash'])) {
            return [false, 'Credenciales incorrectas', null];
        }

        return [true, '', $this->generarToken(
            (int) $usuario['id'],
            $usuario['username'],
            $usuario['email'],
            $usuario['rol']
        )];
    }

    private function generarToken(int $id, string $username, string $email, string $rol): array
    {
        $minutes = (int) ($this->jwtConfig['expires_in_minutes'] ?? 1440);
        $expira  = (new \DateTimeImmutable('now', new \DateTimeZone('UTC')))
            ->modify("+{$minutes} minutes");

        $payload = [
            'sub'      => (string) $id,
            'email'    => $email,
            'username' => $username,
            'role'     => $rol,
            'jti'      => bin2hex(random_bytes(16)),
            'iss'      => $this->jwtConfig['issuer'],
            'aud'      => $this->jwtConfig['audience'],
            'iat'      => time(),
            'exp'      => $expira->getTimestamp(),
        ];

        $token = JwtHelper::encode($payload, $this->jwtConfig['key']);

        return [
            'token'    => $token,
            'username' => $username,
            'email'    => $email,
            'rol'      => $rol,
            'expira'   => $expira->format('Y-m-d\TH:i:s\Z'),
        ];
    }
}
