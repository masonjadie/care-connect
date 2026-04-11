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
    console.log('Attempting to add subscription_tier...');
    await connection.query("ALTER TABLE users ADD COLUMN subscription_tier VARCHAR(50) DEFAULT 'free'").catch(err => {
      if (err.code === 'ER_DUP_COLUMN_NAME') console.log('subscription_tier already exists');
      else throw err;
    });

    console.log('Attempting to add subscription_status...');
    await connection.query("ALTER TABLE users ADD COLUMN subscription_status VARCHAR(50) DEFAULT 'active'").catch(err => {
      if (err.code === 'ER_DUP_COLUMN_NAME') console.log('subscription_status already exists');
      else throw err;
    });

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await connection.end();
  }
}

run();
