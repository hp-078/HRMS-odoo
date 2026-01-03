
const mongoose = require('mongoose');

const leaveSchema = mongoose.Schema({
  userId: { type: String, required: true }, // Changed from ObjectId to String for flexibility
  userName: { type: String, required: true },
  type: { type: String, enum: ['Annual', 'Sick', 'Unpaid'], required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  appliedDate: { type: String, required: true },
  adminComment: { type: String },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Leave', leaveSchema);
