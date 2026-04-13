const express = require('express');
const { getPool } = require('../../db');
const router = express.Router();

router.post('/place-order', async (req, res, next) => {
  try {
    const { userId, itemName, itemType, amount } = req.body;

    if (!itemName || !itemType) {
      return res.status(400).json({ error: 'Item name and type are required.' });
    }

    const pool = await getPool();
    const [result] = await pool.execute(
      'INSERT INTO orders (user_id, item_name, item_type, amount) VALUES (?, ?, ?, ?)',
      [userId || null, itemName, itemType, amount || 0]
    );

    res.status(201).json({
      message: 'Order placed successfully.',
      orderId: result.insertId
    });
  } catch (error) {
    next(error);
  }
});

router.get('/my-orders/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const pool = await getPool();
    const [rows] = await pool.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
