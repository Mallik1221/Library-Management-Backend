const cron = require('node-cron');
const Book = require('../models/Book');
const User = require('../models/User');
const sendEmail = require('./emailService');

// Schedule Job to Run Every Day at Midnight (12 AM)
cron.schedule('0 0 * * *', async () => {
  console.log('Running Due Date Notification Job...');
  const currentDate = new Date();

  try {
    const books = await Book.find({ status: 'Borrowed' }).populate('borrower');

    for (const book of books) {
      if (!book.borrower) continue;

      const daysUntilDue = Math.ceil((book.dueDate - currentDate) / (1000 * 60 * 60 * 24));

      // Send Reminder (1 Day Before Due Date)
      if (daysUntilDue === 1) {
        await sendEmail(
          book.borrower.email,
          'Reminder: Book Due Soon',
          `<p>Dear ${book.borrower.name},</p>
          <p>This is a reminder that your book "<b>${book.title}</b>" is due tomorrow. Please return it on time to avoid any fines.</p>
          <p>Thank you!</p>`
        );
      }

      // Send Overdue Notification
      if (daysUntilDue < 0) {
        const daysLate = Math.abs(daysUntilDue);
        const fine = daysLate * 10;
        await sendEmail(
          book.borrower.email,
          'Overdue Alert: Book Not Returned',
          `<p>Dear ${book.borrower.name},</p>
          <p>Your book "<b>${book.title}</b>" is overdue by ${daysLate} days. A fine of ₹${fine} has been applied.</p>
          <p>Please return the book immediately to avoid further charges.</p>`
        );
      }
    }
    console.log('Notification job completed.');
  } catch (error) {
    console.error('Error running notification job:', error);
  }
});

// Run every minute for testing purposes
// cron.schedule('* * * * *', async () => {
//   console.log('Running Due Date Notification Job...');

//   const currentDate = new Date();

//   try {
//     const books = await Book.find({ status: 'Borrowed' }).populate('borrower');

//     for (const book of books) {
//       if (!book.borrower) continue;

//       const daysUntilDue = Math.ceil((book.dueDate - currentDate) / (1000 * 60 * 60 * 24));

//       if (daysUntilDue === 1) {
//         console.log(`Sending Reminder: Book "${book.title}" is due tomorrow.`);
//         await sendEmail(
//           book.borrower.email,
//           'Reminder: Book Due Soon',
//           `<p>Dear ${book.borrower.name},</p>
//           <p>Your book "<b>${book.title}</b>" is due tomorrow. Please return it on time to avoid any fines.</p>
//           <p>Thank you!</p>`
//         );
//       }

//       if (daysUntilDue < 0) {
//         const daysLate = Math.abs(daysUntilDue);
//         const fine = daysLate * 10;
//         console.log(`Sending Overdue Notification: Book "${book.title}" is overdue.`);
//         await sendEmail(
//           book.borrower.email,
//           'Overdue Alert: Book Not Returned',
//           `<p>Dear ${book.borrower.name},</p>
//           <p>Your book "<b>${book.title}</b>" is overdue by ${daysLate} days. A fine of ₹${fine} has been applied.</p>
//           <p>Please return the book immediately to avoid further charges.</p>`
//         );
//       }
//     }
//     console.log('Notification job completed.');
//   } catch (error) {
//     console.error('Error running notification job:', error);
//   }
// });
