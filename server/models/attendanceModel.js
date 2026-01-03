const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,

        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Half-Day', 'Late', 'On Leave'],
        default: 'Use Logic' // Can be inferred or set explicitly
    },
    checkInTime: {
        type: Date
    },
    checkOutTime: {
        type: Date
    }
}, { timestamps: true });

// Prevent duplicate attendance for same employee on same day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });


const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
