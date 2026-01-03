
const mongoose = require('mongoose');

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
  avatar: { type: String },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
