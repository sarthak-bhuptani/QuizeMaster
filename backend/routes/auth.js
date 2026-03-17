const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const OTP = require('../models/OTP');
const nodemailer = require('nodemailer');

// Set up Nodemailer transporter using environment variables (Fallback to testing config if not provided)
let transporter;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    console.log("Transporter created for: " + process.env.EMAIL_USER);
} else {
    console.warn("WARNING: EMAIL_USER and EMAIL_PASS not set in .env. Emails will not actually send! Only logging to console.");
}

// Generate an OTP and send email
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const cleanEmail = email.trim();
        // Check if user exists in Student or Teacher collections (Case-insensitive)
        let user = await Student.findOne({ 'user.email': { $regex: new RegExp(`^${cleanEmail}$`, 'i') } });
        let userType = 'Student';

        if (!user) {
            user = await Teacher.findOne({ 'user.email': { $regex: new RegExp(`^${cleanEmail}$`, 'i') } });
            userType = 'Teacher';
        }

        if (!user) {
            console.log(`Forgot Password: User not found for email [${cleanEmail}]`);
            return res.status(404).json({ message: 'User not found with this email' });
        }

        // Generate 6 digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to DB
        console.log(`Saving OTP ${otpCode} for ${cleanEmail}...`);
        await OTP.deleteMany({ email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') } }); 
        await new OTP({ email: cleanEmail.toLowerCase(), otp: otpCode }).save();
        console.log(`OTP saved to database.`);

        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER || 'no-reply@quizmaster.com',
            to: email,
            subject: 'Password Reset OTP - QuizMaster',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
                    <h2 style="color: #4f46e5; text-align: center;">QuizMaster Password Reset</h2>
                    <p style="font-size: 16px; color: #334155;">Hello ${user.user.first_name},</p>
                    <p style="font-size: 16px; color: #334155;">We received a request to reset your password. Use the OTP below to proceed. It is valid for 5 minutes.</p>
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #0f172a;">${otpCode}</span>
                    </div>
                    <p style="font-size: 14px; color: #64748b;">If you didn't request this, you can safely ignore this email.</p>
                </div>
            `
        };

        if (transporter && process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
            try {
                console.log(`Attempting to send real email to ${cleanEmail}...`);
                await transporter.sendMail(mailOptions);
                console.log(`Email sent successfully to ${cleanEmail}`);
                return res.json({ message: 'OTP sent to email successfully' });
            } catch (mailError) {
                console.error('SMTP_MAIL_ERROR:', mailError);
                return res.status(503).json({ 
                    message: 'User found, but failed to send OTP email. Please check your EMAIL_USER and EMAIL_PASS config.',
                    details: mailError.message
                });
            }
        } else {
            console.log(`[TEST MODE] Would have sent OTP: ${otpCode} to Email: ${cleanEmail}`);
            return res.json({ message: 'OTP logged to server console (TEST MODE). Set EMAIL_USER with a real email to send to inboxes.' });
        }
    } catch (error) {
        console.error('FORGOT_PASSWORD_MAIN_ERROR:', error);
        res.status(500).json({ message: 'Error processing request', error: error.message });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

        const validOtp = await OTP.findOne({ email, otp });
        if (!validOtp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) return res.status(400).json({ message: 'Missing fields' });

        // Double check OTP valid
        const validOtp = await OTP.findOne({ email, otp });
        if (!validOtp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const cleanEmail = email.trim();
        let isStudent = true;
        let user = await Student.findOne({ 'user.email': { $regex: new RegExp(`^${cleanEmail}$`, 'i') } });

        if (!user) {
            user = await Teacher.findOne({ 'user.email': { $regex: new RegExp(`^${cleanEmail}$`, 'i') } });
            isStudent = false;
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update password
        user.user.password = newPassword;
        await user.save();

        // Delete OTP after successful reset
        await OTP.deleteOne({ _id: validOtp._id });

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
