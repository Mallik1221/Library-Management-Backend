const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const { addBook } = require('../controllers/bookController');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Example of a protected route
router.get('/admin', protect, admin, (req, res) => {
  res.json({ message: 'Welcome to Admin Dashboard!' });
});

// Add book with image upload
router.post('/', protect, upload.single('bookImage'), addBook);

module.exports = router;
