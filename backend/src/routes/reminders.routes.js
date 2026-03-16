const express = require('express');
const { getPool } = require('../../db');
const { validateReminder } = require('../utils/validators');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const pool = await getPool();
    const [reminders] = await pool.query('SELECT id, title, time FROM reminders ORDER BY id DESC');
    res.json(reminders);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const validationError = validateReminder(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const reminder = {
      title: req.body.title.trim(),
      time: req.body.time.trim()
    };

    const pool = await getPool();
    const [result] = await pool.execute('INSERT INTO reminders (title, time) VALUES (?, ?)', [
      reminder.title,
      reminder.time
    ]);

    return res.status(201).json({ id: result.insertId, ...reminder });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid reminder id' });
    }

    const pool = await getPool();
    const [result] = await pool.execute('DELETE FROM reminders WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
