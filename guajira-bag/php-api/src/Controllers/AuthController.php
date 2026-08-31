<?php

namespace GuajiraBags\Controllers;

use GuajiraBags\Helpers\Response;
use GuajiraBags\Services\AuthService;

class AuthController
{
    public function __construct(private AuthService $auth) {}

    public function register(): void
    {
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        [$ok, $error, $response] = $this->auth->register($body);

        if (!$ok) {
            Response::error($error, 400);
        }
        Response::json($response);
    }

    public function login(): void
    {
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        [$ok, $error, $response] = $this->auth->login($body);

        if (!$ok) {
            Response::error($error, 401);
        }
        Response::json($response);
    }
}
