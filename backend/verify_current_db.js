const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

const Course = require('./models/Course');
const Result = require('./models/Result');
const Student = require('./models/Student');

async function checkDB() {
    const uri = process.env.MONGO_URI;
    console.log('Connecting to:', uri ? uri.split('@').pop() : 'Undefined'); // hide credentials

    try {
        await mongoose.connect(uri);
        console.log('✅ Connected');

        const courses = await Course.countDocuments();
        const students = await Student.countDocuments();
        const results = await Result.countDocuments();

        console.log('--- Stats ---');
        console.log(`Courses: ${courses}`);
        console.log(`Students: ${students}`);
        console.log(`Results: ${results}`);

        if (results > 0) {
            const sample = await Result.find().populate('student_id').limit(3);
            console.log('--- Sample Result ---');
            console.log(JSON.stringify(sample, null, 2));
        } else {
            console.log('--- No Results found ---');
        }

        process.exit();
    } catch (error) {
        console.error('❌ Connection Failed:', error.message);
        process.exit(1);
    }
}

checkDB();
