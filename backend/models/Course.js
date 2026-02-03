const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    course_name: { type: String, required: true },
    question_number: { type: Number, required: true },
    total_marks: { type: Number, required: true },
    time_limit: { type: Number, default: 30 } // Duration in minutes
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
