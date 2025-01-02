const express = require('express');
const router = express.Router();
const Teacher = require('../models/teacher');  // Import the Teacher model
const { verifyToken } = require('../middleware/authMiddleware'); // Token verification middleware

// Get all teachers
router.get('/', verifyToken, async (req, res) => {
  try {
    const teachers = await Teacher.find(); // Fetch all teachers
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single teacher by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id); // Find teacher by ID
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new teacher
router.post('/', verifyToken, async (req, res) => {
  const { name, email, password, subject } = req.body;

  const newTeacher = new Teacher({
    name,
    email,
    password,  // Ensure password is hashed before saving (implement hashing in the actual code)
    subject,
  });

  try {
    const savedTeacher = await newTeacher.save();  // Save the teacher to the database
    res.status(201).json(savedTeacher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a teacher by ID
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);  // Find teacher by ID
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const { name, email, subject } = req.body;

    // Update teacher fields
    teacher.name = name || teacher.name;
    teacher.email = email || teacher.email;
    teacher.subject = subject || teacher.subject;

    const updatedTeacher = await teacher.save();  // Save updated teacher
    res.json(updatedTeacher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a teacher by ID
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);  // Find teacher by ID
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    await teacher.remove();  // Remove teacher
    res.status(204).send();  // No content to send after deletion
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add an announcement to a teacher's profile
router.post('/:id/announcements', verifyToken, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);  // Find teacher by ID
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const { title, content } = req.body;

    // Create a new announcement
    const newAnnouncement = { title, content };

    teacher.announcements.push(newAnnouncement);  // Add the announcement to the teacher's announcements array

    const updatedTeacher = await teacher.save();  // Save the updated teacher document
    res.status(201).json(updatedTeacher);  // Return the updated teacher
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an announcement for a teacher
router.put('/:teacherId/announcements/:announcementId', verifyToken, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.teacherId);  // Find teacher by ID
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const announcement = teacher.announcements.id(req.params.announcementId); // Find announcement by ID
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    const { title, content } = req.body;

    // Update the announcement fields
    announcement.title = title || announcement.title;
    announcement.content = content || announcement.content;

    const updatedTeacher = await teacher.save();  // Save the updated teacher document
    res.json(updatedTeacher);  // Return the updated teacher with the modified announcement
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an announcement for a teacher
router.delete('/:teacherId/announcements/:announcementId', verifyToken, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.teacherId);  // Find teacher by ID
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const announcement = teacher.announcements.id(req.params.announcementId);  // Find the announcement by ID
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Remove the announcement from the teacher's array
    announcement.remove();

    const updatedTeacher = await teacher.save();  // Save the updated teacher document
    res.status(204).send();  // No content to send after deletion
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
