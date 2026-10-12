<?php

function obtenerConexion(): PDO
{
    $host = 'localhost';
    $puerto = '3306';
    $baseDatos = 'tres_raices_esal';
    $usuario = 'CAMBIAR_USUARIO';
    $clave = 'CAMBIAR_CLAVE';

    $dsn = "mysql:host={$host};port={$puerto};dbname={$baseDatos};charset=utf8mb4";

    return new PDO($dsn, $usuario, $clave, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
}
