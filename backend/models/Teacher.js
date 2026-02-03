const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
    user: {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    profile_pic: { type: String },
    address: { type: String },
    mobile: { type: String, required: true },
    status: { type: Boolean, default: false },
    salary: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Teacher', TeacherSchema);
