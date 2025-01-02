const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Ensure this model is correctly defined and used

// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from the "Authorization" header
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded; // Save decoded token data (e.g., userType and userId) to `req.user`
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized, token invalid or expired' });
  }
};

// Middleware to check if the user is a teacher
const isTeacher = (req, res, next) => {
  if (req.user.userType !== 'teacher') {
    return res.status(403).json({ error: 'Access denied, only teachers can perform this action' });
  }
  next();
};

// Middleware to check if the user is a student
const isStudent = (req, res, next) => {
  if (req.user.userType !== 'student') {
    return res.status(403).json({ error: 'Access denied, only students can perform this action' });
  }
  next();
};

module.exports = { verifyToken, isTeacher, isStudent };
