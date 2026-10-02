CREATE DATABASE IF NOT EXISTS tres_raices_esal
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE tres_raices_esal;

CREATE TABLE usuarios_admin (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  usuario VARCHAR(60) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  intentos_fallidos TINYINT UNSIGNED NOT NULL DEFAULT 0,
  bloqueado_hasta DATETIME NULL,
  ultimo_login DATETIME NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE sesiones_admin (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  ip_creacion VARCHAR(45) NULL,
  user_agent VARCHAR(255) NULL,
  expira_en DATETIME NOT NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sesiones_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios_admin (id) ON DELETE CASCADE,
  INDEX idx_sesiones_expira (expira_en)
) ENGINE=InnoDB;

CREATE TABLE categorias_documentos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(80) NOT NULL UNIQUE,
  nombre VARCHAR(150) NOT NULL,
  orden SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  activa TINYINT(1) NOT NULL DEFAULT 1,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE documentos_esal (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  categoria_id INT UNSIGNED NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  descripcion VARCHAR(500) NULL,
  nombre_original VARCHAR(255) NOT NULL,
  nombre_archivo VARCHAR(255) NOT NULL UNIQUE,
  tipo_mime VARCHAR(120) NOT NULL,
  tamano_bytes INT UNSIGNED NOT NULL,
  visible TINYINT(1) NOT NULL DEFAULT 1,
  orden SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  descargas INT UNSIGNED NOT NULL DEFAULT 0,
  subido_por INT UNSIGNED NOT NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_documentos_categoria FOREIGN KEY (categoria_id)
    REFERENCES categorias_documentos (id) ON DELETE RESTRICT,
  CONSTRAINT fk_documentos_usuario FOREIGN KEY (subido_por)
    REFERENCES usuarios_admin (id) ON DELETE RESTRICT,
  INDEX idx_documentos_categoria (categoria_id, visible, orden)
) ENGINE=InnoDB;

INSERT INTO categorias_documentos (slug, nombre, orden) VALUES
  ('acta-constitucion', 'Acta de Constitución', 1),
  ('estatutos', 'Estatutos', 2),
  ('acta-asamblea', 'Acta de Asamblea', 3),
  ('camara-comercio', 'Cámara de Comercio', 4),
  ('certificado-antecedentes', 'Certificado de Antecedentes Legales', 5),
  ('certificado-rte', 'Certificado de Cumplimiento Requisitos RTE', 6),
  ('certificado-ingresos', 'Certificado de Ingresos', 7),
  ('estado-financiero', 'Estado Financiero', 8),
  ('estado-resultados', 'Estado de Resultados', 9);
