const mongoose = require('mongoose');
const Borrow = require('../models/Borrow');
const Book = require('../models/Book');
const User = require('../models/User');

// Clean up orphaned borrowing records
const cleanupOrphanedBorrowings = async () => {
  try {
    console.log('Starting cleanup of orphaned borrowing records...');

    // Get all borrowings
    const borrowings = await Borrow.find()
      .populate('book')
      .populate('user');

    // Find orphaned records
    const orphanedBorrowings = borrowings.filter(borrowing => 
      !borrowing.book || !borrowing.user
    );

    if (orphanedBorrowings.length > 0) {
      console.log(`Found ${orphanedBorrowings.length} orphaned borrowing records`);

      // Delete orphaned records
      const deletedCount = await Borrow.deleteMany({
        _id: { $in: orphanedBorrowings.map(b => b._id) }
      });

      console.log(`Deleted ${deletedCount.deletedCount} orphaned borrowing records`);
    } else {
      console.log('No orphaned borrowing records found');
    }

    return orphanedBorrowings.length;
  } catch (error) {
    console.error('Error in cleanupOrphanedBorrowings:', error);
    throw error;
  }
};

// Schedule cleanup to run daily at midnight
const scheduleCleanup = () => {
  const cron = require('node-cron');
  cron.schedule('0 0 * * *', async () => {
    console.log('Running scheduled cleanup...');
    try {
      await cleanupOrphanedBorrowings();
    } catch (error) {
      console.error('Error in scheduled cleanup:', error);
    }
  });
};

module.exports = {
  cleanupOrphanedBorrowings,
  scheduleCleanup
}; 