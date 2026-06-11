# System-store
Aqui estan todos los sistemas que he vendido y que tengo para vender, que ademas serviran de evidencia avalando toda la experiencia que tengo en la programacion.
Aqui colocare el codigo de la base de datos para guajira-bags:

-- ============================================================
--  GUAJIRA BAGS — PostgreSQL Schema
--  Base de datos para gestión de productos, galería y usuarios
-- ============================================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Tabla: usuarios ──────────────────────────────────────────
CREATE TABLE usuarios (
    id          SERIAL PRIMARY KEY,
    username    VARCHAR(60)  NOT NULL UNIQUE,
    email       VARCHAR(120) NOT NULL UNIQUE,
    password_hash TEXT       NOT NULL,          -- BCrypt hash
    rol         VARCHAR(20)  NOT NULL DEFAULT 'admin',
    activo      BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Tabla: productos ─────────────────────────────────────────
CREATE TABLE productos (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(200) NOT NULL,
    descripcion TEXT         NOT NULL,
    descripcion_larga TEXT,                      -- detalle completo (modal)
    precio      NUMERIC(12,2) NOT NULL CHECK (precio >= 0),
    imagen_url  TEXT,                            -- imagen principal
    activo      BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Imágenes adicionales de un producto (galería interna)
CREATE TABLE producto_imagenes (
    id          SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    url         TEXT    NOT NULL,
    orden       SMALLINT NOT NULL DEFAULT 0
);

-- ── Tabla: galeria ───────────────────────────────────────────
CREATE TABLE galeria (
    id          SERIAL PRIMARY KEY,
    url         TEXT         NOT NULL,
    caption     VARCHAR(300),
    orden       SMALLINT     NOT NULL DEFAULT 0,
    activo      BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Índices útiles ───────────────────────────────────────────
CREATE INDEX idx_productos_activo    ON productos(activo);
CREATE INDEX idx_galeria_activo      ON galeria(activo);
CREATE INDEX idx_galeria_orden       ON galeria(orden);
CREATE INDEX idx_prod_imagenes_prod  ON producto_imagenes(producto_id);

-- ── Trigger: actualizar "actualizado_en" automáticamente ─────
CREATE OR REPLACE FUNCTION set_actualizado_en()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_productos_upd
    BEFORE UPDATE ON productos
    FOR EACH ROW EXECUTE FUNCTION set_actualizado_en();

CREATE TRIGGER trg_usuarios_upd
    BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION set_actualizado_en();

-- ── Usuario admin inicial (password: Admin123!) ───────────────
-- Hash BCrypt generado con cost=12 para "Admin123!"
INSERT INTO usuarios (username, email, password_hash, rol)
VALUES (
    'admin',
    'admin@guajirabags.com',
    '$2a$12$placeholder_reemplazar_con_hash_real',
    'admin'
);

-- ============================================================
--  FIN DEL SCRIPT
-- ============================================================
