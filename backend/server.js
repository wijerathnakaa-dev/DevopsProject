const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const app = require('./src/app');
const pool = require('./src/config/db');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log('====================================================');
  console.log(`🍵 ChaCeylon Express REST Backend is Running!`);
  console.log(`🌐 Base URL:   http://localhost:${PORT}`);
  console.log(`❤️  Health:     http://localhost:${PORT}/api/health`);
  console.log(`📦 Products:   http://localhost:${PORT}/api/products`);
  console.log(`📑 Categories: http://localhost:${PORT}/api/categories`);
  console.log('====================================================');

  try {
    await pool.query('SELECT 1');
    console.log('✓ MySQL Database successfully connected & verified.');
  } catch (err) {
    console.warn('⚠️  MySQL Database connection check failed:', err.message);
    console.warn('   Ensure MySQL is running and verify DB_PASSWORD in backend/.env');
    console.warn('   Run "npm run init-db" to create and seed the database once connected.');
  }
});

module.exports = server;
