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
const analyticsRouter = require('./src/routes/analytics.routes');
const ordersRouter = require('./src/routes/orders.routes');
const petSpecialistsRouter = require('./src/routes/pet-specialists.routes');

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
  console.log('Health check requested. Checking DB connection...');
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
app.use('/api/analytics', analyticsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/pet-specialists', petSpecialistsRouter);

// PRO PERFORMANCE: Serve Frontend with Cache Headers
const distPath = path.join(__dirname, '../frontend/dist/frontend');
const fs = require('fs');

if (fs.existsSync(distPath)) {
  // Cache static assets for 1 year
  app.use(express.static(distPath, {
    maxAge: '1y',
    etag: true,
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));

  // Angular Fallback for Deep Linking
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  console.warn('Frontend dist folder not found. Serving API only mode.');
  app.get('/', (req, res) => {
    res.json({ 
      message: 'CareConnect API is running', 
      status: 'online',
      health: '/api/health'
    });
  });
}

app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  const status = err.statusCode || err.status || 500;
  res.status(status).json({ 
    error: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

app.listen(PORT, () => {
  console.log(`CareConnect Production Server running on port ${PORT}`);
});
