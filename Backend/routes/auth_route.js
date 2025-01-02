const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key'; // Secret key for JWT token

// Signup route
// POST: /auth/signup
router.post('/signup', async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate userType
    if (!['student', 'teacher'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      userType, // 'student' or 'teacher'
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error during signup:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
// POST: /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      SECRET_KEY,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Return the token along with user details
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email, userType: user.userType },
    });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
