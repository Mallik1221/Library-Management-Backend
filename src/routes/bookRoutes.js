const express = require('express');
const router = express.Router();
const {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
  getUserHistory,
  getRecentBorrowings,
  getDashboardStats
} = require('../controllers/bookController');
const { protect, adminOrLibrarian } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getBooks);
router.get('/:id', getBookById);

// Protected routes - Admin/Librarian only
router.get('/stats/dashboard', protect, adminOrLibrarian, getDashboardStats);
router.post('/', protect, adminOrLibrarian, upload.single('bookImage'), addBook);
router.put('/:id', protect, adminOrLibrarian, upload.single('bookImage'), updateBook);
router.delete('/:id', protect, adminOrLibrarian, deleteBook);

// Member routes
router.post('/:id/borrow', protect, borrowBook);
router.post('/:id/return', protect, returnBook);
router.get('/user/history', protect, getUserHistory);

// Get recent borrowings (Librarian & Admin only)
router.get('/borrowings/recent', protect, adminOrLibrarian, getRecentBorrowings);

module.exports = router;
