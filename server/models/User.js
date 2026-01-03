
const mongoose = require('mongoose');

const salaryComponentSchema = mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  percentage: { type: Number, required: true },
  period: { type: String, enum: ['month', 'yearly'], default: 'month' }
});

const salaryInfoSchema = mongoose.Schema({
  wageType: { type: String, enum: ['Fixed wage', 'Hourly wage'], default: 'Fixed wage' },
  monthlyWage: { type: Number, required: true },
  yearlyWage: { type: Number, required: true },
  workingDaysPerWeek: { type: Number, default: 5 },
  components: [salaryComponentSchema]
});

const userSchema = mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'EMPLOYEE'], default: 'EMPLOYEE' },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  joiningDate: { type: Date, default: Date.now },
  salary: { type: Number, required: true },
  salaryInfo: salaryInfoSchema,
  dateOfBirth: { type: String },
  workingAddress: { type: String },
  nationality: { type: String },
  personalEmail: { type: String },
  bankName: { type: String },
  bankAccount: { type: String },
  gender: { type: String },
  maritalStatus: { type: String },
  avatar: { type: String },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
