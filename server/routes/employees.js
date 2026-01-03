const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { auth, isAdmin } = require('../middleware/auth');

// Get all employees (admin/hr only)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT e.*, 
        CONCAT(e.first_name, ' ', e.last_name) as full_name,
        COALESCE(a.status, 'absent') as current_status
      FROM employees e
      LEFT JOIN attendance a ON e.id = a.employee_id AND a.attendance_date = CURRENT_DATE
      WHERE e.company_id = $1
      ORDER BY e.created_at DESC`,
      [req.user.companyId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get employee by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT e.*, 
        CONCAT(e.first_name, ' ', e.last_name) as full_name,
        u.email
      FROM employees e
      LEFT JOIN users u ON e.user_id = u.id
      WHERE e.id = $1 AND e.company_id = $2`,
      [req.params.id, req.user.companyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const employee = result.rows[0];

    // Get salary info if admin
    if (req.user.role === 'admin' || req.user.role === 'hr') {
      const salary = await db.query(
        'SELECT * FROM salary_components WHERE employee_id = $1',
        [req.params.id]
      );
      employee.salary = salary.rows[0] || null;
    }

    res.json(employee);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// Create employee (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { 
      firstName, lastName, email, phone, dateOfBirth, address, 
      jobTitle, department, joiningDate, monthlyWage 
    } = req.body;

    // Generate employee ID
    const maxEmp = await db.query(
      `SELECT MAX(CAST(SUBSTRING(employee_id, 4) AS INTEGER)) as max_id 
       FROM employees WHERE company_id = $1`,
      [req.user.companyId]
    );
    const nextId = (maxEmp.rows[0].max_id || 0) + 1;
    const employeeId = `EMP${String(nextId).padStart(3, '0')}`;

    // Insert employee
    const result = await db.query(
      `INSERT INTO employees (company_id, employee_id, first_name, last_name, phone, date_of_birth, address, job_title, department, joining_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [req.user.companyId, employeeId, firstName, lastName, phone, dateOfBirth, address, jobTitle, department, joiningDate]
    );

    const newEmployeeId = result.rows[0].id;

    // Create salary record
    if (monthlyWage) {
      const yearlyWage = monthlyWage * 12;
      const basicSalary = monthlyWage * 0.6;
      const hra = basicSalary * 0.2;
      
      await db.query(
        `INSERT INTO salary_components (employee_id, monthly_wage, yearly_wage, basic_salary, hra, standard_allowance, leave_travel_allowance, performance_bonus, fixed_allowance)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [newEmployeeId, monthlyWage, yearlyWage, basicSalary, hra, 500, 400, basicSalary * 0.1, 200]
      );
    }

    res.status(201).json({ 
      message: 'Employee created successfully', 
      employeeId: newEmployeeId 
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// Update employee
router.put('/:id', auth, async (req, res) => {
  try {
    const { phone, address, emergencyContact, profilePicture } = req.body;
    
    // Check if user can update (admin or own profile)
    if (req.user.role !== 'admin' && req.user.employeeId !== parseInt(req.params.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.query(
      'UPDATE employees SET phone = $1, address = $2, emergency_contact = $3, profile_picture = $4 WHERE id = $5 AND company_id = $6',
      [phone, address, emergencyContact, profilePicture, req.params.id, req.user.companyId]
    );

    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

module.exports = router;
