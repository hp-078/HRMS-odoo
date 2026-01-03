const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { auth, isAdmin } = require('../middleware/auth');

// Get time off requests
router.get('/', auth, async (req, res) => {
  try {
    let query = `
      SELECT t.*, 
        CONCAT(e.first_name, ' ', e.last_name) as employee_name,
        e.employee_id,
        CONCAT(u.first_name, ' ', u.last_name) as approved_by_name
      FROM timeoff_requests t
      JOIN employees e ON t.employee_id = e.id
      LEFT JOIN employees u ON t.approved_by = u.user_id
      WHERE e.company_id = $1
    `;
    const params = [req.user.companyId];

    // Employees see only their own requests
    if (req.user.role === 'employee') {
      query += ' AND t.employee_id = $2';
      params.push(req.user.employeeId);
    }

    query += ' ORDER BY t.created_at DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get time off error:', error);
    res.status(500).json({ error: 'Failed to fetch time off requests' });
  }
});

// Create time off request
router.post('/', auth, async (req, res) => {
  try {
    const { startDate, endDate, type, reason, attachment } = req.body;
    const employeeId = req.user.employeeId;

    await db.query(
      'INSERT INTO timeoff_requests (employee_id, start_date, end_date, type, reason, attachment) VALUES ($1, $2, $3, $4, $5, $6)',
      [employeeId, startDate, endDate, type, reason, attachment]
    );

    res.status(201).json({ message: 'Time off request created successfully' });
  } catch (error) {
    console.error('Create time off error:', error);
    res.status(500).json({ error: 'Failed to create time off request' });
  }
});

// Approve time off request
router.put('/:id/approve', auth, isAdmin, async (req, res) => {
  try {
    const { comment } = req.body;

    await db.query(
      'UPDATE timeoff_requests SET status = $1, approved_by = $2, comment = $3 WHERE id = $4',
      ['approved', req.user.userId, comment, req.params.id]
    );

    // Update attendance records for approved days
    const result = await db.query(
      'SELECT * FROM timeoff_requests WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length > 0) {
      const { employee_id, start_date, end_date } = result.rows[0];
      
      // Create attendance records for leave days using PostgreSQL generate_series
      await db.query(
        `INSERT INTO attendance (employee_id, attendance_date, status)
        SELECT $1, generate_series($2::date, $3::date, '1 day'::interval)::date, 'leave'
        ON CONFLICT (employee_id, attendance_date) 
        DO UPDATE SET status = 'leave'`,
        [employee_id, start_date, end_date]
      );

      // Update employee status
      await db.query('UPDATE employees SET status = $1 WHERE id = $2', ['on-leave', employee_id]);
    }

    res.json({ message: 'Time off request approved' });
  } catch (error) {
    console.error('Approve time off error:', error);
    res.status(500).json({ error: 'Failed to approve request' });
  }
});

// Reject time off request
router.put('/:id/reject', auth, isAdmin, async (req, res) => {
  try {
    const { comment } = req.body;

    await db.query(
      'UPDATE timeoff_requests SET status = $1, approved_by = $2, comment = $3 WHERE id = $4',
      ['rejected', req.user.userId, comment, req.params.id]
    );

    res.json({ message: 'Time off request rejected' });
  } catch (error) {
    console.error('Reject time off error:', error);
    res.status(500).json({ error: 'Failed to reject request' });
  }
});

module.exports = router;
