const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');


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
        console.log('Incoming Student Signup Request:', req.body);
        const { first_name, last_name, email, username, password, mobile, address, profile_pic } = req.body;

        // Validation
        if (!first_name || !last_name || !email || !username || !password || !mobile) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        // Check for duplicates
        const normalizedEmail = email.toLowerCase();
        const existingStudent = await Student.findOne({ 
            $or: [{ 'user.username': username }, { 'user.email': normalizedEmail }] 
        });
        const existingTeacher = await Teacher.findOne({ 
            $or: [{ 'user.username': username }, { 'user.email': normalizedEmail }] 
        });
        
        if (existingStudent || existingTeacher) {
            const conflict = (existingStudent || existingTeacher).user;
            if (conflict.email.toLowerCase() === normalizedEmail) {
                return res.status(400).json({ message: 'Email address is already in use. Please use a different email or try logging in.' });
            }
            return res.status(400).json({ message: 'This username is already taken. Please choose a different one.' });
        }

        const newStudent = new Student({
            user: { 
                first_name, 
                last_name, 
                email: normalizedEmail, 
                username, 
                password 
            },
            mobile,
            address: address || '',
            profile_pic: profile_pic || ''
        });

        const savedStudent = await newStudent.save();
        console.log('Student created successfully:', savedStudent._id);
        res.status(201).json({ message: 'Student registered successfully', studentId: savedStudent._id });
    } catch (error) {
        console.error('SIGNUP_ERROR:', error);
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
        console.log(`Login attempt for: [${email}]`);

        if (!email || !password) {
            return res.status(400).json({ message: 'Email/Username and password are required' });
        }

        const cleanIdentifier = email.trim();
        
        // 1. Find user first to see if they exist
        const student = await Student.findOne({
            $or: [
                { 'user.email': { $regex: new RegExp(`^${cleanIdentifier}$`, 'i') } },
                { 'user.username': cleanIdentifier } 
            ]
        });

        if (!student) {
            console.log(`Login failed: User [${cleanIdentifier}] not found in database.`);
            return res.status(401).json({ message: 'Account not found. Please check your email/username.' });
        }

        // 2. Check password
        if (student.user.password !== password) {
            console.log(`Login failed: Incorrect password for user [${cleanIdentifier}]`);
            return res.status(401).json({ message: 'Incorrect password. Please try again.' });
        }

        console.log(`Login success: [${student.user.email}]`);
        res.json({ message: 'Login successful', studentId: student._id, name: student.user.first_name });
    } catch (error) {
        console.error('LOGIN_ERROR:', error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
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
        if (username) {
            const existingStudent = await Student.findOne({ 'user.username': username, _id: { $ne: id } });
            const existingTeacher = await Teacher.findOne({ 'user.username': username });
            if (existingStudent || existingTeacher) {
                return res.status(400).json({ message: 'Username already exists' });
            }
            student.user.username = username;
        }

        if (req.body.email) {
            const email = req.body.email;
            const existingStudent = await Student.findOne({ 'user.email': email, _id: { $ne: id } });
            const existingTeacher = await Teacher.findOne({ 'user.email': email });
            if (existingStudent || existingTeacher) {
                return res.status(400).json({ message: 'Email already exists' });
            }
            student.user.email = email;
        }

        if (password) student.user.password = password;
        if (mobile) student.mobile = mobile;
        if (address) student.address = address;
        if (profile_pic) student.profile_pic = profile_pic;

        await student.save();
        res.json({ message: 'Profile updated successfully', student });
    } catch (error) {
        console.error('UPDATE_STUDENT_ERROR:', error.name, '-', error.message);
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
