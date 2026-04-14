const express = require('express');
const { getPool } = require('../../db');
const router = express.Router();

router.post('/place-order', async (req, res, next) => {
  try {
    const { userId, itemName, itemType, amount, requestTime, requestLocation, requestDuration, requestRate } = req.body;

    if (!itemName || !itemType) {
      return res.status(400).json({ error: 'Item name and type are required.' });
    }

    const pool = await getPool();
    const [result] = await pool.execute(
      `INSERT INTO orders 
        (user_id, item_name, item_type, amount, request_time, request_location, request_duration, request_rate) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId || null, 
        itemName, 
        itemType, 
        amount || 0, 
        requestTime || null, 
        requestLocation || null, 
        requestDuration || null, 
        requestRate || null
      ]
    );

    res.status(201).json({
      message: 'Order placed successfully.',
      orderId: result.insertId
    });
  } catch (error) {
    next(error);
  }
});

// Get all orders (admin view)
router.get('/', async (req, res, next) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT o.*, u.name as userName FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC');
    res.json(rows);
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

// Update order status (admin)
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['pending', 'fulfilled', 'out_for_delivery', 'delivered'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }
    const pool = await getPool();
    const [result] = await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    res.json({ message: 'Order status updated.', id, status });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
