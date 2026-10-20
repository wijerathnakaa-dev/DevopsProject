const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function initDatabase() {
  console.log('--- Initializing ChaCeylon MySQL Database ---');
  console.log(`Connecting to MySQL host: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306} as user: ${process.env.DB_USER || 'root'}`);

  let connection;
  try {
    // Connect without database selected first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('✓ Successfully connected to MySQL server.');

    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const seedPath = path.join(__dirname, '../../database/seed.sql');

    if (!fs.existsSync(schemaPath) || !fs.existsSync(seedPath)) {
      throw new Error(`Schema or seed file missing. Checked:\n  ${schemaPath}\n  ${seedPath}`);
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('Applying database schema...');
    await connection.query(schemaSql);
    console.log('✓ Schema applied successfully (tables created).');

    console.log('Applying seed data...');
    await connection.query(seedSql);
    console.log('✓ Seed data populated successfully (categories, default admin/customer, products).');

    console.log('\n--- Database Initialization Complete! ---');
    console.log('Database: tea_herbal_db');
    console.log('Default Admin Account: admin@chaceylon.lk / admin123');
    console.log('Default Customer Account: customer@chaceylon.lk / customer123');
  } catch (err) {
    console.error('✗ Database initialization failed:', err.message);
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\nPlease check your DB_USER and DB_PASSWORD in backend/.env');
    }
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

initDatabase();
