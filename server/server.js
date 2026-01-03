
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Models
const User = require('./models/User');
const Attendance = require('./models/Attendance');
const Leave = require('./models/Leave');

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`[AUTH] Login attempt for: ${email}`);
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found. Please sign up first.' });
    
    const userData = {
      id: user._id.toString(),
      employeeId: user.employeeId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      department: user.department,
      designation: user.designation,
      joiningDate: user.joiningDate,
      salary: user.salary,
      avatar: user.avatar
    };
    res.json(userData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log(`[AUTH] Creating new user: ${email} (${role})`);
    
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    // Generate automatic Employee ID
    const count = await User.countDocuments();
    const newEmployeeId = `EMP-${(count + 1).toString().padStart(3, '0')}`;

    // Extract default name from email if not provided
    const namePart = email.split('@')[0];
    const firstName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const user = await User.create({
      email,
      password: password || '123456',
      firstName: firstName,
      lastName: role === 'ADMIN' ? '(HR)' : '(Staff)',
      employeeId: newEmployeeId,
      role: role || 'EMPLOYEE',
      department: role === 'ADMIN' ? 'Human Resources' : 'General',
      designation: role === 'ADMIN' ? 'HR Manager' : 'Staff Member',
      salary: role === 'ADMIN' ? 95000 : 50000,
      avatar: `https://ui-avatars.com/api/?name=${firstName}&background=${role === 'ADMIN' ? '714B67' : '017E84'}&color=fff`
    });

    console.log(`[SUCCESS] User ${user.email} saved to MongoDB with ID: ${user._id}`);

    res.status(201).json({ 
      id: user._id.toString(),
      employeeId: user.employeeId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      department: user.department,
      designation: user.designation,
      joiningDate: user.joiningDate,
      salary: user.salary,
      avatar: user.avatar
    });
  } catch (err) {
    console.error(`[ERROR] Signup failed: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Employee Routes
app.get('/api/employees', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users.map(u => ({ 
      ...u._doc, 
      id: u._id.toString() 
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/employees", async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      department,
      designation,
      salary,
      role,
    } = req.body;

    // Check if employee with email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Employee with this email already exists" });
    }

    // Generate automatic Employee ID
    const count = await User.countDocuments();
    const newEmployeeId = `EMP-${(count + 1).toString().padStart(3, "0")}`;

    // Create new employee with provided details
    const employee = await User.create({
      employeeId: newEmployeeId,
      firstName: firstName || "New",
      lastName: lastName || "Employee",
      email,
      password: "123456", // Default password
      role: role || "EMPLOYEE",
      department: department || "General",
      designation: designation || "Staff",
      salary: salary || 50000,
      joiningDate: new Date(),
      avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=${
        role === "ADMIN" ? "714B67" : "017E84"
      }&color=fff`,
    });

    console.log(
      `[SUCCESS] New employee ${employee.email} created with ID: ${employee.employeeId}`
    );

    res.status(201).json({
      ...employee._doc,
      id: employee._id.toString(),
      message: "Employee created successfully",
    });
  } catch (err) {
    console.error(`[ERROR] Failed to create employee: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

app.patch('/api/employees/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'Employee not found' });
    res.json({ ...user._doc, id: user._id.toString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/employees/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Employee not found" });

    // Also delete related attendance and leave records
    await Attendance.deleteMany({ userId: user.employeeId });
    await Leave.deleteMany({ userId: user.employeeId });

    console.log(
      `[SUCCESS] Employee ${user.employeeId} and related records deleted`
    );
    res.json({
      message: "Employee deleted successfully",
      employeeId: user.employeeId,
    });
  } catch (err) {
    console.error(`[ERROR] Failed to delete employee: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Attendance Routes
app.get('/api/attendance', async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const records = await Attendance.find(filter).sort({ date: -1 });
    res.json(records.map(r => ({ ...r._doc, id: r._id.toString() })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/attendance/check-in', async (req, res) => {
  try {
    const { userId } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const existing = await Attendance.findOne({ userId, date: today });
    if (existing) return res.status(400).json({ message: 'Already checked in today' });
    
    const record = await Attendance.create({
      userId,
      date: today,
      checkIn: new Date().toLocaleTimeString(),
      status: 'PRESENT'
    });
    console.log(`[DB] Attendance check-in saved for user ${userId}`);
    res.json({ ...record._doc, id: record._id.toString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/attendance/check-out', async (req, res) => {
  try {
    const { userId } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const record = await Attendance.findOneAndUpdate(
      { userId, date: today },
      { checkOut: new Date().toLocaleTimeString() },
      { new: true }
    );
    if (!record) return res.status(404).json({ message: 'No check-in record found for today' });
    res.json({ ...record._doc, id: record._id.toString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Leave Routes
app.get('/api/leaves', async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const leaves = await Leave.find(filter).sort({ appliedDate: -1 });
    res.json(leaves.map(l => ({ ...l._doc, id: l._id.toString() })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/leaves', async (req, res) => {
  try {
    const leave = await Leave.create({
      ...req.body,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'PENDING'
    });
    console.log(`[DB] Leave request saved to MongoDB for: ${req.body.userName}`);
    res.json({ ...leave._doc, id: leave._id.toString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/api/leaves/:id', async (req, res) => {
  try {
    const { id, _id, ...updateData } = req.body;
    const leave = await Leave.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!leave) return res.status(404).json({ message: 'Leave request not found' });
    console.log(`[DB] Leave ${req.params.id} updated to ${updateData.status}`);
    res.json({ ...leave._doc, id: leave._id.toString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Dayflow API Server running on port ${PORT}`));
