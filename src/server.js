require('dotenv').config(); 
const express = require('express');
// const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cronJobs = require('./utils/cronJobs'); // Import Cron Jobs
const dashboardRoutes = require('./routes/dashboardRoutes');

// dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Routes

//Authentication Routes
app.use('/api/auth', authRoutes);
//Book routes
app.use('/api/books', require('./routes/bookRoutes'));
//Dashboard routes
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
