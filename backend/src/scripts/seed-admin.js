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
    console.log('Seeding admin user...');
    
    const admin = { name: 'CareConnect Admin', email: 'admin@careconnect.com', password: 'admin123', role: 'admin' };

    const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [admin.email]);
    if (existing.length === 0) {
      const hash = hashPassword(admin.password);
      await connection.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [admin.name, admin.email, hash, admin.role]
      );
      console.log(`Added admin user: ${admin.email}`);
    } else {
      const hash = hashPassword(admin.password);
      await connection.query(
        'UPDATE users SET role = ?, password_hash = ? WHERE email = ?',
        [admin.role, hash, admin.email]
      );
      console.log(`Updated existing user to admin: ${admin.email}`);
    }

    console.log('Admin seeding completed.');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await connection.end();
  }
}

run();
