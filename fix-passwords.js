const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

async function fixPasswords() {
  try {
    // Hash the passwords
    const adminHash = await bcrypt.hash('admin123', 10);
    const employeeHash = await bcrypt.hash('employee123', 10);
    
    // Update the users
    await pool.query('UPDATE users SET password = $1 WHERE email = $2', [adminHash, 'admin@company.com']);
    await pool.query('UPDATE users SET password = $1 WHERE email = $2', [employeeHash, 'employee@company.com']);
    
    console.log('✅ Passwords updated successfully!');
    console.log('\nLogin Credentials:');
    console.log('Admin - Email: admin@company.com, Password: admin123');
    console.log('Employee - Email: employee@company.com, Password: employee123');
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

fixPasswords();
