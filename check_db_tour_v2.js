const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool();
async function check() {
  const pol = await pool.query("SELECT * FROM policies WHERE type_id = '73344040-6496-4e8b-83c6-e43d66bd67e9'");
  console.log("Tour Policies:", pol.rows);
  pool.end();
}
check().catch(console.error);
