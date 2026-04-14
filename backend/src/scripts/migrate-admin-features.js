require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    multipleStatements: true
  });

  console.log('Migrating database for admin features...');

  // 1. Add verified column to caregivers
  try {
    await connection.query(`ALTER TABLE caregivers ADD COLUMN verified TINYINT(1) DEFAULT 0`);
    console.log('Added verified column to caregivers.');
  } catch (err) {
    if (err.message.includes('Duplicate column name')) {
      console.log('Column "verified" already exists in caregivers.');
    } else {
      console.error('Failed to add column to caregivers:', err.message);
    }
  }

  // 2. Create pet_specialists table
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pet_specialists (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        specialty VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        experience TEXT NOT NULL,
        phone VARCHAR(80),
        verified TINYINT(1) DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table "pet_specialists" is ready.');
  } catch (err) {
    console.error('Failed to create pet_specialists table:', err.message);
  }

  // 3. Add prompt fields to orders
  const columnsToAdd = [
    { name: 'request_time', type: 'VARCHAR(100)' },
    { name: 'request_location', type: 'TEXT' },
    { name: 'request_duration', type: 'VARCHAR(100)' },
    { name: 'request_rate', type: 'VARCHAR(100)' }
  ];

  for (const col of columnsToAdd) {
    try {
      await connection.query(`ALTER TABLE orders ADD COLUMN ${col.name} ${col.type}`);
      console.log(`Added column "${col.name}" to orders.`);
    } catch (err) {
      if (err.message.includes('Duplicate column name')) {
        console.log(`Column "${col.name}" already exists in orders.`);
      } else {
        console.error(`Failed to add column "${col.name}" to orders:`, err.message);
      }
    }
  }

  console.log('Migration process finished.');
}

run();
