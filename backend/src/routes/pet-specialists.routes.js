const express = require('express');
const { getPool } = require('../../db');

const router = express.Router();

// Get all specialists (for admin)
router.get('/', async (req, res, next) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM pet_specialists ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Register as a pet specialist
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, specialty, location, experience, phone } = req.body;

    if (!name || !email || !specialty || !location || !experience) {
      return res.status(400).json({ error: 'Missing required registration fields.' });
    }

    const pool = await getPool();
    const [result] = await pool.execute(
      `INSERT INTO pet_specialists (name, email, specialty, location, experience, phone) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, specialty, location, experience, phone || '']
    );

    res.status(201).json({
      message: 'Specialist registration received. An admin will review your profile.',
      id: result.insertId
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'This email is already registered.' });
    }
    next(error);
  }
});

// Get only verified specialists (for public pet-care page and admin)
router.get('/verified', async (req, res, next) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      `SELECT id, name, email, specialty, location, experience, phone, created_at
       FROM pet_specialists WHERE verified = 1 ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Verify a specialist (admin only)
router.patch('/:id/verify', async (req, res, next) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    await pool.execute('UPDATE pet_specialists SET verified = 1 WHERE id = ?', [id]);
    res.json({ message: 'Specialist verified successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
