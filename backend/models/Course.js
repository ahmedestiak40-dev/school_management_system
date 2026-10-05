const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: [true, 'Course code is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  courseName: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  schedule: {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    startTime: String,
    endTime: String,
    room: String,
  },
  maxStudents: {
    type: Number,
    default: 30,
  },
  currentStudents: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Full', 'Cancelled'],
    default: 'Active',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Course', courseSchema);