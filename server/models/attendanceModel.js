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
        enum: ['PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'ON_LEAVE'],
        default: 'ABSENT'
    },
    punches: [{
        punchIn: {
            type: Date,
            required: true
        },
        punchOut: {
            type: Date
        }
    }]
}, { timestamps: true });

// Prevent duplicate attendance for same employee on same day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });


const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
