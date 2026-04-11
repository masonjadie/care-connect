require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
  });

  try {
    console.log('Adding trial_ends_at column to users table...');
    await connection.query("ALTER TABLE users ADD COLUMN trial_ends_at DATETIME").catch(err => {
      if (err.code === 'ER_DUP_COLUMN_NAME') console.log('trial_ends_at already exists');
      else throw err;
    });

    // Set trial_ends_at for existing users to 7 days from now (as a gift?) 
    // or just leave it null. I'll set it to 7 days from now to be safe.
    await connection.query("UPDATE users SET trial_ends_at = DATE_ADD(NOW(), INTERVAL 7 DAY) WHERE trial_ends_at IS NULL");
    
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await connection.end();
  }
}

run();
