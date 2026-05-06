require('dotenv').config();
const { createDatabasePool } = require('./src/utils/config');

async function seedTourAgent() {
  const pool = createDatabasePool();
  try {
    const res = await pool.query("SELECT * FROM types WHERE title = 'Tour Agent'");
    if (res.rowCount === 0) {
      await pool.query("INSERT INTO types (title, description) VALUES ('Tour Agent', 'Penyedia layanan paket wisata (Open/Private Trip)')");
      console.log("Seeded 'Tour Agent' into types table.");
    } else {
      console.log("'Tour Agent' already exists in types table.");
    }
  } catch (err) {
    console.error("Error seeding:", err.message);
  } finally {
    await pool.end();
  }
}

seedTourAgent();
