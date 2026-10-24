-- ============================================================
--  GUAJIRA BAGS — Esquema SQL (MySQL / MariaDB)
--  Base de datos para gestión de productos, galería y usuarios
-- ============================================================

CREATE DATABASE IF NOT EXISTS guajira_bags
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE guajira_bags;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS resenas;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS producto_imagenes;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS galeria;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    username       VARCHAR(60)  NOT NULL UNIQUE,
    email          VARCHAR(120) NOT NULL UNIQUE,
    password_hash  TEXT         NOT NULL,
    rol            VARCHAR(20)  NOT NULL DEFAULT 'admin',
    activo         TINYINT(1)   NOT NULL DEFAULT 1,
    creado_en      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE productos (
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    codigo             VARCHAR(60),
    categoria_id       INT,
    talla              VARCHAR(30),
    nombre             VARCHAR(200) NOT NULL,
    descripcion        TEXT         NOT NULL,
    descripcion_larga  TEXT,
    precio             DECIMAL(12,2) NOT NULL CHECK (precio >= 0),
    imagen_url         TEXT,
    activo             TINYINT(1)   NOT NULL DEFAULT 1,
    creado_en          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE producto_imagenes (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    producto_id  INT NOT NULL,
    url          TEXT NOT NULL,
    orden        SMALLINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_prodimg_producto
        FOREIGN KEY (producto_id) REFERENCES productos(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE galeria (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    url         TEXT         NOT NULL,
    caption     VARCHAR(300),
    orden       SMALLINT     NOT NULL DEFAULT 0,
    activo      TINYINT(1)   NOT NULL DEFAULT 1,
    creado_en   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE resenas (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    producto_id    INT          NULL,
    nombre         VARCHAR(80)  NOT NULL,
    ciudad         VARCHAR(80),
    calificacion   TINYINT      NOT NULL,
    comentario     TEXT         NOT NULL,
    visible        TINYINT(1)   NOT NULL DEFAULT 1,
    creado_en      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_productos_activo_fecha ON productos(activo, creado_en);
CREATE INDEX idx_prodimg_orden          ON producto_imagenes(producto_id, orden);
CREATE INDEX idx_galeria_activo_orden   ON galeria(activo, orden);
CREATE INDEX idx_resenas_producto       ON resenas(producto_id, visible, creado_en);

-- Usuario admin inicial — ejecuta: php scripts/setup-admin.php
INSERT INTO usuarios (username, email, password_hash, rol)
VALUES (
    'admin',
    'admin@guajirabags.com',
    '$2y$12$placeholder_ejecutar_setup_admin_php',
    'admin'
);

SET FOREIGN_KEY_CHECKS = 1;

-- Categorías del catálogo (las tallas van separadas por coma)
CREATE TABLE categorias (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(80)  NOT NULL,
    slug        VARCHAR(90)  NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    tallas      VARCHAR(255),
    orden       INT          NOT NULL DEFAULT 0,
    activo      TINYINT(1)   NOT NULL DEFAULT 1,
    creado_en   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_productos_categoria ON productos(activo, categoria_id, talla);
