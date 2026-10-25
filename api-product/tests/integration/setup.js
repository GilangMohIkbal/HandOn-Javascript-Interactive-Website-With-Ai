// tests/integration/setup.js
// Resets ONLY a dedicated test database. NEVER use a development/production DB.

import 'dotenv/config';
import pg from 'pg';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, '../../migrations');

const TEST_DB_URL = process.env.DATABASE_TEST_URL;
const LIVE_DB_URL = process.env.DATABASE_LIVE_URL;

if (!TEST_DB_URL || !LIVE_DB_URL) {
  throw new Error(
    'Safe integration test setup requires DATABASE_TEST_URL and the original ' +
      'DATABASE_LIVE_URL from tests/integration/vitest.setup.js.'
  );
}

const live = new URL(LIVE_DB_URL);
const test = new URL(TEST_DB_URL);
const nameFromUrl = (u) => decodeURIComponent(u.pathname).replace(/^\/+/, '').toLowerCase();

if (!nameFromUrl(test).includes('test')) {
  throw new Error('Refusing to drop tables: test database name must contain "test".');
}
if (nameFromUrl(live) === nameFromUrl(test)) {
  throw new Error('Refusing to drop tables: live and test database names must be different.');
}
if (live.host === test.host && live.pathname === test.pathname) {
  throw new Error('Refusing to drop tables: DATABASE_TEST_URL points to the live database.');
}
// Also check that the application pool is routed to the test DB.
if (process.env.DATABASE_URL !== TEST_DB_URL) {
  throw new Error('Refusing integration tests: application DATABASE_URL is not routed to test DB.');
}

export async function getTestPool() {
  return new pg.Pool({ connectionString: TEST_DB_URL, ssl: false, max: 5 });
}

export async function setupTestDatabase() {
  const pool = await getTestPool();
  const client = await pool.connect();
  try {
    await client.query(`
      DROP TABLE IF EXISTS product_variants CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS schema_migrations CASCADE;
    `);

    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const sql = readFileSync(join(migrationsDir, file), 'utf8');
      await client.query(sql);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

export async function cleanDatabase(pool) {
  await pool.query('TRUNCATE TABLE product_variants, products RESTART IDENTITY CASCADE');
}

export { TEST_DB_URL };
