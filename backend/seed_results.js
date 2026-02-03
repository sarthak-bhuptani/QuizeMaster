const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Course = require('./models/Course');
const Result = require('./models/Result');
const Student = require('./models/Student');

async function seedResults() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to DB');

        // 1. Get a student (or create one)
        let student = await Student.findOne();
        if (!student) {
            console.log('No student found. Creating dummy student...');
            student = new Student({
                user: {
                    first_name: 'Demo',
                    last_name: 'Student',
                    username: 'demostudent',
                    password: 'password123'
                },
                mobile: '1234567890'
            });
            await student.save();
        }

        // 2. Get a course
        let course = await Course.findOne();
        if (!course) {
            console.log('No course found. Creating dummy course...');
            course = new Course({
                course_name: 'General Knowledge 101',
                question_number: 5,
                total_marks: 50
            });
            await course.save();
        }

        // 3. Create Dummy Results
        const resultsData = [
            { marks: 45, total_marks: 50 },
            { marks: 30, total_marks: 50 },
            { marks: 50, total_marks: 50 }
        ];

        for (let data of resultsData) {
            const result = new Result({
                student_id: student._id,
                exam_id: course._id,
                marks: data.marks,
                total_marks: data.total_marks,
                answers: [] // Empty for dummy
            });
            await result.save();
        }

        console.log(`✅ Successfully added ${resultsData.length} dummy results!`);
        console.log('Refresh your dashboard to see them.');
        process.exit();

    } catch (error) {
        console.error('❌ Failed to seed:', error);
        process.exit(1);
    }
}

seedResults();
