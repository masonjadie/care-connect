require('dotenv').config();

const mysql = require('mysql2/promise');

async function run() {
  const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required DB config: ${missing.join(', ')}`);
  }

  const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

  const adminConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port
  });

  await adminConnection.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await adminConnection.end();

  const dbConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port,
    multipleStatements: true
  });

  await dbConnection.query(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      date VARCHAR(30) NOT NULL,
      time VARCHAR(30) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      relation VARCHAR(255) NOT NULL,
      phone VARCHAR(80) NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS reminders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      time VARCHAR(30) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS emergency_alerts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      message VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL DEFAULT '',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS caregivers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      specialty VARCHAR(255) NOT NULL,
      experience_years INT NOT NULL,
      rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
      availability VARCHAR(255) NOT NULL,
      phone VARCHAR(80) NOT NULL,
      bio TEXT NOT NULL,
      certification VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await dbConnection.query(`
    INSERT INTO appointments (title, date, time)
    SELECT * FROM (
      SELECT 'Doctor Visit' AS title, '2026-03-10' AS date, '10:00 AM' AS time
    ) AS seed
    WHERE NOT EXISTS (SELECT 1 FROM appointments);

    INSERT INTO contacts (name, relation, phone)
    SELECT * FROM (
      SELECT 'Emma' AS name, 'Daughter' AS relation, '(555) 012-3456' AS phone
      UNION ALL
      SELECT 'John', 'Son', '(555) 987-6543'
      UNION ALL
      SELECT 'Dr. Smith', 'Doctor', '(555) 444-2222'
    ) AS seed
    WHERE NOT EXISTS (SELECT 1 FROM contacts);

    INSERT INTO reminders (title, time)
    SELECT * FROM (
      SELECT 'Take Blood Pressure Medication' AS title, '8:00 AM' AS time
      UNION ALL
      SELECT 'Exercise: Stretching Routine', '3:00 PM'
    ) AS seed
    WHERE NOT EXISTS (SELECT 1 FROM reminders);

    INSERT INTO services (title, description)
    SELECT * FROM (
      SELECT 'Professional Caregiving' AS title, 'Personalized in-home support and medical care.' AS description
      UNION ALL
      SELECT 'Reliable Transportation', 'Accessible rides for appointments and errands.'
      UNION ALL
      SELECT 'Nutritious Meal Delivery', 'Healthy, diet-aware meals delivered to your door.'
      UNION ALL
      SELECT 'Medication Management', 'Timely reminders and refill support.'
    ) AS seed
    WHERE NOT EXISTS (SELECT 1 FROM services);

    INSERT INTO caregivers (name, specialty, experience_years, rating, availability, phone, bio, certification, location, email)
    SELECT * FROM (
      SELECT
        'Nadine Brown' AS name,
        'Dementia & Memory Care' AS specialty,
        8 AS experience_years,
        4.9 AS rating,
        'Mon-Fri, 8:00 AM - 4:00 PM' AS availability,
        '(555) 201-1092' AS phone,
        'Compassionate in-home support focused on memory safety and daily living assistance.' AS bio,
        'Certified Dementia Practitioner' AS certification,
        'Kingston' AS location,
        'nadine.brown@careconnect.com' AS email
      UNION ALL
      SELECT
        'Michael Grant',
        'Post-Surgery Home Support',
        6,
        4.8,
        'Daily, 9:00 AM - 6:00 PM',
        '(555) 406-7781',
        'Recovery-focused care including mobility support, hygiene assistance, and medication reminders.',
        'Home Health Aide (HHA)',
        'Spanish Town',
        'michael.grant@careconnect.com'
      UNION ALL
      SELECT
        'Althea Morgan',
        'Medication & Mobility Assistance',
        10,
        5.0,
        'Mon-Sat, 7:00 AM - 3:00 PM',
        '(555) 884-3407',
        'Experienced caregiver specializing in fall prevention and safe medication management.',
        'Licensed Practical Nurse (LPN)',
        'Portmore',
        'althea.morgan@careconnect.com'
    ) AS seed
    WHERE NOT EXISTS (SELECT 1 FROM caregivers);
  `);

  await dbConnection.end();

  console.log(`Database "${process.env.DB_NAME}" is ready.`);
}

run().catch((error) => {
  console.error('Database initialization failed:', error.message);
  process.exit(1);
});
