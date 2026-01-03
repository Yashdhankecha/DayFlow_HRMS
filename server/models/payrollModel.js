const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    month: {
        type: String,
        required: true, // e.g., "October"
    },
    year: {
        type: Number,
        required: true // e.g., 2024
    },
    salarySnapshot: {
        basicSalary: { type: Number, default: 0 },
        hra: { type: Number, default: 0 },
        specialAllowance: { type: Number, default: 0 },
        otherAllowances: { type: Number, default: 0 },
        grossSalary: { type: Number, default: 0 } // Total components
    },
    attendanceSummary: {
        workingDays: { type: Number, default: 30 },
        presentDays: { type: Number, default: 0 },
        absentDays: { type: Number, default: 0 }
    },
    calculations: {
        perDaySalary: { type: Number, default: 0 },
        grossEarnings: { type: Number, default: 0 } // perDay * presentDays
    },
    finalPay: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Generated', 'Paid'],
        default: 'Generated'
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// Prevent duplicate payroll for same employee/month/year
payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

const Payroll = mongoose.model('Payroll', payrollSchema);

module.exports = Payroll;
