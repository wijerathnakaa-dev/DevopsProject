const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middlewares
// Only allow known frontend origins (comma-separated list in CORS_ORIGINS)
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser clients (curl, health checks, tests) that send no Origin header
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true
}));
app.use(express.json());

// Health check handler function
const healthHandler = async (req, res) => {
  let dbStatus = 'disconnected';
  let healthy = false;
  try {
    await pool.query('SELECT 1');
    dbStatus = 'connected';
    healthy = true;
  } catch (err) {
    dbStatus = 'unreachable: ' + err.message;
  }

  // 503 lets Docker / CI / monitoring tools detect that the service is not working
  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'error',
    service: 'ChaCeylon Ceylon Tea Platform API',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
};

// Mount health check on both /health (Kubernetes / Jenkins) and /api/health (Frontend)
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: `API endpoint '${req.method} ${req.originalUrl}' not found.`
    }
  });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
    }
  });
});

module.exports = app;
