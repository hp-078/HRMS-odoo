const mongoose = require('mongoose');
const connectDB = require('./db');
require('dotenv').config();

const User = require('./models/User');
const Attendance = require('./models/Attendance');
const Leave = require('./models/Leave');

// Dummy Users Data
const dummyUsers = [
  {
    employeeId: 'EMP-001',
    firstName: 'System',
    lastName: 'Admin',
    email: 'admin@dayflow.com',
    password: '123456',
    role: 'ADMIN',
    department: 'Human Resources',
    designation: 'HR Director',
    joiningDate: new Date('2023-01-01'),
    salary: 50000,
    salaryInfo: {
      wageType: 'Fixed wage',
      monthlyWage: 50000,
      yearlyWage: 600000,
      workingDaysPerWeek: 5,
      components: [
        { name: 'Basic Rent Allowance', amount: 500000, percentage: 40, period: 'month' },
        { name: 'House Rent Allowance', amount: 100000, percentage: 20, period: 'month' },
        { name: 'Standard Allowance', amount: 750.87, percentage: 0.15, period: 'month' },
        { name: 'Performance Bonus', amount: 250.00, percentage: 0.05, period: 'month' },
        { name: 'Gross Total Allowances', amount: 100.50, percentage: 0.02, period: 'month' },
        { name: 'Leave Travel Allowance', amount: 100.50, percentage: 0.02, period: 'month' },
        { name: 'Fixed Allowance', amount: 100.50, percentage: 0.02, period: 'month' }
      ]
    },
    dateOfBirth: '1985-06-15',
    workingAddress: 'HQ, New York',
    nationality: 'American',
    personalEmail: 'admin.personal@email.com',
    bankName: 'Chase Bank',
    bankAccount: '****1234',
    gender: 'Male',
    maritalStatus: 'Married',
    avatar: 'https://ui-avatars.com/api/?name=System+Admin&background=714B67&color=fff'
  },
  {
    employeeId: 'EMP-002',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@dayflow.com',
    password: '123456',
    role: 'EMPLOYEE',
    department: 'Engineering',
    designation: 'Senior Developer',
    joiningDate: new Date('2023-03-15'),
    salary: 95000,
    salaryInfo: {
      wageType: 'Fixed wage',
      monthlyWage: 95000,
      yearlyWage: 1140000,
      workingDaysPerWeek: 5,
      components: [
        { name: 'Basic Rent Allowance', amount: 38000, percentage: 40, period: 'month' },
        { name: 'House Rent Allowance', amount: 19000, percentage: 20, period: 'month' },
        { name: 'Standard Allowance', amount: 142.50, percentage: 0.15, period: 'month' },
        { name: 'Performance Bonus', amount: 47.50, percentage: 0.05, period: 'month' }
      ]
    },
    dateOfBirth: '1990-04-12',
    workingAddress: 'Tech Park, Building A',
    nationality: 'American',
    personalEmail: 'john.personal@email.com',
    bankName: 'Bank of America',
    bankAccount: '****5678',
    gender: 'Male',
    maritalStatus: 'Single',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=017E84&color=fff'
  },
  {
    employeeId: 'EMP-003',
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah@dayflow.com',
    password: '123456',
    role: 'EMPLOYEE',
    department: 'Marketing',
    designation: 'Marketing Manager',
    joiningDate: new Date('2023-05-20'),
    salary: 85000,
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Williams&background=017E84&color=fff'
  },
  {
    employeeId: 'EMP-004',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael@dayflow.com',
    password: '123456',
    role: 'EMPLOYEE',
    department: 'Engineering',
    designation: 'Frontend Developer',
    joiningDate: new Date('2023-07-10'),
    salary: 75000,
    avatar: 'https://ui-avatars.com/api/?name=Michael+Brown&background=017E84&color=fff'
  },
  {
    employeeId: 'EMP-005',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily@dayflow.com',
    password: '123456',
    role: 'EMPLOYEE',
    department: 'Design',
    designation: 'UI/UX Designer',
    joiningDate: new Date('2023-08-01'),
    salary: 70000,
    avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=017E84&color=fff'
  },
  {
    employeeId: 'EMP-006',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david@dayflow.com',
    password: '123456',
    role: 'EMPLOYEE',
    department: 'Sales',
    designation: 'Sales Executive',
    joiningDate: new Date('2023-09-15'),
    salary: 65000,
    avatar: 'https://ui-avatars.com/api/?name=David+Wilson&background=017E84&color=fff'
  },
  {
    employeeId: 'EMP-007',
    firstName: 'Jessica',
    lastName: 'Martinez',
    email: 'jessica@dayflow.com',
    password: '123456',
    role: 'EMPLOYEE',
    department: 'Finance',
    designation: 'Accountant',
    joiningDate: new Date('2023-10-05'),
    salary: 68000,
    avatar: 'https://ui-avatars.com/api/?name=Jessica+Martinez&background=017E84&color=fff'
  },
  {
    employeeId: 'EMP-008',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert@dayflow.com',
    password: '123456',
    role: 'EMPLOYEE',
    department: 'Engineering',
    designation: 'Backend Developer',
    joiningDate: new Date('2024-01-10'),
    salary: 80000,
    avatar: 'https://ui-avatars.com/api/?name=Robert+Johnson&background=017E84&color=fff'
  },
  {
    employeeId: 'EMP-009',
    firstName: 'Amanda',
    lastName: 'Taylor',
    email: 'amanda@dayflow.com',
    password: '123456',
    role: 'EMPLOYEE',
    department: 'Customer Support',
    designation: 'Support Specialist',
    joiningDate: new Date('2024-02-20'),
    salary: 55000,
    avatar: 'https://ui-avatars.com/api/?name=Amanda+Taylor&background=017E84&color=fff'
  },
  {
    employeeId: 'EMP-010',
    firstName: 'James',
    lastName: 'Anderson',
    email: 'james@dayflow.com',
    password: '123456',
    role: 'EMPLOYEE',
    department: 'Operations',
    designation: 'Operations Manager',
    joiningDate: new Date('2024-03-15'),
    salary: 90000,
    avatar: 'https://ui-avatars.com/api/?name=James+Anderson&background=017E84&color=fff'
  }
];

// Function to generate dummy attendance records
const generateAttendanceRecords = (users) => {
  const records = [];
  const today = new Date();
  
  // Generate attendance for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    users.forEach((user, idx) => {
      // Randomly skip some days to simulate absences
      const shouldAddRecord = Math.random() > 0.1; // 90% attendance rate
      
      if (shouldAddRecord) {
        const checkInHour = 8 + Math.floor(Math.random() * 2); // 8-9 AM
        const checkInMinute = Math.floor(Math.random() * 60);
        const checkOutHour = 17 + Math.floor(Math.random() * 2); // 5-6 PM
        const checkOutMinute = Math.floor(Math.random() * 60);
        
        const status = checkInHour >= 9 && checkInMinute > 15 ? 'LATE' : 'PRESENT';
        
        records.push({
          userId: user.employeeId,
          date: dateStr,
          checkIn: `${checkInHour.toString().padStart(2, '0')}:${checkInMinute.toString().padStart(2, '0')}:00`,
          checkOut: `${checkOutHour.toString().padStart(2, '0')}:${checkOutMinute.toString().padStart(2, '0')}:00`,
          status: status,
          location: 'Office'
        });
      }
    });
  }
  
  return records;
};

// Function to generate dummy leave requests
const generateLeaveRequests = (users) => {
  const leaveTypes = ['Annual', 'Sick', 'Unpaid'];
  const statuses = ['PENDING', 'APPROVED', 'REJECTED'];
  const reasons = [
    'Family vacation',
    'Medical appointment',
    'Personal matters',
    'Feeling unwell',
    'Wedding ceremony',
    'Emergency at home',
    'Mental health day',
    'Attending conference'
  ];
  
  const leaves = [];
  
  users.forEach((user, idx) => {
    // Each employee has 2-5 leave requests
    const numberOfLeaves = 2 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < numberOfLeaves; i++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 60) - 30);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5) + 1);
      
      const appliedDate = new Date(startDate);
      appliedDate.setDate(appliedDate.getDate() - Math.floor(Math.random() * 10) - 3);
      
      leaves.push({
        userId: user.employeeId,
        userName: `${user.firstName} ${user.lastName}`,
        type: leaveTypes[Math.floor(Math.random() * leaveTypes.length)],
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        appliedDate: appliedDate.toISOString().split('T')[0],
        adminComment: Math.random() > 0.5 ? 'Approved as per company policy' : ''
      });
    }
  });
  
  return leaves;
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Attendance.deleteMany({});
    await Leave.deleteMany({});
    
    // Insert users
    console.log('👥 Inserting users...');
    const insertedUsers = await User.insertMany(dummyUsers);
    console.log(`✅ ${insertedUsers.length} users inserted successfully`);
    
    // Generate and insert attendance records
    console.log('📅 Generating attendance records...');
    const attendanceRecords = generateAttendanceRecords(dummyUsers);
    const insertedAttendance = await Attendance.insertMany(attendanceRecords);
    console.log(`✅ ${insertedAttendance.length} attendance records inserted successfully`);
    
    // Generate and insert leave requests
    console.log('🏖️  Generating leave requests...');
    const leaveRequests = generateLeaveRequests(dummyUsers);
    const insertedLeaves = await Leave.insertMany(leaveRequests);
    console.log(`✅ ${insertedLeaves.length} leave requests inserted successfully`);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${insertedUsers.length}`);
    console.log(`   - Attendance Records: ${insertedAttendance.length}`);
    console.log(`   - Leave Requests: ${insertedLeaves.length}`);
    console.log('\n💡 Default credentials:');
    console.log('   Admin: admin@dayflow.com (password: 123456)');
    console.log('   Employee: john@dayflow.com (password: 123456)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();
