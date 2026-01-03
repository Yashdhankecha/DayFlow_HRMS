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
