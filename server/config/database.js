const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hrms_db',
  port: process.env.DB_PORT || 5432,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.query('SELECT NOW()')
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });

module.exports = pool;
