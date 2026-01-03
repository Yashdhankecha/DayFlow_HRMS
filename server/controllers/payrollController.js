const Employee = require('../models/employeeModel');
const Attendance = require('../models/attendanceModel');
const Payroll = require('../models/payrollModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.generatePayroll = catchAsync(async (req, res, next) => {
    const { employeeId, month, year } = req.body; // month: "October", year: 2024

    // 1. Check if payroll already exists
    const existing = await Payroll.findOne({ employee: employeeId, month, year });
    if (existing) {
        return next(new AppError('Payroll already generated for this month.', 400));
    }

    // 2. Fetch Employee with Salary Structure
    const employee = await Employee.findById(employeeId);
    if (!employee) return next(new AppError('Employee not found', 404));

    if (!employee.salaryStructure) {
        return next(new AppError('Salary structure not defined for this employee', 400));
    }

    // 3. Calculate Days
    // Determine start and end date of the month
    // Map month name to index (0-11)
    const monthMap = {
        'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
        'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
    };
    const monthIndex = monthMap[month];
    if (monthIndex === undefined) return next(new AppError('Invalid month name', 400));

    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0); // Last day of month
    const daysInMonth = endDate.getDate();

    // 4. Fetch Attendance Count
    // Count 'Present', 'Late', 'Half-Day' (maybe half-day counts as 0.5?)
    // For simplicity: Count all records that are NOT 'Absent'.
    // Or strictly count 'Present' + 'Late'.
    const attendanceRecords = await Attendance.find({
        employee: employeeId,
        date: {
            $gte: startDate,
            $lte: endDate
        }
    });

    let presentDays = 0;
    attendanceRecords.forEach(record => {
        if (record.status === 'Present' || record.status === 'Late' || record.status === 'On Leave') presentDays += 1;
        if (record.status === 'Half-Day') presentDays += 0.5;
    });

    // Fallback: If no attendance records found (e.g. testing), default to 0 present days?
    // Or simpler: If employee is salaried, maybe pay full unless absent?
    // The prompt says: "Calculate: perDaySalary ... finalPay = perDaySalary * presentDays".
    // This implies strictly pay-per-day logic.

    // 5. Calculate Pay
    const { basicSalary, hra, specialAllowance, otherAllowances } = employee.salaryStructure;
    const grossSalary = (basicSalary || 0) + (hra || 0) + (specialAllowance || 0) + (otherAllowances || 0);

    const workingDays = daysInMonth; // Standardizing to days in month
    const perDaySalary = workingDays > 0 ? (grossSalary / workingDays) : 0;

    // Rounding to 2 decimals
    const finalPay = Math.round((perDaySalary * presentDays) * 100) / 100;

    // 6. Create Payroll Record
    const newPayroll = await Payroll.create({
        employee: employeeId,
        month,
        year,
        salarySnapshot: {
            basicSalary,
            hra,
            specialAllowance,
            otherAllowances,
            grossSalary
        },
        attendanceSummary: {
            workingDays,
            presentDays,
            absentDays: workingDays - presentDays
        },
        calculations: {
            perDaySalary: Math.round(perDaySalary * 100) / 100,
            grossEarnings: finalPay
        },
        finalPay,
        status: 'Generated',
        generatedBy: req.user._id
    });

    res.status(201).json({
        status: 'success',
        data: newPayroll
    });
});

exports.getAllPayrolls = catchAsync(async (req, res, next) => {
    // Optional filtering by month/year
    const filter = {};
    if (req.query.month) filter.month = req.query.month;
    if (req.query.year) filter.year = req.query.year;

    const payrolls = await Payroll.find(filter)
        .populate('employee', 'firstName lastName designation employeeCode') // Populate essential fields
        .sort({ createdAt: -1 });

    res.status(200).json({
        status: 'success',
        results: payrolls.length,
        data: payrolls
    });
});

exports.getPayrollStats = catchAsync(async (req, res, next) => {
    // Aggregation for dashboard stats
    const stats = await Payroll.aggregate([
        {
            $group: {
                _id: null,
                totalDisbursed: { $sum: '$finalPay' },
                count: { $sum: 1 }
            }
        }
    ]);

    // Count pending (Employees Total - Payrolls Total for current month?)
    // This is complex. Let's just return what we have.
    // Simplifying: Pending processing is (Total Employees) - (Payrolls Generated This Month)

    // Current Month Context
    const date = new Date();
    const currentMonthMap = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonth = currentMonthMap[date.getMonth()];
    const currentYear = date.getFullYear();

    const totalEmployees = await Employee.countDocuments();
    const generatedThisMonth = await Payroll.countDocuments({ month: currentMonth, year: currentYear });

    res.status(200).json({
        status: 'success',
        data: {
            totalDisbursed: stats[0]?.totalDisbursed || 0,
            pendingAmount: 0, // Placeholder
            pendingCount: Math.max(0, totalEmployees - generatedThisMonth)
        }
    });
});

exports.getMyPayroll = catchAsync(async (req, res, next) => {
    // Find employee linked to user
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) {
        return next(new AppError('Employee profile not found', 404));
    }

    const payrolls = await Payroll.find({ employee: employee._id }).sort({ createdAt: -1 });

    res.status(200).json({
        status: 'success',
        data: payrolls
    });
});
