-- Migration: Add `codigo` column to productos (nullable, unique)
ALTER TABLE productos
  ADD COLUMN codigo VARCHAR(80) DEFAULT NULL UNIQUE AFTER nombre;

-- Optional: backfill existing products with generated codes (GB-0001...)
-- Note: run in a safe transaction or in small batches for large tables.
-- Example (MySQL):
-- SET @i = 0;
-- UPDATE productos SET codigo = CONCAT('GB-', LPAD((@i := @i + 1), 4, '0')) WHERE codigo IS NULL ORDER BY id;
