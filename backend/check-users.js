require('dotenv').config();
const { getPool } = require('./db');

async function check() {
  try {
    const pool = await getPool();
    const [rows] = await pool.execute('SELECT id, email, role FROM users');
    console.log('Users in DB:', rows);
    process.exit(0);
  } catch (err) {
    console.error('Check failed:', err.message);
    process.exit(1);
  }
}
check();
