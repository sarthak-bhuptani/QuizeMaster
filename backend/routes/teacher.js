const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');


// Signup
router.post('/signup', async (req, res) => {
    try {
        console.log('Incoming Teacher Signup Request:', req.body);
        const { first_name, last_name, email, username, password, mobile, address, profile_pic, status } = req.body;

        if (!first_name || !last_name || !email || !username || !password || !mobile) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        // Check for duplicates
        const normalizedEmail = email.toLowerCase();
        const existingTeacher = await Teacher.findOne({ 
            $or: [{ 'user.username': username }, { 'user.email': normalizedEmail }] 
        });
        const existingStudent = await Student.findOne({ 
            $or: [{ 'user.username': username }, { 'user.email': normalizedEmail }] 
        });
        
        if (existingTeacher || existingStudent) {
            const conflict = (existingTeacher || existingStudent).user;
            if (conflict.email.toLowerCase() === normalizedEmail) {
                return res.status(400).json({ message: 'This email is already registered. Please login or use a different email.' });
            }
            return res.status(400).json({ message: 'Username already in use. Please pick another one.' });
        }

        const newTeacher = new Teacher({
            user: { 
                first_name, 
                last_name, 
                email: normalizedEmail, 
                username, 
                password 
            },
            mobile,
            address: address || '',
            profile_pic: profile_pic || '',
            status: status !== undefined ? status : false
        });

        const savedTeacher = await newTeacher.save();
        console.log('Teacher created successfully:', savedTeacher._id);
        res.status(201).json({ message: 'Teacher registered successfully. Please wait for approval.', teacherId: savedTeacher._id });
    } catch (error) {
        console.error('TEACHER_SIGNUP_ERROR:', error);
        res.status(500).json({ 
            message: 'Server error during registration', 
            error: error.message 
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Teacher Login attempt: [${email}]`);

        if (!email || !password) {
            return res.status(400).json({ message: 'Email/Username and password are required' });
        }

        const cleanIdentifier = email.trim();
        const teacher = await Teacher.findOne({
            $or: [
                { 'user.email': { $regex: new RegExp(`^${cleanIdentifier}$`, 'i') } },
                { 'user.username': cleanIdentifier }
            ]
        });

        if (!teacher) {
            console.log(`Teacher Login failed: User [${cleanIdentifier}] not found`);
            return res.status(401).json({ message: 'Teacher account not found.' });
        }

        if (teacher.user.password !== password) {
            console.log(`Teacher Login failed: Incorrect password for [${cleanIdentifier}]`);
            return res.status(401).json({ message: 'Incorrect password.' });
        }

        console.log(`Teacher Login success: [${teacher.user.email}]`);
        res.json({ message: 'Login successful', teacherId: teacher._id, name: teacher.user.first_name, status: teacher.status });
    } catch (error) {
        console.error('TEACHER_LOGIN_ERROR:', error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
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
        if (username) {
            const existingTeacher = await Teacher.findOne({ 'user.username': username, _id: { $ne: id } });
            const existingStudent = await Student.findOne({ 'user.username': username });
            if (existingTeacher || existingStudent) {
                return res.status(400).json({ message: 'Username already exists' });
            }
            teacher.user.username = username;
        }

        if (req.body.email) {
            const email = req.body.email;
            const existingTeacher = await Teacher.findOne({ 'user.email': email, _id: { $ne: id } });
            const existingStudent = await Student.findOne({ 'user.email': email });
            if (existingTeacher || existingStudent) {
                return res.status(400).json({ message: 'Email already exists' });
            }
            teacher.user.email = email;
        }

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
