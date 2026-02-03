const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');

// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Simple check (in production use hashed passwords!)
        const admin = await Admin.findOne({ username, password });

        if (!admin) {
            return res.status(401).json({ message: 'Invalid Admin Credentials' });
        }
        res.json({ message: 'Login successful', adminId: admin._id, name: admin.name });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create Admin (One-time setup usually, but exposed here for ease)
router.post('/create', async (req, res) => {
    try {
        const { username, password, name } = req.body;
        const newAdmin = new Admin({ username, password, name });
        await newAdmin.save();
        res.status(201).json({ message: 'Admin created' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin', error: error.message });
    }
});

// Dashboard Stats
router.get('/stats', async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const totalTeachers = await Teacher.countDocuments();
        const totalCourses = await Course.countDocuments();
        const pendingTeachers = await Teacher.countDocuments({ status: false });

        res.json({
            totalStudents,
            totalTeachers,
            totalCourses,
            pendingTeachers
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

// Get Teachers (to approve or view)
router.get('/teachers', async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching teachers' });
    }
});

// Approve Teacher
router.put('/approve-teacher/:id', async (req, res) => {
    try {
        await Teacher.findByIdAndUpdate(req.params.id, { status: true });
        res.json({ message: 'Teacher approved' });
    } catch (error) {
        res.status(500).json({ message: 'Error approving teacher' });
    }
});

const Question = require('../models/Question');

// ... (existing imports)

// Get Full System Data (for Admin View)
router.get('/system-data', async (req, res) => {
    try {
        const students = await Student.find().lean();
        const teachers = await Teacher.find().lean();
        const courses = await Course.find().lean();
        const questions = await Question.find().lean();
        const admins = await Admin.find().lean();

        // Calculate accurate stats for each course
        const coursesWithStats = courses.map(course => {
            const quizQuestions = questions.filter(q => String(q.course_id) === String(course._id));
            return {
                ...course,
                question_number: quizQuestions.length,
                total_marks: quizQuestions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0)
            };
        });

        res.json({
            students,
            teachers,
            courses: coursesWithStats,
            questions,
            admins
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching system data', error: error.message });
    }
});

// Delete Teacher
router.delete('/delete-teacher/:id', async (req, res) => {
    try {
        await Teacher.findByIdAndDelete(req.params.id);
        res.json({ message: 'Teacher deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting teacher' });
    }
});

// Delete Student
router.delete('/delete-student/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting student' });
    }
});

// Delete Course
router.delete('/delete-course/:id', async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        // Also delete related questions to keep DB clean
        await Question.deleteMany({ course_id: req.params.id });
        res.json({ message: 'Course deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting course' });
    }
});

module.exports = router;
