const express = require('express');
const { getPool } = require('../../db');
const { validateAppointment } = require('../utils/validators');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const pool = await getPool();
    const [appointments] = await pool.query(
      'SELECT id, title, date, time FROM appointments ORDER BY id DESC'
    );
    res.json(appointments);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const validationError = validateAppointment(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const pool = await getPool();
    const [result] = await pool.execute(
      'INSERT INTO appointments (title, date, time) VALUES (?, ?, ?)',
      [req.body.title.trim(), req.body.date.trim(), req.body.time.trim()]
    );

    return res.status(201).json({
      id: result.insertId,
      title: req.body.title.trim(),
      date: req.body.date.trim(),
      time: req.body.time.trim()
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid appointment id' });
    }

    const validationError = validateAppointment(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const pool = await getPool();
    const [result] = await pool.execute(
      'UPDATE appointments SET title = ?, date = ?, time = ? WHERE id = ?',
      [req.body.title.trim(), req.body.date.trim(), req.body.time.trim(), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    return res.json({
      id,
      title: req.body.title.trim(),
      date: req.body.date.trim(),
      time: req.body.time.trim()
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid appointment id' });
    }

    const pool = await getPool();
    const [result] = await pool.execute('DELETE FROM appointments WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
