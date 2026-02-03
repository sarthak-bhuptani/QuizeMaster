const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Question = require('../models/Question');
const Result = require('../models/Result');
const Student = require('../models/Student');

// Get all courses (Quizzes)
router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find().lean();
        const questions = await Question.find().lean();

        const updatedCourses = courses.map(course => {
            const courseQuestions = questions.filter(q => String(q.course_id) === String(course._id));
            return {
                ...course,
                question_number: courseQuestions.length,
                total_marks: courseQuestions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0)
            };
        });

        res.json(updatedCourses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
});

// Create a new Course (Quiz) - Teacher only
router.post('/courses', async (req, res) => {
    try {
        const { course_name, question_number, total_marks } = req.body;
        const newCourse = new Course({ course_name, question_number, total_marks });
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ message: 'Error creating course', error: error.message });
    }
});

// Helper to update course stats
const updateCourseStats = async (courseId) => {
    const questions = await Question.find({ course_id: courseId });
    const count = questions.length;
    const marks = questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
    await Course.findByIdAndUpdate(courseId, {
        question_number: count,
        total_marks: marks
    });
};

// Add a question to a course
router.post('/questions', async (req, res) => {
    try {
        const { course_id, question, option1, option2, option3, option4, answer, marks } = req.body;
        const newQuestion = new Question({
            course_id, question, option1, option2, option3, option4, answer, marks
        });
        await newQuestion.save();

        // Update Course Stats
        await updateCourseStats(course_id);

        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(500).json({ message: 'Error adding question', error: error.message });
    }
});

// Get questions for a specific course
router.get('/questions/:courseId', async (req, res) => {
    try {
        const questions = await Question.find({ course_id: req.params.courseId });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching questions', error: error.message });
    }
});

// Save Exam Result & Gamification Logic
router.post('/results', async (req, res) => {
    try {
        const { student_id, exam_id, marks, total_marks, answers } = req.body;
        const newResult = new Result({
            student_id,
            exam_id,
            marks,
            total_marks,
            answers
        });
        await newResult.save();

        // --- Gamification Logic Start ---
        if (student_id) {
            const student = await Student.findById(student_id);
            if (student) {
                // 1. Calculate XP Gained (e.g., 10 XP per mark)
                const xpGained = marks * 10;
                student.xp += xpGained;

                // 2. Level Up Logic (Simple: Level = sqrt(XP / 100))
                // Level 1: 0-99, Level 2: 100-399, Level 3: 400-899...
                const newLevel = Math.floor(Math.sqrt(student.xp / 100)) + 1;
                if (newLevel > student.level) {
                    student.level = newLevel;
                    // Could add a notification here or return a flag
                }

                // 3. Check for Badges
                const existingBadges = student.badges.map(b => b.name);

                // Badge: "First Blood" - Validated by having at least 1 result (this one)
                if (!existingBadges.includes('First Blood')) {
                    student.badges.push({ name: 'First Blood', icon: 'Sword' });
                }

                // Badge: "Sharpshooter" - 100% Score
                if (marks === total_marks && total_marks > 0 && !existingBadges.includes('Sharpshooter')) {
                    student.badges.push({ name: 'Sharpshooter', icon: 'Target' });
                }

                // Badge: "Obsidian Scholar" - Reach Level 5
                if (student.level >= 5 && !existingBadges.includes('Obsidian Scholar')) {
                    student.badges.push({ name: 'Obsidian Scholar', icon: 'Award' });
                }

                // Badge: "Quantum Overlord" - Reach 10,000 XP
                if (student.xp >= 10000 && !existingBadges.includes('Quantum Overlord')) {
                    student.badges.push({ name: 'Quantum Overlord', icon: 'Crown' });
                }

                await student.save();
            }
        }
        // --- Gamification Logic End ---

        res.status(201).json(newResult);
    } catch (error) {
        res.status(500).json({ message: 'Error saving result', error: error.message });
    }
});

// Get Results for a specific student
router.get('/results/student/:studentId', async (req, res) => {
    try {
        const results = await Result.find({ student_id: req.params.studentId })
            .populate('exam_id', 'course_name')
            .sort({ date: -1 });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching student results', error: error.message });
    }
});

// Get Results (for Leaderboard/Dashboard - Unique Student Ranking)
router.get('/results', async (req, res) => {
    try {
        // Aggregate to find the BEST score for EACH student
        const ranking = await Result.aggregate([
            { $sort: { marks: -1, date: -1 } },
            {
                $group: {
                    _id: "$student_id",
                    bestMarks: { $first: "$marks" },
                    total_marks: { $first: "$total_marks" },
                    exam_id: { $first: "$exam_id" },
                    date: { $first: "$date" }
                }
            },
            { $sort: { bestMarks: -1 } },
            { $limit: 100 }
        ]);

        // Populate details manually
        const populatedRanking = await Promise.all(ranking.map(async (item) => {
            const student = await Student.findById(item._id).populate('user');
            const exam = await Course.findById(item.exam_id);
            return {
                student_id: student,
                exam_id: exam,
                marks: item.bestMarks,
                total_marks: item.total_marks,
                date: item.date
            };
        }));

        res.json(populatedRanking);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ranking', error: error.message });
    }
});

// Get Single Result
router.get('/results/:id', async (req, res) => {
    try {
        const result = await Result.findById(req.params.id)
            .populate({ path: 'student_id', populate: { path: 'user' } })
            .populate('exam_id');
        if (!result) return res.status(404).json({ message: 'Result not found' });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching result', error: error.message });
    }
});

// Delete Result
router.delete('/results/:id', async (req, res) => {
    try {
        await Result.findByIdAndDelete(req.params.id);
        res.json({ message: 'Result deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting result' });
    }
});

// Delete Course (Quiz)
router.delete('/courses/:id', async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        await Question.deleteMany({ course_id: req.params.id });
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting course' });
    }
});

// Delete Question
router.delete('/questions/:id', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (question) {
            const courseId = question.course_id;
            await Question.findByIdAndDelete(req.params.id);
            await updateCourseStats(courseId);
        }
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting question' });
    }
});

// Update Question
router.put('/questions/:id', async (req, res) => {
    try {
        const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedQuestion) {
            await updateCourseStats(updatedQuestion.course_id);
        }
        res.json(updatedQuestion);
    } catch (error) {
        res.status(500).json({ message: 'Error updating question' });
    }
});

module.exports = router;

