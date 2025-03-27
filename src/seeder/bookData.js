const mongoose = require('mongoose');
const Book = require('../models/Book');

const books = [
  {
    title: 'Node.js for Beginners',
    author: 'Jane Smith',
    category: 'Programming',
    isbn: '1234567890',
    status: 'Borrowed',
    availableCopies: 3,
    totalCopies: 5,
    image: 'https://example.com/book1.png',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Due in 5 days
  },
  {
    title: 'Learn React in 30 Days',
    author: 'John Doe',
    category: 'Web Development',
    isbn: '9876543210',
    status: 'Available',
    availableCopies: 5,
    totalCopies: 5,
    image: 'https://example.com/book2.png',
  }
];

module.exports = books;
