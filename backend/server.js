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
app.use(express.json());

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
    } catch (err) {
        console.error('DB Connection Error:', err.message);
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

app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', require('./routes/aiRoutes'));

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
