const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
  },
  status: {
    type: String,
    enum: ['Available', 'Borrowed'],
    default: 'Available',
  },
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  borrowedAt: {
    type: Date,
    default: null,
  },
  dueDate: {
    type: Date,
    default: null,
  },
  fine: {
    type: Number,
    default: 0,
  },
  availableCopies: {
    type: Number,
    required: true,
  },
  totalCopies: {
    type: Number,
    required: true,
  },
  bookImage: {
    type: String, // Store image URL
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);
