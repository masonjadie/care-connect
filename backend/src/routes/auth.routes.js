const express = require('express');
const { getPool } = require('../../db');
const { hashPassword, verifyPassword } = require('../utils/password');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'careconnect_hub_secret_key';

const router = express.Router();

function validateEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validatePassword(password) {
  return typeof password === 'string' && password.trim().length >= 6;
}

router.post('/register', async (req, res, next) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!name) {
      return res.status(400).json({ error: 'Name is required.' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'A valid email is required.' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const pool = await getPool();
    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email is already registered.' });
    }

    const passwordHash = hashPassword(password);
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, 'user']
    );

    const user = {
      id: result.insertId,
      name,
      email,
      subscription_tier: null,
      trial_ends_at: null,
      role: 'user'
    };

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Registration successful.',
      user,
      token
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const identifier = typeof req.body.email === 'string' ? req.body.email.trim() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!identifier || !validatePassword(password)) {
      return res.status(400).json({ error: 'Invalid username/email or password.' });
    }

    const pool = await getPool();
    const [rows] = await pool.execute(
      'SELECT id, name, email, subscription_tier, trial_ends_at, role, password_hash AS passwordHash FROM users WHERE (email = ? OR name = ?) LIMIT 1',
      [identifier, identifier]
    );

    if (rows.length === 0 || !verifyPassword(password, rows[0].passwordHash)) {
      return res.status(401).json({ error: 'Incorrect username/email or password.' });
    }

    const user = {
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      subscription_tier: rows[0].subscription_tier,
      trial_ends_at: rows[0].trial_ends_at,
      role: rows[0].role
    };

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      message: 'Login successful.',
      user,
      token
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
