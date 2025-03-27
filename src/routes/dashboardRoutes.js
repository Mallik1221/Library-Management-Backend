const express = require('express');
const { getAdminDashboard, getLibrarianDashboard } = require('../controllers/dashboardController');
const { protect, admin,Librarian } = require('../middleware/authMiddleware');
const router = express.Router();

// Admin Dashboard (Admin Only)
router.get('/admin', protect, admin, getAdminDashboard);

// Librarian Dashboard (Librarian Only)
router.get('/librarian', protect, Librarian, getLibrarianDashboard);

module.exports = router;
