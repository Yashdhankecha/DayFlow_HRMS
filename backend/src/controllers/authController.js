const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../prisma/client');
const AppError = require('../utils/AppError');
const { createSendToken } = require('../utils/jwt');
const catchAsync = require('../utils/catchAsync');
// Helper to sign refresh token
const signRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });
};

exports.signup = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return next(new AppError('Email already in use', 400));
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'USER', // Default to USER if not provided
            },
        });

        // Generate tokens
        const accessToken = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = signRefreshToken(newUser.id);

        // Save refresh token
        await prisma.user.update({
            where: { id: newUser.id },
            data: { refreshToken },
        });

        res.status(201).json({
            status: 'success',
            accessToken,
            refreshToken,
            data: {
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                },
            },
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1) Check if email and password exist
        if (!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }

        // 2) Check if user exists && password is correct
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return next(new AppError('Incorrect email or password', 401));
        }

        // 3) Generate tokens
        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = signRefreshToken(user.id);

        // 4) Save refresh token
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });

        user.password = undefined;
        user.refreshToken = undefined;

        res.status(200).json({
            status: 'success',
            accessToken,
            refreshToken,
            data: {
                user,
            },
        });
    } catch (err) {
        next(err);
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return next(new AppError('No refresh token provided', 400));
        }

        // 1) Verify token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // 2) Check if user exists
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return next(new AppError('User not found', 401));
        }

        // 3) Check if refresh token matches db
        if (user.refreshToken !== refreshToken) {
            // Token reuse or invalid
            return next(new AppError('Invalid refresh token', 401));
        }

        // 4) Generate new access token
        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        res.status(200).json({
            status: 'success',
            accessToken,
        });
    } catch (err) {
        return next(new AppError('Invalid or expired refresh token', 401));
    }
};

exports.logout = async (req, res, next) => {
    try {
        // Assuming user is authenticated via protect middleware OR we send userId/email
        // But safely, we can just use the user from req.user if protected,
        // OR just rely on client clearing token. For meaningful logout with refresh tokens:

        // If we want to revoke the refresh token:
        if (req.user) {
            await prisma.user.update({
                where: { id: req.user.id },
                data: { refreshToken: null }
            });
        }

        res.status(200).json({ status: 'success' });
    } catch (err) {
        next(err);
    }
};
const signAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

exports.login = catchAsync(async (req, res, next) => {
    const { loginId, password } = req.body;

    // 1) Check if loginId and password exist
    if (!loginId || !password) {
        return next(new AppError('Please provide Login ID and password', 400));
    }

    // 2) Check if user exists && password is correct
    const user = await prisma.user.findUnique({
        where: { loginId },
        include: { employee: true } // Include employee details
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError('Incorrect Login ID or password', 401));
    }

    if (!user.isActive) {
        return next(new AppError('Your account has been deactivated. Contact HR.', 403));
    }

    // 3) Generate tokens
    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    // 4) Save refresh token
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });

    user.password = undefined;
    user.refreshToken = undefined;

    res.status(200).json({
        status: 'success',
        accessToken,
        refreshToken,
        data: {
            user: {
                id: user.id,
                loginId: user.loginId,
                role: user.role,
                isFirstLogin: user.isFirstLogin,
                name: user.employee ? `${user.employee.firstName} ${user.employee.lastName}` : 'Admin',
                department: user.employee ? user.employee.departmentId : null
            },
        },
    });
});

exports.changePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    // 2) Check if POSTed current password is correct
    const { currentPassword, newPassword } = req.body;
    if (!(await bcrypt.compare(currentPassword, user.password))) {
        return next(new AppError('Your current password is wrong', 401));
    }

    // 3) Update password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            isFirstLogin: false
        }
    });

    // 4) Log user in, send JWT
    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken }
    });

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

    // 1) Verify token
    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        return next(new AppError('Invalid refresh token', 401));
    }

    // 2) Check if user exists
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
        return next(new AppError('User not found', 401));
    }

    // 3) Check if refresh token matches db
    if (user.refreshToken !== refreshToken) {
        // Token reuse or invalid
        return next(new AppError('Invalid refresh token', 401));
    }

    // 4) Generate new access token
    const accessToken = signAccessToken(user.id);

    res.status(200).json({
        status: 'success',
        accessToken,
    });
});

exports.logout = catchAsync(async (req, res, next) => {
    if (req.user) {
        await prisma.user.update({
            where: { id: req.user.id },
            data: { refreshToken: null }
        });
    }

    res.status(200).json({ status: 'success' });
});
