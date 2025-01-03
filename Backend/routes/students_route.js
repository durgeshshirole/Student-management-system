const router = require('express').Router();
const Student = require('../models/student');
const { verifyToken, isTeacher, isStudent } = require('../middleware/authMiddleware');

// Add a student (Teacher Only)
router.route('/add').post(verifyToken, isTeacher, (req, res) => {
  const { name, sid, gender, contactNumber, address, marks, attendance } = req.body;

  const newStudent = new Student({
    name,
    sid,
    gender,
    contactNumber,
    address,
    marks,
    attendance,
  });

  newStudent
    .save()
    .then(() => res.status(201).json('Student Added Successfully'))
    .catch((err) =>
      res.status(500).json({ error: 'Error adding student', details: err.message })
    );
});

// Get all students (Teacher Only)
router.route('/get').get(verifyToken, isTeacher, (req, res) => {
  Student.find()
    .then((students) => res.status(200).json(students))
    .catch((err) =>
      res.status(500).json({ error: 'Error fetching students', details: err.message })
    );
});

// Get own data (Student Only)
router.route('/get/own').get(verifyToken, isStudent, (req, res) => {
  const studentId = req.user.id; // Assuming JWT contains student ID

  Student.findById(studentId)
    .then((student) => {
      if (!student) return res.status(404).json({ status: 'Student Not Found' });
      res.status(200).json(student);
    })
    .catch((err) =>
      res.status(500).json({ error: 'Error fetching student data', details: err.message })
    );
});

// Update student (Teacher Only)
router.route('/update/:sid').put(verifyToken, isTeacher, async (req, res) => {
  const studentID = req.params.sid;
  const { name, sid, gender, contactNumber, address, marks, attendance } = req.body;

  const updateStudent = { name, sid, gender, contactNumber, address, marks, attendance };

  await Student.findByIdAndUpdate(studentID, updateStudent, { new: true })
    .then((updatedStudent) => res.status(200).json(updatedStudent))
    .catch((err) =>
      res.status(500).json({ error: 'Error updating student', details: err.message })
    );
});

// Delete student (Teacher Only)
router.route('/delete/:sid').delete(verifyToken, isTeacher, async (req, res) => {
  const studentID = req.params.sid;

  await Student.findByIdAndDelete(studentID)
    .then(() => res.status(200).json({ status: 'Student Deleted Successfully' }))
    .catch((err) =>
      res.status(500).json({ error: 'Error deleting student', details: err.message })
    );
});

// Messaging: Student to Teacher
router.route('/message').post(verifyToken, isStudent, (req, res) => {
  const { teacherId, message } = req.body;

  
  res.status(200).json({ status: 'Message sent to teacher', teacherId, message });
});

// Bulk Add Students (Teacher Only)
router.route('/bulk-add').post(verifyToken, isTeacher, async (req, res) => {
  const { students } = req.body; // Expect an array of student objects

  try {
    await Student.insertMany(students);
    res.status(201).json('Students added successfully');
  } catch (err) {
    res.status(500).json({ error: 'Error adding students in bulk', details: err.message });
  }
});

module.exports = router;
