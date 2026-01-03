const mongoose = require('mongoose');
const User = require('../models/userModel');
const Employee = require('../models/employeeModel');
const Department = require('../models/departmentModel');
const AuditLog = require('../models/auditLogModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { generateLoginId } = require('../utils/idGenerator');
const { generateTempPassword } = require('../utils/passwordGenerator');
const bcrypt = require('bcrypt');

exports.createEmployee = catchAsync(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        address,
        dateOfJoining,
        designation,
        departmentId,
        role = 'EMPLOYEE'
    } = req.body;

    const existingEmail = await Employee.findOne({ email });
    if (existingEmail) {
        return next(new AppError('Email already exists', 400));
    }

    const loginId = await generateLoginId(firstName, lastName, dateOfJoining);
    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Transaction removed for compatibility with standalone MongoDB instances
    try {
        const newUser = await User.create({
            loginId,
            password: hashedPassword,
            role: role,
            isFirstLogin: true,
            isActive: true
        });

        const newEmployee = await Employee.create({
            firstName,
            lastName,
            email,
            phone,
            address,
            dateOfJoining: new Date(dateOfJoining),
            designation,
            department: departmentId || undefined, // Handle empty string
            user: newUser._id
        });

        await AuditLog.create({
            action: 'CREATE_EMPLOYEE',
            details: `Created employee ${firstName} ${lastName} with Login ID ${loginId}`,
            user: req.user._id,
            ipAddress: req.ip
        });

        res.status(201).json({
            status: 'success',
            message: 'Employee created successfully. Please save these credentials.',
            data: {
                employeeId: newEmployee._id,
                loginId: newUser.loginId,
                tempPassword: tempPassword,
                role: newUser.role
            }
        });
    } catch (err) {
        // Since we are not in a transaction, if User is created but Employee fails, we might want to cleanup the user manually
        // For now, let's just pass the error
        next(err);
    }
});

exports.getAllEmployees = catchAsync(async (req, res, next) => {
    const employees = await Employee.find()
        .populate({
            path: 'user',
            select: 'role isActive loginId'
        })
        .populate('department')
        .populate({
            path: 'manager',
            select: 'firstName lastName'
        });

    res.status(200).json({
        status: 'success',
        results: employees.length,
        data: employees
    });
});

exports.getEmployee = catchAsync(async (req, res, next) => {
    const employee = await Employee.findById(req.params.id)
        .populate({
            path: 'user',
            select: 'role isActive loginId'
        })
        .populate('department')
        .populate({
            path: 'manager',
            select: 'firstName lastName'
        });

    if (!employee) {
        return next(new AppError('No employee found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: employee
    });
});

exports.toggleEmployeeStatus = catchAsync(async (req, res, next) => {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return next(new AppError('Employee not found', 404));

    const user = await User.findById(employee.user);
    if (!user) return next(new AppError('User account not found', 404));

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        message: `Employee ${user.isActive ? 'activated' : 'deactivated'} successfully`
    });
});

exports.deleteEmployee = catchAsync(async (req, res, next) => {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return next(new AppError('Employee not found', 404));

    // Delete User and Employee
    await User.findByIdAndDelete(employee.user);
    await Employee.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: 'success',
        data: null
    });
});
