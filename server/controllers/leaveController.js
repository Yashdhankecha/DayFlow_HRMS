const Leave = require('../models/leaveModel');
const Employee = require('../models/employeeModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Helper to get employee from user
const getEmployee = async (userId) => {
    return await Employee.findOne({ user: userId });
};

exports.applyLeave = catchAsync(async (req, res, next) => {
    const employee = await getEmployee(req.user.id);
    if (!employee) return next(new AppError('Employee not found', 404));

    const { leaveType, startDate, endDate, reason } = req.body;

    const newLeave = await Leave.create({
        employee: employee._id,
        leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason
    });

    res.status(201).json({
        status: 'success',
        message: 'Leave application submitted successfully',
        data: newLeave
    });
});

exports.getMyLeaves = catchAsync(async (req, res, next) => {
    const employee = await getEmployee(req.user.id);
    if (!employee) return next(new AppError('Employee not found', 404));

    const leaves = await Leave.find({ employee: employee._id }).sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: leaves.length,
        data: leaves
    });
});

exports.getAllLeaves = catchAsync(async (req, res, next) => {
    const leaves = await Leave.find()
        .populate({
            path: 'employee',
            select: 'firstName lastName designation department',
            populate: { path: 'department', select: 'name' }
        })
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: leaves.length,
        data: leaves
    });
});

exports.updateLeaveStatus = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const leave = await Leave.findByIdAndUpdate(
        id,
        {
            status,
            approvedBy: req.user._id,
            rejectionReason: status === 'Rejected' ? rejectionReason : undefined
        },
        { new: true }
    );

    if (!leave) return next(new AppError('Leave request not found', 404));

    res.status(200).json({
        status: 'success',
        data: leave
    });
});
