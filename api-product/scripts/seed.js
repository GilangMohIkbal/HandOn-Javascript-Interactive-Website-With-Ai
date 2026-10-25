// scripts/seed.js
// Seed data minimal: satu produk dengan variasi valid untuk development.

import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Cek apakah sudah ada data seed
    const { rows: existing } = await client.query(
      "SELECT id FROM products WHERE name = 'Kaos Katun Polos' LIMIT 1",
    );

    if (existing.length > 0) {
      console.log('[seed] Seed data already exists. Skipping.');
      await client.query('ROLLBACK');
      return;
    }

    // Insert produk pertama
    const { rows: [product1] } = await client.query(
      `INSERT INTO products (name, price, image_url, description, stock)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        'Kaos Katun Polos',
        150000,
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=85',
        'Kaos katun nyaman untuk penggunaan sehari hari.',
        30, // jumlah stok produk (total), bukan dikali 3 varian
      ],
    );

    const variants1 = [
      { type: 'size', value: 'S' },
      { type: 'size', value: 'M' },
      { type: 'size', value: 'L' },
    ];

    for (const v of variants1) {
      await client.query(
        `INSERT INTO product_variants (product_id, variant_type, value, quantity)
         VALUES ($1, $2, $3, 0)`,
        [product1.id, v.type, v.value],
      );
    }

    // Insert produk kedua
    const { rows: [product2] } = await client.query(
      `INSERT INTO products (name, price, image_url, description, stock)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        'Sepatu Sneaker Casual',
        450000,
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85',
        'Sepatu sneaker casual cocok untuk sehari hari.',
        40, // jumlah stok produk (total), bukan dikali 3 varian
      ],
    );

    const variants2 = [
      { type: 'color', value: 'Merah' },
      { type: 'color', value: 'Biru' },
      { type: 'color', value: 'Hitam' },
    ];

    for (const v of variants2) {
      await client.query(
        `INSERT INTO product_variants (product_id, variant_type, value, quantity)
         VALUES ($1, $2, $3, 0)`,
        [product2.id, v.type, v.value],
      );
    }

    // Foto tambahan pada produk contoh. Migrasi 005 harus sudah diterapkan.
    await client.query('UPDATE products SET images = $1 WHERE id = $2', [["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=85"], product1.id]);
    await client.query('UPDATE products SET images = $1 WHERE id = $2', [["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=85"], product2.id]);

    await client.query('COMMIT');
    console.log('[seed] Seed data inserted successfully.');
    console.log(`[seed] Product 1 ID: ${product1.id}`);
    console.log(`[seed] Product 2 ID: ${product2.id}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[seed] Failed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('[seed] Fatal error:', err.message);
  process.exit(1);
});
