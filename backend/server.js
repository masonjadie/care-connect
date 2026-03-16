require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { getPool } = require('./db');

const appointmentsRouter = require('./src/routes/appointments.routes');
const contactsRouter = require('./src/routes/contacts.routes');
const remindersRouter = require('./src/routes/reminders.routes');
const emergencyRouter = require('./src/routes/emergency.routes');
const servicesRouter = require('./src/routes/services.routes');
const authRouter = require('./src/routes/auth.routes');
const caregiversRouter = require('./src/routes/caregivers.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    name: 'Final Project API',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', async (req, res) => {
  try {
    const pool = await getPool();
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', database: 'disconnected', error: error.message });
  }
});

app.use('/api/appointments', appointmentsRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/reminders', remindersRouter);
app.use('/api/emergency', emergencyRouter);
app.use('/api/services', servicesRouter);
app.use('/api/auth', authRouter);
app.use('/api/caregivers', caregiversRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
