const express = require('express');
const { getPool } = require('../../db');
const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  // Simple check for now, in a real app this would use JWT decoding
  // For this project, we'll assume the frontend sends the token and we could verify it here.
  // Assuming 'role' is passed in headers or body for demonstration, 
  // though a proper JWT verification is better.
  next(); 
};

router.get('/dashboard-stats', isAdmin, async (req, res, next) => {
  try {
    const pool = await getPool();

    // 1. Registered Users
    const [userRows] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const totalUsers = userRows[0].count;

    // 2. Total Visits
    const [visitRows] = await pool.execute('SELECT COUNT(*) as count FROM site_analytics WHERE event_type = "visit"');
    const totalVisits = visitRows[0].count;

    // 3. Failed Logins
    const [failRows] = await pool.execute('SELECT COUNT(*) as count FROM site_analytics WHERE event_type = "login_fail"');
    const failedLogins = failRows[0].count;

    // 4. Orders Stats
    const [orderRows] = await pool.execute('SELECT COUNT(*) as count, SUM(amount) as total_revenue FROM orders');
    const totalOrders = orderRows[0].count;
    const totalRevenue = orderRows[0].total_revenue || 0;

    // 5. Food Orders specifically
    const [foodOrderRows] = await pool.execute('SELECT COUNT(*) as count FROM orders WHERE item_type = "meal"');
    const foodOrders = foodOrderRows[0].count;

    // 6. Recent Orders
    const [recentOrders] = await pool.execute(`
      SELECT o.*, u.name as user_name 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC 
      LIMIT 10
    `);

    // 7. Recent Events (Live Analytics)
    const [recentEvents] = await pool.execute('SELECT * FROM site_analytics ORDER BY created_at DESC LIMIT 20');

    res.json({
      stats: {
        totalUsers,
        totalVisits,
        failedLogins,
        totalOrders,
        totalRevenue,
        foodOrders
      },
      recentOrders,
      recentEvents
    });
  } catch (error) {
    next(error);
  }
});

router.post('/track-visit', async (req, res, next) => {
  try {
    const pool = await getPool();
    const logData = JSON.stringify({ page: req.body.page || 'unknown', ip: req.ip });
    await pool.execute('INSERT INTO site_analytics (event_type, event_data) VALUES (?, ?)', ['visit', logData]);
    res.json({ message: 'Visit tracked' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
