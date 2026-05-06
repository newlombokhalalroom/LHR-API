const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool();
async function check() {
  const am = await pool.query(`
    SELECT a.id, a.title, a.category, t.title as type
    FROM amenities a
    JOIN types t ON a.type_id = t.id
    WHERE t.title ILIKE '%tour%' OR t.title ILIKE '%travel%'
  `);
  console.log("Amenities count:", am.rows.length);
  
  const pol = await pool.query(`
    SELECT p.id, p.title, p.category, t.title as type
    FROM policies p
    JOIN types t ON p.type_id = t.id
    WHERE t.title ILIKE '%tour%' OR t.title ILIKE '%travel%'
  `);
  console.log("Policies count:", pol.rows.length);
  pool.end();
}
check().catch(console.error);
