// Updates only seed placeholder images. Leaves user-edited products untouched.
// Run AFTER npm run migrate, from api-product/.
import 'dotenv/config';
import pg from 'pg';

const examplePhotos = [
  { name: 'Kaos Katun Polos', images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=85"] },
  { name: 'Sepatu Sneaker Casual', images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=85"] },
];

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});
try {
  for (const { name, images } of examplePhotos) {
    const { rowCount } = await pool.query(
      `UPDATE products
       SET image_url = $1, images = $2
       WHERE name = $3 AND image_url LIKE 'https://example.com/%'`,
      [images[0], images, name],
    );
    console.log(`[demo-images] ${name}: ${rowCount ? 'updated' : 'skipped (custom URL or missing)'}`);
  }
} finally {
  await pool.end();
}
