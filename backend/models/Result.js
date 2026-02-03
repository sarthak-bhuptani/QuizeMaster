const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    exam_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    marks: { type: Number, required: true },
    total_marks: { type: Number, required: true }, // Added to calc percentage easily
    date: { type: Date, default: Date.now },
    answers: [{
        question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        selected_option: String,
        is_correct: Boolean
    }]
}, { timestamps: true });

module.exports = mongoose.model('Result', ResultSchema);
