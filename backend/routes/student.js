const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Get All Students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
});

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { first_name, last_name, username, password, mobile, address, profile_pic } = req.body;

        // Simple validation
        if (!first_name || !last_name || !username || !password || !mobile) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const existingStudent = await Student.findOne({ 'user.username': username });
        if (existingStudent) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const newStudent = new Student({
            user: { first_name, last_name, username, password },
            mobile,
            address,
            profile_pic
        });

        await newStudent.save();
        res.status(201).json({ message: 'Student registered successfully', studentId: newStudent._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // In a real app, use bcrypt to compare hashed passwords
        const student = await Student.findOne({ 'user.username': username, 'user.password': password });

        if (!student) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // In a real app, generate a JWT token here
        res.json({ message: 'Login successful', studentId: student._id, name: student.user.first_name });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get Student Profile
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update Student Profile
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, username, password, mobile, address, profile_pic } = req.body;

        const student = await Student.findById(id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        if (first_name) student.user.first_name = first_name;
        if (last_name) student.user.last_name = last_name;
        if (username) student.user.username = username;
        if (password) student.user.password = password;
        if (mobile) student.mobile = mobile;
        if (address) student.address = address;
        if (profile_pic) student.profile_pic = profile_pic;

        await student.save();
        res.json({ message: 'Profile updated successfully', student });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
});

// Delete Student Account
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Student.findByIdAndDelete(id);
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting account', error: error.message });
    }
});

module.exports = router;
