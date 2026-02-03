const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const PORT = process.env.PORT || 5000;
// Default to local if no env provided, but user asked for Atlas.
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/onlinequiz';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

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

// Start Server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
