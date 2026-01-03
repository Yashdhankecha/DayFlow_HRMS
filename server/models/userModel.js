const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    loginId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['SUPER_ADMIN', 'HR_OFFICER', 'MANAGER', 'EMPLOYEE'],
        default: 'EMPLOYEE'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFirstLogin: {
        type: Boolean,
        default: true
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });

// Virtual populate for employee
userSchema.virtual('employee', {
    ref: 'Employee',
    localField: '_id',
    foreignField: 'user',
    justOne: true
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
