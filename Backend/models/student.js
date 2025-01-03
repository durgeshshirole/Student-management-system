const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  sid:{
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
  role: {
    type: String,
    enum: ['Student'],
    default: 'Student',
  },
  gender: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
  },
  marks: [
    {
      subject: { type: String, required: true },
      score: { type: Number, required: true },
    },
  ],
  attendance: {
    type: Number,
    default: 100,
  },
  // messages: [
  //   {
  //     toTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  //     content: { type: String, required: true },
  //     date: { type: Date, default: Date.now },
  //   },
  // ],
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
