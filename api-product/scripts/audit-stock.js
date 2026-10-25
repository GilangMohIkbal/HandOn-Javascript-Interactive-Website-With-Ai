// Read-only audit of existing product stock data. Run before and after migration 004.
// Usage: node scripts/audit-stock.js
import 'dotenv/config';
import pg from 'pg';

if (!process.env.DATABASE_URL) {
  console.error('[stock-audit] DATABASE_URL is required');
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

try {
  const { rows: columns } = await pool.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'stock'
  `);
  const hasStock = columns.length > 0;
  const { rows } = await pool.query(`
    SELECT p.id, p.name,
           ${hasStock ? 'p.stock' : 'NULL::BIGINT'} AS stock,
           COUNT(v.id)::INT AS variant_count,
           MIN(v.quantity) AS variant_min,
           MAX(v.quantity) AS variant_max,
           COALESCE(SUM(v.quantity::BIGINT), 0) AS variant_sum
    FROM products p
    LEFT JOIN product_variants v ON v.product_id = p.id
    GROUP BY p.id, p.name ${hasStock ? ', p.stock' : ''}
    ORDER BY p.id
  `);

  console.log(`[stock-audit] products.stock: ${hasStock ? 'EXISTS (after migration)' : 'NOT YET (before migration)'}`);
  console.log('[stock-audit] Read-only report; no database data is changed.');
  for (const p of rows) {
    const count = Number(p.variant_count);
    const distinctEqual = count > 0 && Number(p.variant_min) === Number(p.variant_max);
    const predicted = count === 0 ? 0 : (distinctEqual ? Number(p.variant_max) : Number(p.variant_sum));
    const policy = count === 0 ? 'no variants -> 0' : distinctEqual
      ? 'equal values -> use one value (duplicate-total assumption)'
      : 'different values -> sum (preserve old API total)';
    console.log(`  #${p.id} ${p.name}: variants=${count}, legacy min=${p.variant_min ?? '-'}, max=${p.variant_max ?? '-'}, sum=${p.variant_sum}; ${hasStock ? `stock=${p.stock}` : `migration would set stock=${predicted}`}`);
    console.log(`     policy: ${policy}`);
    if (hasStock && Number(p.stock) !== predicted) {
      console.log('     NOTE: stock differs from legacy inference (normal after editing stock via API).');
    }
  }
  console.log('[stock-audit] IMPORTANT: If equal quantities represent independent stock per variant, not duplicates, manually determine the correct product total before migration.');
} catch (error) {
  console.error('[stock-audit] Failed:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
