const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const pool = new Pool();

async function seedDuration() {
  const tourTypeId = '73344040-6496-4e8b-83c6-e43d66bd67e9';
  
  try {
    // 1. Create Category "Package Duration"
    const catId = uuidv4();
    await pool.query(
      'INSERT INTO detail_categories (id, title, _created_date) VALUES ($1, $2, NOW())',
      [catId, 'Package Duration']
    );
    console.log('Category "Package Duration" created.');

    // 2. Add "Days" detail
    await pool.query(
      'INSERT INTO details (id, category_id, title, type_id, _created_date) VALUES ($1, $2, $3, $4, NOW())',
      [uuidv4(), catId, 'Days', tourTypeId]
    );
    console.log('Detail "Days" added.');

    // 3. Add "Nights" detail
    await pool.query(
      'INSERT INTO details (id, category_id, title, type_id, _created_date) VALUES ($1, $2, $3, $4, NOW())',
      [uuidv4(), catId, 'Nights', tourTypeId]
    );
    console.log('Detail "Nights" added.');

  } catch (error) {
    console.error('Error seeding duration:', error);
  } finally {
    await pool.end();
  }
}

seedDuration();
