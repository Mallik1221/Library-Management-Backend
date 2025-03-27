const Book = require('../models/Book');
const User = require('../models/User');

// @desc Get admin dashboard data
// @route GET /api/dashboard/admin
// @access Admin Only
const getAdminDashboard = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments({});
    const availableBooks = await Book.countDocuments({ status: 'Available' });
    const borrowedBooks = await Book.countDocuments({ status: 'Borrowed' });
    const totalUsers = await User.countDocuments({});
    const totalPendingFines = await Book.aggregate([
      { $match: { fine: { $gt: 0 } } },
      { $group: { _id: null, totalFine: { $sum: '$fine' } } }
    ]);

    const recentActivity = await Book.find({})
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate('borrower', 'name email');

    res.status(200).json({
      totalBooks,
      availableBooks,
      borrowedBooks,
      totalUsers,
      totalPendingFines: totalPendingFines[0]?.totalFine || 0,
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get librarian dashboard data
// @route GET /api/dashboard/librarian
// @access Librarian Only
const getLibrarianDashboard = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments({});
    const availableBooks = await Book.countDocuments({ status: 'Available' });
    const borrowedBooks = await Book.countDocuments({ status: 'Borrowed' });
    const totalPendingFines = await Book.aggregate([
      { $match: { fine: { $gt: 0 } } },
      { $group: { _id: null, totalFine: { $sum: '$fine' } } }
    ]);

    const recentActivity = await Book.find({})
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate('borrower', 'name email');

    res.status(200).json({
      totalBooks,
      availableBooks,
      borrowedBooks,
      totalPendingFines: totalPendingFines[0]?.totalFine || 0,
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminDashboard, getLibrarianDashboard };
