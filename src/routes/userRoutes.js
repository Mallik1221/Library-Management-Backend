const express = require('express');
const router = express.Router();
const { getUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are protected and admin-only
router.use(protect, admin);

// Get all users
router.get('/', getUsers);

// Update user
router.put('/:id', updateUser);

// Delete user (with cleanup)
router.delete('/:id', deleteUser);

module.exports = router; 