const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { first_name, last_name, username, password, mobile, address, profile_pic, status } = req.body;

        if (!first_name || !last_name || !username || !password || !mobile) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const existingTeacher = await Teacher.findOne({ 'user.username': username });
        if (existingTeacher) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const newTeacher = new Teacher({
            user: { first_name, last_name, username, password },
            mobile,
            address,
            profile_pic,
            status: status !== undefined ? status : false // Use provided status or default to false
        });

        await newTeacher.save();
        res.status(201).json({ message: 'Teacher registered successfully. Please wait for approval.', teacherId: newTeacher._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const teacher = await Teacher.findOne({ 'user.username': username, 'user.password': password });

        if (!teacher) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful', teacherId: teacher._id, name: teacher.user.first_name, status: teacher.status });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get Teacher Profile
router.get('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
        res.json(teacher);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update Teacher Profile
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, username, password, mobile, address, profile_pic } = req.body;

        const teacher = await Teacher.findById(id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

        if (first_name) teacher.user.first_name = first_name;
        if (last_name) teacher.user.last_name = last_name;
        if (username) teacher.user.username = username;
        if (password) teacher.user.password = password;
        if (mobile) teacher.mobile = mobile;
        if (address) teacher.address = address;
        if (profile_pic) teacher.profile_pic = profile_pic;

        await teacher.save();
        res.json({ message: 'Profile updated successfully', teacher });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
});

// Delete Teacher Account
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Teacher.findByIdAndDelete(id);
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting account', error: error.message });
    }
});

module.exports = router;
