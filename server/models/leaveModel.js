const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    type: {
        type: String,
        enum: ['CASUAL', 'SICK', 'ANNUAL', 'UNPAID', 'TIME_OFF'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    // For partial day leaves (TIME_OFF)
    startTime: {
        type: String // Format: "HH:MM" 
    },
    endTime: {
        type: String // Format: "HH:MM"
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    },
    appliedOn: {
        type: Date,
        default: Date.now
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedOn: {
        type: Date
    },
    rejectionReason: {
        type: String
    }
}, { timestamps: true });

// Index for faster queries
leaveSchema.index({ employee: 1, appliedOn: -1 });

const Leave = mongoose.model('Leave', leaveSchema);

module.exports = Leave;
