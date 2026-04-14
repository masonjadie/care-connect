const express = require('express');
const { getPool } = require('../../db');
const router = express.Router();

// Get all bookings (admin view)
router.get('/', async (req, res, next) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      `SELECT * FROM transportation_bookings ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Create a new booking
router.post('/', async (req, res, next) => {
  try {
    const { passengerName, pickup, dropoff, date, time, vehicleType, tripType, notes } = req.body;

    if (!pickup || !dropoff || !date || !time) {
      return res.status(400).json({ error: 'Pickup, dropoff, date, and time are required.' });
    }

    const pool = await getPool();
    const [result] = await pool.execute(
      `INSERT INTO transportation_bookings
         (passenger_name, pickup, dropoff, date, time, vehicle_type, trip_type, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'booked')`,
      [
        passengerName || 'Guest',
        pickup,
        dropoff,
        date,
        time,
        vehicleType || 'standard',
        tripType || 'one-way',
        notes || ''
      ]
    );

    res.status(201).json({
      message: 'Ride booked successfully!',
      bookingId: result.insertId
    });
  } catch (error) {
    next(error);
  }
});

// Update trip status (admin)
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['booked', 'picked_up', 'on_route', 'dropped_off'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid trip status.' });
    }
    const pool = await getPool();
    const [result] = await pool.execute(
      'UPDATE transportation_bookings SET status = ? WHERE id = ?',
      [status, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found.' });
    }
    res.json({ message: 'Trip status updated.', id, status });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
