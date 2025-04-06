const User = require('../models/User');
const Borrow = require('../models/Borrow');
const Book = require('../models/Book');

// @desc Get all users
// @route GET /api/users
// @access Admin Only
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update user
// @route PUT /api/users/:id
// @access Admin Only
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete user
// @route DELETE /api/users/:id
// @access Admin Only
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find all active borrowings for this user
    const activeBorrowings = await Borrow.find({
      user: user._id,
      returnedAt: null
    });

    // Update books to available and clear borrower info
    for (const borrowing of activeBorrowings) {
      await Book.findByIdAndUpdate(borrowing.book, {
        status: 'Available',
        borrower: null,
        borrowedAt: null,
        dueDate: null,
        availableCopies: { $inc: 1 }
      });
    }

    // Delete all borrowing records for this user
    await Borrow.deleteMany({ user: user._id });

    // Finally delete the user
    await user.deleteOne();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  updateUser,
  deleteUser
}; 