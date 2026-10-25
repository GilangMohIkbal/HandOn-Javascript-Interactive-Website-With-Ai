-- Day 15: Stock belongs to each product, not to each product variant.
-- Safe for databases that already ran migration 005 (multiple images).
-- The historical product_variants.quantity is NOT removed/overwritten.
--
-- Backfill heuristic for legacy rows (the original schema does not say whether
-- quantities represent separate stock pools or a duplicated product total):
--   no variants                     -> stock = 0
--   all legacy quantities identical -> stock = that number (avoid multiplying)
--   legacy quantities differ        -> stock = SUM(quantities) (preserve prior API total)
-- Inspect the read-only audit report BEFORE running this migration.

ALTER TABLE products ADD COLUMN IF NOT EXISTS stock BIGINT;

WITH legacy AS (
  SELECT product_id,
         COUNT(*) AS variant_count,
         MIN(quantity) AS min_quantity,
         MAX(quantity) AS max_quantity,
         SUM(quantity::BIGINT) AS sum_quantity
  FROM product_variants
  GROUP BY product_id
)
UPDATE products AS p
SET stock = CASE
  WHEN legacy.min_quantity = legacy.max_quantity THEN legacy.max_quantity::BIGINT
  ELSE legacy.sum_quantity
END
FROM legacy
WHERE p.id = legacy.product_id AND p.stock IS NULL;

UPDATE products SET stock = 0 WHERE stock IS NULL;

ALTER TABLE products ALTER COLUMN stock SET DEFAULT 0;
ALTER TABLE products ALTER COLUMN stock SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'products'::regclass AND conname = 'products_stock_non_negative_safe'
  ) THEN
    ALTER TABLE products ADD CONSTRAINT products_stock_non_negative_safe
      CHECK (stock >= 0 AND stock <= 9007199254740991);
  END IF;
END $$;

-- Historical product_variants.quantity is intentionally retained for audit.
-- New writes set it to 0; products.stock is the authoritative quantity.
COMMENT ON COLUMN products.stock IS
  'Total product stock, exposed as variants.quantity in the existing API';
COMMENT ON COLUMN product_variants.quantity IS
  'Legacy per-variant stock (historical only). New writes use 0; do not sum for API stock.';
