const express = require('express');
const { getPool } = require('../../db');
const { validateContact } = require('../utils/validators');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const pool = await getPool();
    const [contacts] = await pool.query(
      'SELECT id, name, relation, phone FROM contacts ORDER BY id DESC'
    );
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const validationError = validateContact(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const contact = {
      name: req.body.name.trim(),
      relation: req.body.relation.trim(),
      phone: typeof req.body.phone === 'string' ? req.body.phone.trim() : ''
    };

    const pool = await getPool();
    const [result] = await pool.execute(
      'INSERT INTO contacts (name, relation, phone) VALUES (?, ?, ?)',
      [contact.name, contact.relation, contact.phone]
    );

    return res.status(201).json({ id: result.insertId, ...contact });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid contact id' });
    }

    const pool = await getPool();
    const [result] = await pool.execute('DELETE FROM contacts WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
