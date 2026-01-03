const mongoose = require('mongoose');
const User = require('../models/userModel');
const Employee = require('../models/employeeModel');
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

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const newUser = await User.create([{
            loginId,
            password: hashedPassword,
            role: role,
            isFirstLogin: true,
            isActive: true
        }], { session });

        const newEmployee = await Employee.create([{
            firstName,
            lastName,
            email,
            phone,
            address,
            dateOfJoining: new Date(dateOfJoining),
            designation,
            department: departmentId,
            user: newUser[0]._id
        }], { session });

        await AuditLog.create([{
            action: 'CREATE_EMPLOYEE',
            details: `Created employee ${firstName} ${lastName} with Login ID ${loginId}`,
            user: req.user._id,
            ipAddress: req.ip
        }], { session });

        await session.commitTransaction();

        res.status(201).json({
            status: 'success',
            message: 'Employee created successfully. Please save these credentials.',
            data: {
                employeeId: newEmployee[0]._id,
                loginId: newUser[0].loginId,
                tempPassword: tempPassword,
                role: newUser[0].role
            }
        });
    } catch (err) {
        await session.abortTransaction();
        next(err);
    } finally {
        session.endSession();
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
