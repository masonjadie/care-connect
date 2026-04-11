require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { getPool } = require('./db');

const appointmentsRouter = require('./src/routes/appointments.routes');
const contactsRouter = require('./src/routes/contacts.routes');
const remindersRouter = require('./src/routes/reminders.routes');
const emergencyRouter = require('./src/routes/emergency.routes');
const servicesRouter = require('./src/routes/services.routes');
const authRouter = require('./src/routes/auth.routes');
const caregiversRouter = require('./src/routes/caregivers.routes');
const subscriptionsRouter = require('./src/routes/subscriptions.routes');

const path = require('path');
const app = express();
const PORT = process.env.PORT || 4200;

// High-Performance Security & Caching
app.use(helmet({
  contentSecurityPolicy: false, // Allow external assets if needed
}));
app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', async (req, res) => {
  try {
    const pool = await getPool();
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', database: 'disconnected', error: error.message });
  }
});

// API Routes
app.use('/api/appointments', appointmentsRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/reminders', remindersRouter);
app.use('/api/emergency', emergencyRouter);
app.use('/api/services', servicesRouter);
app.use('/api/auth', authRouter);
app.use('/api/caregivers', caregiversRouter);
app.use('/api/subscriptions', subscriptionsRouter);

// PRO PERFORMANCE: Serve Frontend with Cache Headers
const distPath = path.join(__dirname, '../frontend/dist/frontend');

// Cache static assets for 1 year
app.use(express.static(distPath, {
  maxAge: '1y',
  etag: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache'); // Don't cache HTML to ensure quick updates
    }
  }
}));

// Angular Fallback for Deep Linking (Universal Compatibility)
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`CareConnect Production Server running on port ${PORT}`);
});
