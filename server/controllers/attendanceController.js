const Attendance = require('../models/attendanceModel');
const Employee = require('../models/employeeModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Helper to get employee from user
const getEmployee = async (userId) => {
    return await Employee.findOne({ user: userId });
};

exports.getPunchStatus = catchAsync(async (req, res, next) => {
    const employee = await getEmployee(req.user.id);
    if (!employee) {
        return next(new AppError('No employee profile found for this user', 404));
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await Attendance.findOne({
        employee: employee._id,
        date: { $gte: today, $lt: tomorrow }
    });

    res.status(200).json({
        status: 'success',
        data: {
            isPunchedIn: attendance && !attendance.checkOutTime,
            punchInTime: attendance?.checkInTime,
            punchOutTime: attendance?.checkOutTime,
            attendanceId: attendance?._id
        }
    });
});

exports.punch = catchAsync(async (req, res, next) => {
    const employee = await getEmployee(req.user.id);
    if (!employee) {
        return next(new AppError('No employee profile found for this user', 404));
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let attendance = await Attendance.findOne({
        employee: employee._id,
        date: { $gte: today, $lt: tomorrow }
    });

    const now = new Date();

    if (!attendance) {
        // Punch In
        attendance = await Attendance.create({
            employee: employee._id,
            date: now,
            checkInTime: now,
            status: 'Present' // Default status
        });

        return res.status(200).json({
            status: 'success',
            message: 'Punched In Successfully',
            data: { isPunchedIn: true, time: now }
        });

    } else if (!attendance.checkOutTime) {
        // Punch Out
        attendance.checkOutTime = now;
        await attendance.save();

        return res.status(200).json({
            status: 'success',
            message: 'Punched Out Successfully',
            data: { isPunchedIn: false, time: now }
        });
    } else {
        return next(new AppError('You have already punched out for today', 400));
    }
});

exports.getHistory = catchAsync(async (req, res, next) => {
    const employee = await getEmployee(req.user.id);
    if (!employee) return next(new AppError('Employee not found', 404));

    const history = await Attendance.find({ employee: employee._id })
        .sort({ date: -1 })
        .limit(10); // Last 10 days

    res.status(200).json({
        status: 'success',
        results: history.length,
        data: history
    });
});

exports.getAllAttendance = catchAsync(async (req, res, next) => {
    const { date } = req.query;

    let query = {};
    if (date) {
        const queryDate = new Date(date);
        queryDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(queryDate);
        nextDay.setDate(nextDay.getDate() + 1);

        query.date = { $gte: queryDate, $lt: nextDay };
    }

    const attendance = await Attendance.find(query)
        .populate({
            path: 'employee',
            select: 'firstName lastName designation department',
            populate: { path: 'department', select: 'name' }
        })
        .sort('-date');

    res.status(200).json({
        status: 'success',
        results: attendance.length,
        data: attendance
    });
});
