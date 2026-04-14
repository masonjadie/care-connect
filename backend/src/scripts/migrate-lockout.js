require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || process.env.MYSQLHOST,
    user: process.env.DB_USER || process.env.MYSQLUSER,
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
    database: process.env.DB_NAME || process.env.MYSQLDATABASE,
    port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306)
  });

  console.log('Adding lockout columns to users table...');

  try {
    const columnsToAdd = [
      { name: 'failed_login_attempts', type: 'INT DEFAULT 0' },
      { name: 'lockout_until', type: 'DATETIME' }
    ];

    for (const col of columnsToAdd) {
      const [existing] = await connection.query(`SHOW COLUMNS FROM users LIKE "${col.name}"`);
      if (existing.length === 0) {
        await connection.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
        console.log(`Column "${col.name}" added.`);
      }
    }
  } catch (err) {
    console.error('Failed to update users table:', err.message);
  }

  await connection.end();
  console.log('Migration complete.');
}

run().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
