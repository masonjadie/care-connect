const express = require('express');
const { getPool } = require('../../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const pool = await getPool();
    const [services] = await pool.query('SELECT id, title, description FROM services ORDER BY id ASC');
    res.json(services);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
