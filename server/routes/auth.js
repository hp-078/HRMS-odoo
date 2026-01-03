const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { auth } = require('../middleware/auth');

// Register new company/admin
router.post('/register', async (req, res) => {
  try {
    const { companyName, name, email, phone, password } = req.body;

    // Check if user already exists
    const existingUsers = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUsers.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userResult = await db.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id',
      [email, hashedPassword, 'admin']
    );

    const userId = userResult.rows[0].id;

    // Create company
    const companyResult = await db.query(
      'INSERT INTO companies (name, admin_user_id) VALUES ($1, $2) RETURNING id',
      [companyName, userId]
    );

    const companyId = companyResult.rows[0].id;

    // Create employee record for admin
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ') || '';
    
    await db.query(
      'INSERT INTO employees (user_id, company_id, employee_id, first_name, last_name, phone, job_title, department, joining_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE)',
      [userId, companyId, `EMP${String(userId).padStart(3, '0')}`, firstName, lastName, phone, 'Administrator', 'Management']
    );

    // Generate JWT
    const token = jwt.sign(
      { userId, email, role: 'admin', companyId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { userId, email, role: 'admin', companyId }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const users = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (users.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get employee info
    const employees = await db.query(
      'SELECT e.*, c.name as company_name FROM employees e LEFT JOIN companies c ON e.company_id = c.id WHERE e.user_id = $1',
      [user.id]
    );

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        employeeId: employees.rows[0]?.id,
        companyId: employees.rows[0]?.company_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        userId: user.id,
        email: user.email,
        role: user.role,
        employeeId: employees.rows[0]?.id,
        companyId: employees.rows[0]?.company_id,
        name: employees.rows[0] ? `${employees.rows[0].first_name} ${employees.rows[0].last_name}` : email.split('@')[0],
        companyName: employees.rows[0]?.company_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const users = await db.query(
      'SELECT u.id, u.email, u.role, e.id as employee_id, e.first_name, e.last_name, e.company_id FROM users u LEFT JOIN employees e ON u.id = e.user_id WHERE u.id = $1',
      [req.user.userId]
    );

    if (users.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users.rows[0];
    res.json({
      userId: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employee_id,
      companyId: user.company_id,
      name: user.first_name ? `${user.first_name} ${user.last_name}` : user.email.split('@')[0]
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

module.exports = router;
