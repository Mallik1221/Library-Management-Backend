const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Example of a protected route
router.get('/admin', protect, admin, (req, res) => {
  res.json({ message: 'Welcome to Admin Dashboard!' });
});

module.exports = router;
