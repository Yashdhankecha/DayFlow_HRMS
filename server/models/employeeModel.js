const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
    },
    phone: String,
    address: String,
    dateOfJoining: {
        type: Date,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },

    // Work Info
    employeeCode: { type: String, unique: true, sparse: true },
    location: { type: String, default: 'Head Office' },

    // Personal Info
    dateOfBirth: Date,
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'] },
    nationality: String,
    personalEmail: String,

    // Bank Details
    bankAccountNumber: String,
    bankName: String,
    ifscCode: String,
    panNumber: String,
    uanNumber: String

}, { timestamps: true });

// Virtual to get subordinates
employeeSchema.virtual('subordinates', {
    ref: 'Employee',
    localField: '_id',
    foreignField: 'manager'
});

employeeSchema.set('toJSON', { virtuals: true });
employeeSchema.set('toObject', { virtuals: true });

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
