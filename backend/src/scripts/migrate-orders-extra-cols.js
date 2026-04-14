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

  console.log('Expanding orders table columns...');

  try {
    const columnsToAdd = [
      { name: 'request_time', type: 'VARCHAR(100)' },
      { name: 'request_location', type: 'TEXT' },
      { name: 'request_duration', type: 'VARCHAR(100)' },
      { name: 'request_rate', type: 'VARCHAR(100)' }
    ];

    for (const col of columnsToAdd) {
      const [existing] = await connection.query(`SHOW COLUMNS FROM orders LIKE "${col.name}"`);
      if (existing.length === 0) {
        await connection.query(`ALTER TABLE orders ADD COLUMN ${col.name} ${col.type}`);
        console.log(`Column "${col.name}" added.`);
      }
    }
  } catch (err) {
    console.error('Failed to update orders table:', err.message);
  }

  await connection.end();
  console.log('Migration complete.');
}

run().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
