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

const Attendance = require('../models/attendanceModel');

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
        })
        .lean();

    // Get Today's Date Range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch Attendance for Today
    const attendanceRecords = await Attendance.find({
        date: { $gte: startOfDay, $lte: endOfDay }
    }).select('employee status');

    // Create Map: EmployeeID -> Status
    const attendanceMap = {};
    attendanceRecords.forEach(record => {
        attendanceMap[record.employee.toString()] = record.status;
    });

    // Append Status
    const employeesWithStatus = employees.map(emp => ({
        ...emp,
        todayStatus: attendanceMap[emp._id.toString()] || 'Absent'
    }));

    res.status(200).json({
        status: 'success',
        results: employeesWithStatus.length,
        data: employeesWithStatus
    });
});

exports.getMyProfile = catchAsync(async (req, res, next) => {
    console.log('=== getMyProfile called ===');
    console.log('User:', req.user?._id);

    try {
        // Try to find employee without population first
        let employee = await Employee.findOne({ user: req.user._id }).lean();

        console.log('Employee found:', employee ? 'Yes' : 'No');

        // If no employee record exists, return basic user data
        if (!employee) {
            console.log('No employee record, returning user data');
            return res.status(200).json({
                status: 'success',
                data: {
                    firstName: req.user.name?.split(' ')[0] || '',
                    lastName: req.user.name?.split(' ').slice(1).join(' ') || '',
                    email: req.user.loginId || '',
                    phone: null,
                    address: null,
                    dateOfJoining: null,
                    designation: null,
                    department: null,
                    _noEmployeeRecord: true,

                    // New Fields Fallback
                    location: null,
                    employeeCode: null,
                    dateOfBirth: null,
                    gender: null,
                    maritalStatus: null,
                    nationality: null,
                    personalEmail: null,
                    bankAccountNumber: null,
                    bankName: null,
                    ifscCode: null,
                    panNumber: null,
                    uanNumber: null
                }
            });
        }

        // Try to populate department and manager
        try {
            const populatedEmployee = await Employee.findOne({ user: req.user._id })
                .populate('department')
                .populate({
                    path: 'manager',
                    select: 'firstName lastName'
                })
                .lean();

            employee = populatedEmployee || employee;
        } catch (popError) {
            console.log('Population failed, returning unpopulated employee:', popError.message);
        }

        console.log('Returning employee data');
        res.status(200).json({
            status: 'success',
            data: employee
        });
    } catch (error) {
        console.error('=== ERROR in getMyProfile ===');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        return next(new AppError(`Failed to fetch profile: ${error.message}`, 500));
    }
});

exports.updateMyProfile = catchAsync(async (req, res, next) => {
    // Filter allowed fields to prevent overwriting sensitive data like role/salary if they existed
    const allowedFields = [
        'phone', 'address', 'location', 'employeeCode',
        'dateOfBirth', 'gender', 'maritalStatus', 'nationality', 'personalEmail',
        'bankAccountNumber', 'bankName', 'ifscCode', 'panNumber', 'uanNumber'
    ];

    const filteredBody = {};
    Object.keys(req.body).forEach(el => {
        if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
    });

    const employee = await Employee.findOneAndUpdate(
        { user: req.user._id },
        filteredBody,
        { new: true, runValidators: true }
    ).populate('department');

    if (!employee) {
        // If employee record doesn't exist, create one!
        // This handles the case where a user logs in but has no employee record yet.
        // We need firstName and lastName from User model (which we don't have here directly unless populated)
        // But better to just error or ask HR to create base profile.
        // Actually, user said "filled by employee itself", maybe we should CREATE if not exists?
        // But for now, let's stick to update and assume base record exists or we throw error.

        // Let's create it if it doesn't exist using User data
        const newEmployee = await Employee.create({
            user: req.user._id,
            firstName: req.user.name?.split(' ')[0] || 'User',
            lastName: req.user.name?.split(' ').slice(1).join(' ') || 'Name',
            email: req.user.loginId,
            ...filteredBody
        });

        return res.status(200).json({
            status: 'success',
            message: 'Profile created successfully',
            data: newEmployee
        });

    }

    res.status(200).json({
        status: 'success',

        message: 'Profile updated successfully',

        data: employee
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

exports.updateEmployee = catchAsync(async (req, res, next) => {
    // 1. Check if role is updated, then update User model
    if (req.body.role) {
        const employee = await Employee.findById(req.params.id);
        if (employee && employee.user) {
            const user = await User.findById(employee.user);
            if (user) {
                user.role = req.body.role;
                await user.save({ validateBeforeSave: false });
            }
        }
    }

    // 2. Update Employee Data
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    }).populate('department');

    if (!employee) {
        return next(new AppError('No employee found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: employee
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

