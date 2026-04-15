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
    const { userId, passengerName, pickup, dropoff, date, time, vehicleType, tripType, notes } = req.body;

    if (!pickup || !dropoff || !date || !time) {
      return res.status(400).json({ error: 'Pickup, dropoff, date, and time are required.' });
    }

    const pool = await getPool();
    const [result] = await pool.execute(
      `INSERT INTO transportation_bookings
         (user_id, passenger_name, pickup, dropoff, date, time, vehicle_type, trip_type, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'booked')`,
      [
        userId || null,
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

// Get user specific bookings
router.get('/my-bookings/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const pool = await getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM transportation_bookings WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Update trip status (admin)
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, driverName, licensePlate, carModel, driverPhone } = req.body;
    const allowed = ['booked', 'picked_up', 'on_route', 'dropped_off'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid trip status.' });
    }
    const pool = await getPool();

    // If driver details are provided, update them too
    let query = 'UPDATE transportation_bookings SET status = ?';
    let params = [status];

    if (driverName) {
      query += ', driver_name = ?, license_plate = ?, car_model = ?, driver_phone = ?';
      params.push(driverName, licensePlate, carModel, driverPhone);
    }

    query += ' WHERE id = ?';
    params.push(id);

    const [result] = await pool.execute(query, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found.' });
    }
    res.json({ message: 'Trip status updated.', id, status });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
