require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

async function run() {
  try {
    await pool.query('ALTER TABLE order_items ADD COLUMN IF NOT EXISTS participants TEXT');
    console.log('Column participants added to order_items');
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
}

run();
