const jwt = require('jsonwebtoken');
const User = require('../models/user');  // Assuming you have a User model

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = user;  // Attach the user to the request object
    next();  // Proceed to the next middleware/route handler
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
