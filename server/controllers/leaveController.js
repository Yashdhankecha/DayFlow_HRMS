const Leave = require('../models/leaveModel');
const Employee = require('../models/employeeModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');


exports.getMyLeaves = catchAsync(async (req, res, next) => {
    const employee = await Employee.findOne({ user: req.user._id });

    if (!employee) {
        return next(new AppError('Employee profile not found', 404));
    }

    const requests = await Leave.find({ employee: employee._id })
        .sort({ appliedOn: -1 });

    const total = await Leave.countDocuments({ employee: employee._id });
    const approved = await Leave.countDocuments({ employee: employee._id, status: 'APPROVED' });
    const pending = await Leave.countDocuments({ employee: employee._id, status: 'PENDING' });
    const rejected = await Leave.countDocuments({ employee: employee._id, status: 'REJECTED' });

    res.status(200).json({
        status: 'success',
        data: {
            leaves: requests, // Add leaves array for easier access
            requests,
            stats: {
                total,
                approved,
                pending,
                rejected,
                available: 15 - total // Assuming 15 total leaves per year
            }
        }
    });
});

exports.applyLeave = catchAsync(async (req, res, next) => {
    const { type, startDate, endDate, reason, startTime, endTime } = req.body;

    const employee = await Employee.findOne({ user: req.user._id });

    if (!employee) {
        return next(new AppError('Employee profile not found', 404));
    }

    const leave = await Leave.create({
        employee: employee._id,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        startTime,
        endTime,
        reason,
        status: 'PENDING',
        appliedOn: new Date()
    });

    res.status(201).json({
        status: 'success',

        message: 'Leave request submitted successfully',
        data: leave
    });
});
