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
    console.log('Updating subscription_tier default to NULL...');
    await connection.query("ALTER TABLE users ALTER COLUMN subscription_tier SET DEFAULT NULL");
    
    // Also, if any users were created with 'free' by mistake during my testing, 
    // we might want to clear them, but let's skip for safety.
    
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await connection.end();
  }
}

run();
