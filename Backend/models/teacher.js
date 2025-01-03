const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  tid:{
    type:String,
    required:true
  },
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
  contact:{
    type:Number,
    required:true,
    validate: {
      validator: function (v) {
          return /^\d{10}$/.test(v.toString()); // Convert to string for regex validation
      },
      message: (props) => "Enter a valid number!",
  }},
    
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
