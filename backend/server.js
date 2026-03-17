const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: '*', // Allows all origins, you can change this to your Netlify URL later for security
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logger for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Database Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('MONGO_URI is missing');
}

// Optimization for Vercel: cached connection
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(MONGO_URI);
        isConnected = true;
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('UPDATE_PROFILE_ERROR:', error.name, error.message);
        // This `res` object is not available in this scope.
        // This line will cause a ReferenceError if executed.
        // It's likely intended for an API route's catch block.
        // res.status(500).json({ message: 'Error updating profile', error: error.message });
        // Reverting to original error handling for connectDB to prevent crash.
        console.error('DB Connection Error:', error.message);
    }
};

// Middleware to ensure DB is connected
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Routes
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');
const examRoutes = require('./routes/exam');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', require('./routes/aiRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('SERVER_ERROR:', err);
    res.status(500).json({ 
        message: 'Something went wrong on the server', 
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

app.get('/', (req, res) => {
    res.send('Online Quiz API is running');
});

// Import Models (Just to ensure they register)
require('./models/Teacher');
require('./models/Student');
require('./models/Course');
require('./models/Question');
require('./models/Result');

const PORT = process.env.PORT || 5001;

// Start Server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
