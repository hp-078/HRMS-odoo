
const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema({
  userId: { type: String, required: true }, // Changed from ObjectId to String for flexibility
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  checkIn: { type: String, required: true },
  checkOut: { type: String },
  status: { type: String, enum: ['PRESENT', 'ABSENT', 'LATE', 'ON_LEAVE'], default: 'PRESENT' },
  location: { type: String },
}, {
  timestamps: true,
});

// Index to quickly find attendance for a specific user on a specific date
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
