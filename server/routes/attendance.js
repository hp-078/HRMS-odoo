const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { auth, isAdmin } = require('../middleware/auth');

// Get attendance records
router.get('/', auth, async (req, res) => {
  try {
    const { date, employeeId } = req.query;
    
    let query = `
      SELECT a.*, 
        CONCAT(e.first_name, ' ', e.last_name) as employee_name,
        e.employee_id,
        e.profile_picture
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      WHERE e.company_id = $1
    `;
    const params = [req.user.companyId];
    let paramIndex = 2;

    if (date) {
      query += ` AND a.attendance_date = $${paramIndex}`;
      params.push(date);
      paramIndex++;
    }

    if (employeeId) {
      query += ` AND a.employee_id = $${paramIndex}`;
      params.push(employeeId);
    } else if (req.user.role === 'employee') {
      query += ` AND a.employee_id = $${paramIndex}`;
      params.push(req.user.employeeId);
    }

    query += ' ORDER BY a.attendance_date DESC, a.check_in DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// Get employee attendance summary
router.get('/summary/:employeeId', auth, async (req, res) => {
  try {
    const employeeId = req.params.employeeId;

    // Verify access
    if (req.user.role === 'employee' && req.user.employeeId !== parseInt(employeeId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await db.query(
      `SELECT 
        COUNT(CASE WHEN status = 'present' THEN 1 END) as days_present,
        COUNT(CASE WHEN status = 'leave' THEN 1 END) as leave_count,
        22 as total_working_days
      FROM attendance
      WHERE employee_id = $1 
        AND EXTRACT(MONTH FROM attendance_date) = EXTRACT(MONTH FROM CURRENT_DATE) 
        AND EXTRACT(YEAR FROM attendance_date) = EXTRACT(YEAR FROM CURRENT_DATE)`,
      [employeeId]
    );

    res.json(result.rows[0] || { days_present: 0, leave_count: 0, total_working_days: 22 });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// Check in
router.post('/checkin', auth, async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];

    // Check if already checked in today
    const existing = await db.query(
      'SELECT * FROM attendance WHERE employee_id = $1 AND attendance_date = $2',
      [employeeId, today]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Already checked in today' });
    }

    // Insert check-in
    await db.query(
      'INSERT INTO attendance (employee_id, attendance_date, check_in, status) VALUES ($1, $2, $3, $4)',
      [employeeId, today, currentTime, 'present']
    );

    // Update employee status
    await db.query('UPDATE employees SET status = $1 WHERE id = $2', ['present', employeeId]);

    res.json({ message: 'Checked in successfully', time: currentTime });
  } catch (error) {
    console.error('Check in error:', error);
    res.status(500).json({ error: 'Failed to check in' });
  }
});

// Check out
router.post('/checkout', auth, async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];

    // Get today's attendance
    const attendance = await db.query(
      'SELECT * FROM attendance WHERE employee_id = $1 AND attendance_date = $2',
      [employeeId, today]
    );

    if (attendance.rows.length === 0) {
      return res.status(400).json({ error: 'No check-in record found' });
    }

    if (attendance.rows[0].check_out) {
      return res.status(400).json({ error: 'Already checked out' });
    }

    // Calculate work hours
    const checkIn = new Date(`2000-01-01 ${attendance.rows[0].check_in}`);
    const checkOut = new Date(`2000-01-01 ${currentTime}`);
    const workHours = (checkOut - checkIn) / (1000 * 60 * 60);
    const extraHours = Math.max(0, workHours - 9);

    // Update check-out
    await db.query(
      'UPDATE attendance SET check_out = $1, work_hours = $2, extra_hours = $3 WHERE employee_id = $4 AND attendance_date = $5',
      [currentTime, workHours.toFixed(2), extraHours.toFixed(2), employeeId, today]
    );

    // Update employee status
    await db.query('UPDATE employees SET status = $1 WHERE id = $2', ['absent', employeeId]);

    res.json({ 
      message: 'Checked out successfully', 
      time: currentTime,
      workHours: workHours.toFixed(2)
    });
  } catch (error) {
    console.error('Check out error:', error);
    res.status(500).json({ error: 'Failed to check out' });
  }
});

// Get today's check-in status
router.get('/status', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const attendance = await db.query(
      'SELECT * FROM attendance WHERE employee_id = $1 AND attendance_date = $2',
      [req.user.employeeId, today]
    );

    if (attendance.rows.length === 0) {
      return res.json({ checkedIn: false });
    }

    res.json({
      checkedIn: true,
      checkedOut: !!attendance.rows[0].check_out,
      checkIn: attendance.rows[0].check_in,
      checkOut: attendance.rows[0].check_out,
      workHours: attendance.rows[0].work_hours
    });
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ error: 'Failed to get status' });
  }
});

module.exports = router;

// Get employee attendance summary
router.get('/summary/:employeeId', auth, async (req, res) => {
  try {
    const employeeId = req.params.employeeId;

    // Verify access
    if (req.user.role === 'employee' && req.user.employeeId !== parseInt(employeeId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [summary] = await db.query(
      `SELECT 
        COUNT(CASE WHEN status = 'present' THEN 1 END) as days_present,
        COUNT(CASE WHEN status = 'leave' THEN 1 END) as leave_count,
        22 as total_working_days
      FROM attendance
      WHERE employee_id = ? AND MONTH(attendance_date) = MONTH(CURDATE()) AND YEAR(attendance_date) = YEAR(CURDATE())`,
      [employeeId]
    );

    res.json(summary[0] || { days_present: 0, leave_count: 0, total_working_days: 22 });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// Check in
router.post('/checkin', auth, async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];

    // Check if already checked in today
    const [existing] = await db.query(
      'SELECT * FROM attendance WHERE employee_id = ? AND attendance_date = ?',
      [employeeId, today]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Already checked in today' });
    }

    // Insert check-in
    await db.query(
      'INSERT INTO attendance (employee_id, attendance_date, check_in, status) VALUES (?, ?, ?, ?)',
      [employeeId, today, currentTime, 'present']
    );

    // Update employee status
    await db.query('UPDATE employees SET status = ? WHERE id = ?', ['present', employeeId]);

    res.json({ message: 'Checked in successfully', time: currentTime });
  } catch (error) {
    console.error('Check in error:', error);
    res.status(500).json({ error: 'Failed to check in' });
  }
});

// Check out
router.post('/checkout', auth, async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];

    // Get today's attendance
    const [attendance] = await db.query(
      'SELECT * FROM attendance WHERE employee_id = ? AND attendance_date = ?',
      [employeeId, today]
    );

    if (attendance.length === 0) {
      return res.status(400).json({ error: 'No check-in record found' });
    }

    if (attendance[0].check_out) {
      return res.status(400).json({ error: 'Already checked out' });
    }

    // Calculate work hours
    const checkIn = new Date(`2000-01-01 ${attendance[0].check_in}`);
    const checkOut = new Date(`2000-01-01 ${currentTime}`);
    const workHours = (checkOut - checkIn) / (1000 * 60 * 60);
    const extraHours = Math.max(0, workHours - 9);

    // Update check-out
    await db.query(
      'UPDATE attendance SET check_out = ?, work_hours = ?, extra_hours = ? WHERE employee_id = ? AND attendance_date = ?',
      [currentTime, workHours.toFixed(2), extraHours.toFixed(2), employeeId, today]
    );

    // Update employee status
    await db.query('UPDATE employees SET status = ? WHERE id = ?', ['absent', employeeId]);

    res.json({ 
      message: 'Checked out successfully', 
      time: currentTime,
      workHours: workHours.toFixed(2)
    });
  } catch (error) {
    console.error('Check out error:', error);
    res.status(500).json({ error: 'Failed to check out' });
  }
});

// Get today's check-in status
router.get('/status', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const [attendance] = await db.query(
      'SELECT * FROM attendance WHERE employee_id = ? AND attendance_date = ?',
      [req.user.employeeId, today]
    );

    if (attendance.length === 0) {
      return res.json({ checkedIn: false });
    }

    res.json({
      checkedIn: true,
      checkedOut: !!attendance[0].check_out,
      checkIn: attendance[0].check_in,
      checkOut: attendance[0].check_out,
      workHours: attendance[0].work_hours
    });
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ error: 'Failed to get status' });
  }
});

module.exports = router;
