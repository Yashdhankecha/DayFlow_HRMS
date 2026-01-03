const Employee = require('../models/employeeModel');
const Attendance = require('../models/attendanceModel');
const Leave = require('../models/leaveModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getDashboardStats = catchAsync(async (req, res, next) => {
    // 1. Total Employees
    const totalEmployees = await Employee.countDocuments();

    // 2. Attendance Limit to Today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const activeAttendance = await Attendance.countDocuments({
        date: { $gte: today, $lt: tomorrow },
        status: { $in: ['Present', 'Late', 'Half-Day'] }
    });

    let attendancePercentage = 0;
    if (totalEmployees > 0) {
        attendancePercentage = Math.round((activeAttendance / totalEmployees) * 100);
    }

    // 3. On Leave
    const onLeaveCount = await Leave.countDocuments({
        status: 'Approved',
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() } // Overlapping today
    });

    // 4. Pending Requests (Leave for now, can expand later)
    const pendingLeaves = await Leave.find({ status: 'Pending' })
        .populate('employee', 'firstName lastName')
        .sort('-createdAt')
        .limit(5);

    const pendingRequests = pendingLeaves.map(leave => {
        if (!leave.employee) return null; // Skip if employee deleted
        return {
            id: leave._id,
            name: `${leave.employee.firstName} ${leave.employee.lastName}`,
            type: leave.leaveType,
            date: new Date(leave.startDate).toLocaleDateString(),
            status: 'pending' // standardized for frontend
        };
    }).filter(req => req !== null);

    res.status(200).json({
        status: 'success',
        data: {
            stats: [
                {
                    title: 'Total Employees',
                    value: totalEmployees.toString(),
                    trend: '+0%', // Placeholder logic
                    trendUp: true
                },
                {
                    title: 'Attendance',
                    value: `${attendancePercentage}%`,
                    trend: 'Today',
                    trendUp: true
                },
                {
                    title: 'On Leave',
                    value: onLeaveCount.toString(),
                    trend: 'Today',
                    trendUp: false
                }
            ],
            pendingRequests
        }
    });
});
