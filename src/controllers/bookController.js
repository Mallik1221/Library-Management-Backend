const Book = require('../models/Book');

// @desc Add a new book
// @route POST /api/books
// @access Admin or Librarian
const addBook = async (req, res) => {
  const { title, author, category, isbn, availableCopies, totalCopies } = req.body;

  if (!title || !author || !category || !isbn || !totalCopies) {
    return res.status(400).json({ message: 'All fields except image are required' });
  }

  try {
    const bookData = {
      title,
      author,
      category,
      isbn,
      availableCopies,
      totalCopies,
    };

    if (req.file) {
      bookData.bookImage = `/uploads/${req.file.filename}`;
    }

    const newBook = new Book(bookData);
    const savedBook = await newBook.save();

    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all books
// @route GET /api/books
// @access Public
// const getBooks = async (req, res) => {
//   try {
//     const books = await Book.find({});
//     res.status(200).json(books);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// @desc Get a book by ID
// @route GET /api/books/:id
// @access Public
const getBookById = async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Book ID' });
  }
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update book details
// @route PUT /api/books/:id
// @access Admin or Librarian
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const { title, author, category, isbn, availableCopies, totalCopies } = req.body;

    book.title = title || book.title;
    book.author = author || book.author;
    book.category = category || book.category;
    book.isbn = isbn || book.isbn;
    book.availableCopies = availableCopies ?? book.availableCopies;
    book.totalCopies = totalCopies ?? book.totalCopies;

    if (req.file) {
      book.bookImage = `/uploads/${req.file.filename}`;
    }

    const updatedBook = await book.save();
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a book
// @route DELETE /api/books/:id
// @access Admin
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    await book.deleteOne();
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Borrow a book
// @route POST /api/books/:id/borrow
// @access Member
const borrowBook = async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      if (book.status === 'Borrowed' || book.availableCopies === 0) {
        return res.status(400).json({ message: 'Book is currently unavailable' });
      }
  
      // Check if the member has already borrowed the book
      if (book.borrower && book.borrower.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'You have already borrowed this book' });
      }
  
      // Update book details
      book.status = 'Borrowed';
      book.borrower = req.user._id;
      book.borrowedAt = new Date();
      book.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      book.availableCopies -= 1;
  
      await book.save();
  
      res.status(200).json({
        message: 'Book borrowed successfully',
        book: {
          title: book.title,
          borrowedAt: book.borrowedAt,
          dueDate: book.dueDate,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  const returnBook = async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      if (!book.borrower || book.borrower.toString() !== req.user._id.toString()) {
        return res.status(400).json({ message: 'You did not borrow this book' });
      }
  
      // Calculate if the book is overdue
      const currentDate = new Date();
      let fine = 0;
  
      if (book.dueDate && currentDate > book.dueDate) {
        const daysLate = Math.ceil((currentDate - book.dueDate) / (1000 * 60 * 60 * 24));
        fine = daysLate * 5; // ₹10 per day late fee
      }
  
      // Update book details
      book.status = 'Available';
      book.borrower = null;
      book.borrowedAt = null;
      book.dueDate = null;
      book.fine = fine;
      book.availableCopies += 1;
  
      await book.save();
  
      res.status(200).json({
        message: 'Book returned successfully',
        fine: fine > 0 ? `₹${fine} has been applied for late return` : 'No fine applied',
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  // @desc Get all books with search and filters
// @route GET /api/books
// @access Public
    const getBooks = async (req, res) => {
    try {
      const { search, category, author, status, page = 1, limit = 10 } = req.query;
  
      // Build Query Object
      const query = {};
  
      // Search by Title, Author, or Category
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
        ];
      }
  
      // Filter by Category
      if (category) query.category = category;
  
      // Filter by Author
      if (author) query.author = author;
  
      // Filter by Status
      if (status) query.status = status;
  
      // Pagination
      const skip = (Number(page) - 1) * Number(limit);
      
      const books = await Book.find(query).skip(skip).limit(Number(limit));
      const totalBooks = await Book.countDocuments(query);
  
      res.status(200).json({
        totalBooks,
        currentPage: Number(page),
        totalPages: Math.ceil(totalBooks / limit),
        books,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  // @desc Get user borrowing and returning history
// @route GET /api/books/history
// @access Private (User Only)
const getUserHistory = async (req, res) => {
    try {
      const userId = req.user.id; // Extracted from JWT Token by protect middleware
  
      // Find all books borrowed or returned by the user
      const books = await Book.find({ borrower: userId }).sort({ updatedAt: -1 });
  
      // Format the response
      const history = books.map(book => ({
        title: book.title,
        author: book.author,
        category: book.category,
        status: book.status,
        borrowedAt: book.borrowedAt,
        dueDate: book.dueDate,
        returnedAt: book.status === 'Available' ? book.updatedAt : null,
        fine: book.fine,
      }));
  
      res.status(200).json({ history });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = { addBook, getBookById, updateBook, deleteBook,borrowBook,returnBook,getBooks,getUserHistory };
