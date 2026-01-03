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
    }
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
