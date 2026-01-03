const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { auth, isAdmin } = require('../middleware/auth');

// Get salary information (admin only or own salary)
router.get('/:employeeId', auth, async (req, res) => {
  try {
    const employeeId = req.params.employeeId;

    // Check access
    if (req.user.role === 'employee' && req.user.employeeId !== parseInt(employeeId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await db.query(
      'SELECT * FROM salary_components WHERE employee_id = $1',
      [employeeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Salary information not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get salary error:', error);
    res.status(500).json({ error: 'Failed to fetch salary information' });
  }
});

// Update salary information (admin only)
router.put('/:employeeId', auth, isAdmin, async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const { 
      monthlyWage, yearlyWage, workingDays, 
      basicSalary, hra, standardAllowance, 
      leaveTravelAllowance, performanceBonus, fixedAllowance 
    } = req.body;

    await db.query(
      `UPDATE salary_components 
      SET monthly_wage = $1, yearly_wage = $2, working_days = $3, 
          basic_salary = $4, hra = $5, standard_allowance = $6, 
          leave_travel_allowance = $7, performance_bonus = $8, fixed_allowance = $9
      WHERE employee_id = $10`,
      [monthlyWage, yearlyWage, workingDays, basicSalary, hra, standardAllowance, 
       leaveTravelAllowance, performanceBonus, fixedAllowance, employeeId]
    );

    res.json({ message: 'Salary information updated successfully' });
  } catch (error) {
    console.error('Update salary error:', error);
    res.status(500).json({ error: 'Failed to update salary information' });
  }
});

module.exports = router;
