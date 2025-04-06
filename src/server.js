require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cronJobs = require('./utils/cronJobs');
const { scheduleCleanup } = require('./utils/cleanup');
const dashboardRoutes = require('./routes/dashboardRoutes');
const path = require('path');
const fs = require('fs');
const userRoutes = require('./routes/userRoutes');

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

// Initialize cleanup scheduler
scheduleCleanup();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
