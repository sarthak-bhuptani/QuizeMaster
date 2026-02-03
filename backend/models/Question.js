const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    marks: { type: Number, required: true },
    question: { type: String, required: true },
    option1: { type: String, required: true },
    option2: { type: String, required: true },
    option3: { type: String, required: true },
    option4: { type: String, required: true },
    answer: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
