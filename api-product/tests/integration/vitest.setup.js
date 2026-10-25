// tests/integration/vitest.setup.js
// Vitest global setup: validate test DB against the ORIGINAL live DB URL
// before routing any application database connections to the test database.
// Keep this setup in vitest.config.js globalSetup.

import 'dotenv/config';

function dbName(dbUrl) {
  return decodeURIComponent(new URL(dbUrl).pathname).replace(/^\/+/, '').toLowerCase();
}

export async function setup() {
  const liveUrl = process.env.DATABASE_URL;
  const testUrl = process.env.DATABASE_TEST_URL;

  if (!liveUrl || !testUrl) {
    throw new Error('Both DATABASE_URL and DATABASE_TEST_URL must be configured.');
  }

  const live = new URL(liveUrl);
  const test = new URL(testUrl);
  const liveName = dbName(liveUrl);
  const testName = dbName(testUrl);

  // A separate, explicitly named testing database is mandatory.
  if (!testName.includes('test')) {
    throw new Error('DATABASE_TEST_URL database name must contain "test".');
  }
  if (testName === liveName) {
    throw new Error('Refusing to run tests: the live and test database names must differ.');
  }
  if (live.host === test.host && live.pathname === test.pathname) {
    throw new Error('Refusing to run tests: DATABASE_TEST_URL is the live database.');
  }

  // Save the original DB URL, which the test setup needs for its safety check.
  process.env.DATABASE_LIVE_URL = liveUrl;

  // Redirect application database access BEFORE test modules import src/config/env.js.
  process.env.DATABASE_URL = testUrl;
}
