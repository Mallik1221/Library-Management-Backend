const express = require('express');
const {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');
const { protect, adminOrLibrarian, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { borrowBook,returnBook,getUserHistory  } = require('../controllers/bookController');

const router = express.Router();

router.get('/history', protect, getUserHistory); // Protected Route Member to check history

// Public Routes
// router.get('/', getBooks);
router.get('/:id', getBookById);

// Admin or Librarian Routes
router.post('/', protect, adminOrLibrarian, upload.single('bookImage'), addBook);
router.put('/:id', protect, adminOrLibrarian, upload.single('bookImage'), updateBook);

// Admin Only Route
router.delete('/:id', protect, admin, deleteBook);

//Book borrow routes
router.post('/:id/borrow', protect, borrowBook);
router.post('/:id/return', protect, returnBook);

router.get('/', getBooks); // Public Route to search and filter books


module.exports = router;
