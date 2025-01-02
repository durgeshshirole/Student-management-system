const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Teacher'],
    default: 'Teacher',
  },
  subject: {
    type: String,
    required: true,
  },
  announcements: [
    {
      title: { type: String, required: true },
      content: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;
