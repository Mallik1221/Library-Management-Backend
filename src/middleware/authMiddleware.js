const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect route - Verify JWT Token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin Middleware - Check if user is Admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admin only' });
  }
};

// Check for Admin or Librarian role
const adminOrLibrarian = (req, res, next) => {
  if (req.user.role === 'Admin' || req.user.role === 'Librarian') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admin or Librarian only' });
  }
};

//Check for Librarian role only
const Librarian = (req, res, next) => {
  if (req.user.role === 'Librarian') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Librarian only' });
  }
};



module.exports = { protect, adminOrLibrarian, admin ,Librarian };
