const router = require('express').Router();
const Teacher = require('../models/teacher');

// Route to add an announcement (Teacher only)
router.route('/add').post(verifyToken, isTeacher, (req, res) => {
  const { title, message } = req.body;

  const newAnnouncement = new Teacher.Announcement({
    title,
    message,
    date: new Date(),
  });

  newAnnouncement
    .save()
    .then(() => res.status(201).json('Announcement added successfully'))
    .catch((err) => res.status(500).json({ error: 'Error adding announcement', details: err.message }));
});

// Route to fetch announcements (For all users)
router.route('/get').get((req, res) => {
  Teacher.Announcement.find()
    .then((announcements) => res.status(200).json(announcements))
    .catch((err) => res.status(500).json({ error: 'Error fetching announcements', details: err.message }));
});

module.exports = router;
