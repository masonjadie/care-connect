require('dotenv').config();
const mysql = require('mysql2/promise');
const { hashPassword } = require('../utils/password');

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
  });

  try {
    console.log('Seeding demo users...');
    
    const users = [
      { name: 'Free User', email: 'free@careconnect.com', password: 'password', tier: 'free' },
      { name: 'Basic User', email: 'basic@careconnect.com', password: 'password', tier: 'basic' },
      { name: 'Premium User', email: 'premium@careconnect.com', password: 'password', tier: 'premium' },
      { name: 'Family User', email: 'family@careconnect.com', password: 'password', tier: 'family' }
    ];

    for (const u of users) {
      const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [u.email]);
      if (existing.length === 0) {
        const hash = hashPassword(u.password);
        await connection.query(
          'INSERT INTO users (name, email, password_hash, subscription_tier) VALUES (?, ?, ?, ?)',
          [u.name, u.email, hash, u.tier]
        );
        console.log(`Added user: ${u.email}`);
      } else {
        // Update existing user's tier if needed
        await connection.query(
          'UPDATE users SET subscription_tier = ? WHERE email = ?',
          [u.tier, u.email]
        );
        console.log(`Updated user: ${u.email}`);
      }
    }

    console.log('User seeding completed.');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await connection.end();
  }
}

run();
