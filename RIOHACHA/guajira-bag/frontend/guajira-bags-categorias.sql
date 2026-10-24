-- ============================================================
--  GUAJIRA BAGS — Categorías del catálogo
--  Ejecutar en phpMyAdmin con la base de datos de la tienda seleccionada
--  (pestaña "SQL" → pegar todo → "Continuar").
--  Se puede ejecutar más de una vez sin problema: no duplica ni borra nada.
-- ============================================================

SET NAMES utf8mb4;

-- 1) Tabla de categorías
CREATE TABLE IF NOT EXISTS `categorias` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `nombre`      VARCHAR(80)  NOT NULL,
  `slug`        VARCHAR(90)  NOT NULL,
  `descripcion` VARCHAR(255) NULL,
  `tallas`      VARCHAR(255) NULL,
  `orden`       INT          NOT NULL DEFAULT 0,
  `activo`      TINYINT(1)   NOT NULL DEFAULT 1,
  `creado_en`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_categorias_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 2) Campos nuevos en productos: categoría y talla
ALTER TABLE `productos` ADD COLUMN IF NOT EXISTS `categoria_id` INT NULL AFTER `codigo`;
ALTER TABLE `productos` ADD COLUMN IF NOT EXISTS `talla` VARCHAR(30) NULL AFTER `categoria_id`;
CREATE INDEX IF NOT EXISTS `idx_productos_categoria` ON `productos` (`activo`, `categoria_id`, `talla`);

-- 3) Las 7 categorías (las tallas van separadas por coma; NULL = sin tallas)
INSERT IGNORE INTO `categorias` (`nombre`, `slug`, `tallas`, `orden`) VALUES
  ('Mochilas recamadas',     'recamadas',     'Mini,Mediana,Grande', 1),
  ('Mochilas doble uso',     'doble-uso',     'Mini,Mediana',        2),
  ('Mochilas primavera',     'primavera',     'Mini,Mediana',        3),
  ('Mochilas tradicionales', 'tradicionales', 'Mini,Mediana,Grande', 4),
  ('Mochilones Wayuu',       'mochilones',    'Mini,Mediana,Grande', 5),
  ('Sobres Wayuu',           'sobres',        NULL,                  6),
  ('Bolsos exclusivos',      'exclusivos',    NULL,                  7);

-- 4) Organizar las mochilas que ya existen
-- Mochilas recamadas · Mini
UPDATE `productos` SET `categoria_id` = (SELECT `id` FROM `categorias` WHERE `slug` = 'recamadas'), `talla` = 'Mini'
 WHERE `id` IN (10, 14, 15, 22, 31, 32);   -- Victoria, Perla Rose, Mini Golden Khaki, Mini perla, Aurelia Bleu, Mochila (flores y mariposas)
-- Mochilas recamadas · Mediana
UPDATE `productos` SET `categoria_id` = (SELECT `id` FROM `categorias` WHERE `slug` = 'recamadas'), `talla` = 'Mediana'
 WHERE `id` IN (13, 35, 36, 38);           -- Valeria, Aurora boreal, Katia, Rose perlas mediana

-- Mochilas doble uso
UPDATE `productos` SET `categoria_id` = (SELECT `id` FROM `categorias` WHERE `slug` = 'doble-uso'), `talla` = 'Mini'
 WHERE `id` = 30;                          -- Amélie doble uso
UPDATE `productos` SET `categoria_id` = (SELECT `id` FROM `categorias` WHERE `slug` = 'doble-uso'), `talla` = 'Mediana'
 WHERE `id` = 34;                          -- Mochila doble uso

-- Mochilas primavera
UPDATE `productos` SET `categoria_id` = (SELECT `id` FROM `categorias` WHERE `slug` = 'primavera'), `talla` = 'Mini'
 WHERE `id` IN (16, 23, 24);               -- Éclat Floral, Floré, Floré Soleil
UPDATE `productos` SET `categoria_id` = (SELECT `id` FROM `categorias` WHERE `slug` = 'primavera'), `talla` = 'Mediana'
 WHERE `id` IN (28, 29);                   -- Jardín imperial, Noir Nude

-- Mochilas tradicionales
UPDATE `productos` SET `categoria_id` = (SELECT `id` FROM `categorias` WHERE `slug` = 'tradicionales'), `talla` = 'Mini'
 WHERE `id` IN (4, 5);                     -- Mochila Wayuu, Mochila Wayuu mini contemporánea
UPDATE `productos` SET `categoria_id` = (SELECT `id` FROM `categorias` WHERE `slug` = 'tradicionales'), `talla` = 'Mediana'
 WHERE `id` = 37;                          -- Tradición Wayuu
UPDATE `productos` SET `categoria_id` = (SELECT `id` FROM `categorias` WHERE `slug` = 'tradicionales'), `talla` = 'Grande'
 WHERE `id` = 17;                          -- Mochila wayuu tradicional

-- Bolsos exclusivos (sin talla)
UPDATE `productos` SET `categoria_id` = (SELECT `id` FROM `categorias` WHERE `slug` = 'exclusivos'), `talla` = NULL
 WHERE `id` IN (18, 19, 20);               -- Isabella, Alessia, Siena

-- 5) Revisión: cuántas mochilas quedaron en cada categoría
SELECT c.`orden`, c.`nombre`, c.`tallas`, COUNT(p.`id`) AS `mochilas`
  FROM `categorias` c LEFT JOIN `productos` p ON p.`categoria_id` = c.`id`
 GROUP BY c.`id` ORDER BY c.`orden`;
