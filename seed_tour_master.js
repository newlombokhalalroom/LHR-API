const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const pool = new Pool();

async function seedTourData() {
  const tourTypeId = '73344040-6496-4e8b-83c6-e43d66bd67e9';

  const amenities = [
    // Halal Services
    { title: 'Sertifikat Halal', category: 'halal' },
    { title: 'Makanan & Minuman Halal', category: 'halal' },
    { title: 'Perlengkapan Ibadah (Sajadah/Mukena)', category: 'halal' },
    { title: 'Waktu Sholat Terjadwal', category: 'halal' },
    { title: 'Akomodasi Ramah Muslim', category: 'halal' },

    // Inclusions (Regular)
    { title: 'Transportasi Antar Jemput AC', category: 'regular' },
    { title: 'Pemandu Wisata (Tour Guide)', category: 'regular' },
    { title: 'Tiket Masuk Objek Wisata', category: 'regular' },
    { title: 'Makan Sesuai Program', category: 'regular' },
    { title: 'Air Mineral Harian', category: 'regular' },

    // Exclusions (Excluded)
    { title: 'Tiket Pesawat PP', category: 'excluded' },
    { title: 'Pengeluaran Pribadi', category: 'excluded' },
    { title: 'Tipping Guide & Driver', category: 'excluded' },
    { title: 'Asuransi Perjalanan Tambahan', category: 'excluded' },
    { title: 'Dokumentasi Tambahan', category: 'excluded' }
  ];

  const policies = [
    { title: 'Kebijakan Pembatalan', category: 'regular', description: 'Pembatalan 7 hari sebelum keberangkatan dikenakan biaya 50%.' },
    { title: 'Ketentuan Deposit', category: 'regular', description: 'DP minimal 30% dari total harga saat reservasi.' },
    { title: 'Kebijakan Anak-anak', category: 'regular', description: 'Anak di bawah 5 tahun gratis tanpa bed tambahan.' }
  ];

  console.log('Starting seed...');

  try {
    for (const item of amenities) {
      await pool.query(
        'INSERT INTO amenities (id, title, category, type_id, _created_date) VALUES ($1, $2, $3, $4, NOW())',
        [uuidv4(), item.title, item.category, tourTypeId]
      );
    }
    console.log('Amenities seeded successfully.');

    for (const item of policies) {
      await pool.query(
        'INSERT INTO policies (id, title, category, description, type_id, _created_date) VALUES ($1, $2, $3, $4, $5, NOW())',
        [uuidv4(), item.title, item.category, item.description, tourTypeId]
      );
    }
    console.log('Policies seeded successfully.');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await pool.end();
  }
}

seedTourData();
