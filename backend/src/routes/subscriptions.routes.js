const express = require('express');
const { getPool } = require('../../db');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.post('/update', async (req, res, next) => {
  try {
    const { tier } = req.body;
    const userId = req.user.id;

    if (!tier) {
      return res.status(400).json({ error: 'Tier is required.' });
    }

    const validTiers = ['free', 'basic', 'premium', 'family'];
    if (!validTiers.includes(tier.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid subscription tier.' });
    }

    const pool = await getPool();
    const [result] = await pool.execute(
      'UPDATE users SET subscription_tier = ?, subscription_status = "active" WHERE id = ?',
      [tier.toLowerCase(), userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({
      message: 'Subscription updated successfully.',
      tier: tier.toLowerCase()
    });
  } catch (error) {
    next(error);
  }
});

router.post('/start-trial', async (req, res, next) => {
  try {
    const userId = req.user.id;

    const pool = await getPool();
    
    // Check if user already has a trial or a paid tier
    const [rows] = await pool.execute('SELECT subscription_tier, trial_ends_at FROM users WHERE id = ?', [userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (rows[0].trial_ends_at) {
      // For now, let's allow "resetting" the trial if the user wants to test it again
      // unless they already have a paid tier?
      if (rows[0].subscription_tier && rows[0].subscription_tier !== 'free' && rows[0].subscription_tier !== 'none') {
         // return res.status(400).json({ error: 'You already have a paid subscription.' });
      }
    }

    const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    await pool.execute(
      'UPDATE users SET trial_ends_at = ? WHERE id = ?',
      [trialEndsAt, userId]
    );

    return res.json({
      message: '7-Day Free Trial started!',
      trial_ends_at: trialEndsAt.toISOString()
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
