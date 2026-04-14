require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || process.env.MYSQLHOST,
    user: process.env.DB_USER || process.env.MYSQLUSER,
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
    database: process.env.DB_NAME || process.env.MYSQLDATABASE,
    port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
    multipleStatements: true
  });

  console.log('Creating transportation_bookings table...');

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS transportation_bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        passenger_name VARCHAR(255) NOT NULL DEFAULT 'Guest',
        pickup TEXT NOT NULL,
        dropoff TEXT NOT NULL,
        date VARCHAR(30) NOT NULL,
        time VARCHAR(30) NOT NULL,
        vehicle_type VARCHAR(80) NOT NULL DEFAULT 'standard',
        trip_type VARCHAR(40) NOT NULL DEFAULT 'one-way',
        notes TEXT,
        status VARCHAR(40) NOT NULL DEFAULT 'booked',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table "transportation_bookings" is ready.');
  } catch (err) {
    console.error('Failed to create transportation_bookings table:', err.message);
  }

  await connection.end();
  console.log('Migration complete.');
}

run().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
