const Attendance = require('../models/attendanceModel');
const Employee = require('../models/employeeModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');


exports.getMyAttendance = catchAsync(async (req, res, next) => {
    const employee = await Employee.findOne({ user: req.user._id });

    if (!employee) {
        return next(new AppError('Employee profile not found', 404));
    }

    const records = await Attendance.find({ employee: employee._id })
        .sort({ date: -1 })
        .limit(30)
        .lean();

    const total = await Attendance.countDocuments({ employee: employee._id });
    const present = await Attendance.countDocuments({ employee: employee._id, status: 'PRESENT' });
    const absent = total - present;
    const rate = total > 0 ? (present / total) * 100 : 0;
    res.status(200).json({
        status: 'success',
        data: {
            records,
            stats: {
                total,
                present,
                absent,
                rate: Math.round(rate * 10) / 10
            }
        }
    });
});

exports.getStatus = catchAsync(async (req, res, next) => {
    const employee = await Employee.findOne({ user: req.user._id });

    if (!employee) {
        return next(new AppError('Employee profile not found', 404));
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
        employee: employee._id,
        date: { $gte: today }
    }).lean();

    // Check if there's an active punch (punch in without punch out)
    let isPunchedIn = false;
    let lastPunchIn = null;
    let lastPunchOut = null;

    if (attendance && attendance.punches && attendance.punches.length > 0) {
        const lastPunch = attendance.punches[attendance.punches.length - 1];
        isPunchedIn = lastPunch.punchIn && !lastPunch.punchOut;
        lastPunchIn = lastPunch.punchIn;
        lastPunchOut = lastPunch.punchOut;
    }

    res.status(200).json({
        status: 'success',
        data: {
            isPunchedIn,
            punchInTime: lastPunchIn,
            punchOutTime: lastPunchOut,
            todayPunches: attendance?.punches || []
        }
    });
});

exports.punch = catchAsync(async (req, res, next) => {

    console.log('=== PUNCH REQUEST ===');
    console.log('User:', req.user?._id);

    try {
        const employee = await Employee.findOne({ user: req.user._id });

        if (!employee) {
            console.log('Employee not found');
            return next(new AppError('Employee profile not found', 404));
        }

        console.log('Employee found:', employee._id);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let attendance = await Attendance.findOne({
            employee: employee._id,
            date: { $gte: today }
        });

        console.log('Attendance record exists:', !!attendance);

        // If no attendance record for today, create one with first punch in
        if (!attendance) {
            console.log('Creating new attendance record');
            attendance = await Attendance.create({
                employee: employee._id,
                date: new Date(),
                punches: [{
                    punchIn: new Date(),
                    punchOut: null
                }],
                status: 'PRESENT'
            });

            console.log('Attendance created:', attendance._id);

            return res.status(201).json({
                status: 'success',
                message: 'Punched in successfully',
                data: {
                    isPunchedIn: true,
                    punchInTime: attendance.punches[0].punchIn,
                    punchOutTime: null,
                    todayPunches: attendance.punches
                }
            });
        }

        // Ensure punches array exists (for backward compatibility with old records)
        if (!attendance.punches || !Array.isArray(attendance.punches)) {
            console.log('Initializing punches array');
            attendance.punches = [];
        }

        console.log('Current punches count:', attendance.punches.length);

        // Check last punch status
        if (attendance.punches.length === 0) {
            // No punches yet today, create first punch in
            console.log('Adding first punch');
            attendance.punches.push({
                punchIn: new Date(),
                punchOut: null
            });
            await attendance.save();

            const newPunch = attendance.punches[attendance.punches.length - 1];

            return res.status(200).json({
                status: 'success',
                message: 'Punched in successfully',
                data: {
                    isPunchedIn: true,
                    punchInTime: newPunch.punchIn,
                    punchOutTime: null,
                    todayPunches: attendance.punches
                }
            });
        }

        const lastPunch = attendance.punches[attendance.punches.length - 1];

        if (lastPunch && lastPunch.punchIn && !lastPunch.punchOut) {
            // Last punch was in, now punch out
            console.log('Punching out');
            lastPunch.punchOut = new Date();
            await attendance.save();

            return res.status(200).json({
                status: 'success',
                message: 'Punched out successfully',
                data: {
                    isPunchedIn: false,
                    punchInTime: lastPunch.punchIn,
                    punchOutTime: lastPunch.punchOut,
                    todayPunches: attendance.punches
                }
            });
        } else {
            // Last punch was out or doesn't exist, create new punch in
            console.log('Adding new punch in');
            attendance.punches.push({
                punchIn: new Date(),
                punchOut: null
            });
            await attendance.save();

            const newPunch = attendance.punches[attendance.punches.length - 1];

            return res.status(200).json({
                status: 'success',
                message: 'Punched in successfully',
                data: {
                    isPunchedIn: true,
                    punchInTime: newPunch.punchIn,
                    punchOutTime: null,
                    todayPunches: attendance.punches
                }
            });
        }
    } catch (error) {
        console.error('=== PUNCH ERROR ===');
        return next(new AppError(`Punch failed: ${error.message}`, 500));
    }
});

exports.getHistory = catchAsync(async (req, res, next) => {
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) return next(new AppError('Employee not found', 404));

    const history = await Attendance.find({ employee: employee._id })
        .sort({ date: -1 })
        .limit(30)
        .lean();

    res.status(200).json({
        status: 'success',
        results: history.length,
        data: history
    });
});

exports.getAllAttendance = catchAsync(async (req, res, next) => {
    // Optional date filter
    const { date } = req.query;
    let query = {};
    if (date) {
        const queryDate = new Date(date);
        queryDate.setHours(0, 0, 0, 0);
        query.date = { $gte: queryDate };
    }

    const attendance = await Attendance.find(query)
        .populate({
            path: 'employee',
            select: 'firstName lastName designation department',
            populate: { path: 'department', select: 'name' }
        })
        .sort('-date')
        .limit(50); // specific limit for performance

    res.status(200).json({
        status: 'success',
        results: attendance.length,
        data: attendance
    });
});