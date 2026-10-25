-- Penambahan galeri maksimal 3 foto, tanpa menghapus kolom image_url lama.
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE products
SET images = ARRAY[image_url]
WHERE cardinality(images) = 0;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'products_images_max_three'
  ) THEN
    ALTER TABLE products
      ADD CONSTRAINT products_images_max_three CHECK (cardinality(images) <= 3);
  END IF;
END $$;
