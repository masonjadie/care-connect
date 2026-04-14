const express = require('express');
const { getPool } = require('../../db');
const { hashPassword } = require('../utils/password');

const router = express.Router();

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

router.get('/', async (req, res, next) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      `SELECT id, name, specialty, experience_years AS experienceYears, rating, availability, 
              phone, bio, certification, location, email
       FROM caregivers
       ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get('/verified', async (req, res, next) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      `SELECT id, name, specialty, experience_years AS experienceYears, rating, availability, 
              phone, bio, certification, location, email
       FROM caregivers WHERE verified = 1
       ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const specialty = typeof req.body.specialty === 'string' ? req.body.specialty.trim() : '';
    const experienceYears = Number(req.body.experienceYears);
    const availability = typeof req.body.availability === 'string' ? req.body.availability.trim() : '';
    const phone = typeof req.body.phone === 'string' ? req.body.phone.trim() : '';
    const bio = typeof req.body.bio === 'string' ? req.body.bio.trim() : '';
    const certification = typeof req.body.certification === 'string' ? req.body.certification.trim() : '';
    const location = typeof req.body.location === 'string' ? req.body.location.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!name || !specialty || !availability || !phone || !bio || !certification || !location) {
      return res.status(400).json({ error: 'All caregiver profile fields are required.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    if (!Number.isFinite(experienceYears) || experienceYears < 0 || experienceYears > 60) {
      return res.status(400).json({ error: 'Experience years must be between 0 and 60.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required.' });
    }

    const pool = await getPool();
    const [existing] = await pool.execute('SELECT id FROM caregivers WHERE email = ? LIMIT 1', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'This email is already registered as a caregiver.' });
    }
    const [existingUser] = await pool.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'This email is already registered as a user.' });
    }

    const passwordHash = hashPassword(password);

    // Create user account so they can log in
    await pool.execute(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, passwordHash]
    );

    const [result] = await pool.execute(
      `INSERT INTO caregivers
        (name, specialty, experience_years, rating, availability, phone, bio, certification, location, email)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, specialty, experienceYears, 0, availability, phone, bio, certification, location, email]
    );

    return res.status(201).json({
      message: 'Caregiver registration submitted successfully. You can now log in.',
      caregiver: {
        id: result.insertId,
        name,
        specialty,
        experienceYears,
        rating: 0,
        availability,
        phone,
        bio,
        certification,
        location,
        email
      }
    });
  } catch (error) {
    next(error);
  }
});

// Verify a caregiver (admin only)
router.patch('/:id/verify', async (req, res, next) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    await pool.execute('UPDATE caregivers SET verified = 1 WHERE id = ?', [id]);
    res.json({ message: 'Caregiver verified successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
