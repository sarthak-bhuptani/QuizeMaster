const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    user: {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    profile_pic: { type: String },
    address: { type: String },
    mobile: { type: String, required: true },
    // Gamification Fields
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: [{
        name: { type: String },
        icon: { type: String },
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
