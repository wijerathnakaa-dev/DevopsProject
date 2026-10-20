const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tea_herbal_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

pool.getConnection()
  .then((conn) => {
    console.log(`[Database] MySQL connected to database '${process.env.DB_NAME || 'tea_herbal_db'}' on ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
    conn.release();
  })
  .catch((err) => {
    console.error(`[Database Warning] Unable to connect to MySQL database '${process.env.DB_NAME || 'tea_herbal_db'}':`, err.message);
    console.error('Verify your MySQL service is running and credentials in backend/.env are correct.');
  });

module.exports = pool;
