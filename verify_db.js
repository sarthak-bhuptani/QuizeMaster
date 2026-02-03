const mongoose = require('mongoose');
const Course = require('./backend/models/Course');
const Question = require('./backend/models/Question');
const Result = require('./backend/models/Result');

mongoose.connect('mongodb://localhost:27017/onlinequiz')
    .then(async () => {
        console.log('Connected to DB');

        const courseCount = await Course.countDocuments();
        console.log('Course Count:', courseCount);

        const courses = await Course.find();
        console.log('Courses:', JSON.stringify(courses, null, 2));

        const resultCount = await Result.countDocuments();
        console.log('Result Count:', resultCount);

        const results = await Result.find().populate('student_id').limit(5);
        console.log('Results Sample:', JSON.stringify(results, null, 2));

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
