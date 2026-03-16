const express = require('express');
const { getPool } = require('../../db');
const { validateEmergency } = require('../utils/validators');

const router = express.Router();

router.get('/alerts', async (req, res, next) => {
  try {
    const pool = await getPool();
    const [alerts] = await pool.query(
      'SELECT id, message, location, created_at AS createdAt FROM emergency_alerts ORDER BY id DESC'
    );
    res.json(alerts);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const validationError = validateEmergency(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const message =
      typeof req.body.message === 'string' && req.body.message.trim().length > 0
        ? req.body.message.trim()
        : 'Emergency alert triggered';
    const location = typeof req.body.location === 'string' ? req.body.location.trim() : '';

    const pool = await getPool();
    const [result] = await pool.execute(
      'INSERT INTO emergency_alerts (message, location) VALUES (?, ?)',
      [message, location]
    );

    const [rows] = await pool.execute(
      'SELECT id, message, location, created_at AS createdAt FROM emergency_alerts WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      message: 'Emergency alert sent!',
      alert: rows[0]
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
