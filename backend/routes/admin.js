const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');

// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Admin Login attempt: [${email}]`);
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email/Username and password are required' });
        }

        const cleanIdentifier = email.trim();
        const admin = await Admin.findOne({ 
            $or: [
                { email: { $regex: new RegExp(`^${cleanIdentifier}$`, 'i') } },
                { username: cleanIdentifier }
            ]
        });

        if (!admin) {
            console.log(`Admin Login failed: user [${cleanIdentifier}] not found`);
            return res.status(401).json({ message: 'Admin account not found.' });
        }

        if (admin.password !== password) {
            console.log(`Admin Login failed: Incorrect password for [${cleanIdentifier}]`);
            return res.status(401).json({ message: 'Incorrect Admin password.' });
        }

        console.log(`Admin Login success: [${admin.email}]`);
        res.json({ message: 'Login successful', adminId: admin._id, name: admin.name });
    } catch (error) {
        console.error('ADMIN_LOGIN_ERROR:', error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
});

// Create Admin
router.post('/create', async (req, res) => {
    try {
        const { username, email, password, name } = req.body;
        const newAdmin = new Admin({ username, email, password, name });
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

// Update Teacher
router.put('/update-teacher/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, username, email, mobile, address, password } = req.body;
        
        const teacher = await Teacher.findById(id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

        if (first_name) teacher.user.first_name = first_name;
        if (last_name) teacher.user.last_name = last_name;
        if (username) teacher.user.username = username;
        if (email) teacher.user.email = email;
        if (password) teacher.user.password = password;
        if (mobile) teacher.mobile = mobile;
        if (address) teacher.address = address;

        await teacher.save();
        res.json({ message: 'Teacher updated successfully', teacher });
    } catch (error) {
        res.status(500).json({ message: 'Error updating teacher', error: error.message });
    }
});

// Update Student
router.put('/update-student/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, username, email, mobile, address, password } = req.body;
        
        const student = await Student.findById(id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        if (first_name) student.user.first_name = first_name;
        if (last_name) student.user.last_name = last_name;
        if (username) student.user.username = username;
        if (email) student.user.email = email;
        if (password) student.user.password = password;
        if (mobile) student.mobile = mobile;
        if (address) student.address = address;

        await student.save();
        res.json({ message: 'Student updated successfully', student });
    } catch (error) {
        res.status(500).json({ message: 'Error updating student', error: error.message });
    }
});

module.exports = router;
