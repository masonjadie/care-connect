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

  console.log('Adding user_id to transportation_bookings...');

  try {
    // Check if user_id column exists
    const [columns] = await connection.query('SHOW COLUMNS FROM transportation_bookings LIKE "user_id"');
    if (columns.length === 0) {
      await connection.query('ALTER TABLE transportation_bookings ADD COLUMN user_id INT, ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL');
      console.log('Column "user_id" added to "transportation_bookings".');
    } else {
      console.log('Column "user_id" already exists.');
    }
  } catch (err) {
    console.error('Failed to update transportation_bookings table:', err.message);
  }

  await connection.end();
  console.log('Migration complete.');
}

run().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
