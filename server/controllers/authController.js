const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const signRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });
};

const signAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const Employee = require('../models/employeeModel');
const Company = require('../models/companyModel');
const { generateLoginId } = require('../utils/idGenerator');

exports.signup = catchAsync(async (req, res, next) => {
    const {
        companyName,
        firstName,
        lastName,
        email,
        phone,
        password
    } = req.body;

    // 1. Check if email already used
    const existingEmail = await Employee.findOne({ email });
    if (existingEmail) {
        return next(new AppError('Email already registered', 400));
    }

    // 2. Update Company Details (Single Tenant Assumption)
    if (companyName) {
        let company = await Company.findOne();
        if (!company) {
            company = await Company.create({ name: companyName });
        } else {
            company.name = companyName;
            await company.save();
        }
    }

    // 3. Generate Login ID
    const dateOfJoining = new Date();
    const loginId = await generateLoginId(firstName, lastName, dateOfJoining);

    // 4. Create User
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
        loginId,
        password: hashedPassword,
        role: 'HR_OFFICER',
        isActive: true,
        isFirstLogin: false
    });

    // 5. Create Employee Record
    const newEmployee = await Employee.create({
        user: newUser._id,
        firstName,
        lastName,
        email,
        phone,
        dateOfJoining,
        designation: 'HR Manager',
    });

    // 6. Generate Tokens
    const accessToken = signAccessToken(newUser._id);
    const refreshToken = signRefreshToken(newUser._id);
    await User.findByIdAndUpdate(newUser._id, { refreshToken });

    // 7. Response
    res.status(201).json({
        status: 'success',
        accessToken,
        refreshToken,
        data: {
            user: {
                id: newUser._id,
                loginId: newUser.loginId,
                role: newUser.role,
                name: `${firstName} ${lastName}`,
                email: email
            }
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
        return next(new AppError('Please provide Login ID and password', 400));
    }

    const user = await User.findOne({ loginId }).populate('employee');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect Login ID or password', 401));
    }

    if (!user.isActive) {
        return next(new AppError('Your account has been deactivated. Contact HR.', 403));
    }

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    await User.findByIdAndUpdate(user._id, { refreshToken });

    user.password = undefined;
    user.refreshToken = undefined;

    res.status(200).json({
        status: 'success',
        accessToken,
        refreshToken,
        data: {
            user: {
                id: user._id,
                loginId: user.loginId,
                role: user.role,
                isFirstLogin: user.isFirstLogin,
                name: user.employee ? `${user.employee.firstName} ${user.employee.lastName}` : 'Admin',
                department: user.employee ? user.employee.department : null
            },
        },
    });
});

exports.changePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    const { currentPassword, newPassword } = req.body;
    if (!(await user.correctPassword(currentPassword, user.password))) {
        return next(new AppError('Your current password is wrong', 401));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        isFirstLogin: false
    });

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    await User.findByIdAndUpdate(user._id, { refreshToken });

    res.status(200).json({
        status: 'success',
        accessToken,
        refreshToken,
        message: 'Password changed successfully'
    });
});

exports.refreshToken = catchAsync(async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(new AppError('No refresh token provided', 400));
    }

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        return next(new AppError('Invalid refresh token', 401));
    }

    const user = await User.findById(decoded.id);
    if (!user) {
        return next(new AppError('User not found', 401));
    }

    if (user.refreshToken !== refreshToken) {
        return next(new AppError('Invalid refresh token', 401));
    }

    const accessToken = signAccessToken(user._id);

    res.status(200).json({
        status: 'success',
        accessToken,
    });
});

exports.logout = catchAsync(async (req, res, next) => {
    if (req.user) {
        await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
    }

    res.status(200).json({ status: 'success' });
});
