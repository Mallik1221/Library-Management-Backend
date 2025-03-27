const nodemailer = require('nodemailer');

// Configure Transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail ID
    pass: process.env.EMAIL_PASS, // App Password or Gmail Password
  },
});

// Send Email Function
const sendEmail = async (to, subject, message) => {
  try {
    await transporter.sendMail({
      from: `"Library Management System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: message,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
