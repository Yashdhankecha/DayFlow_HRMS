const Payroll = require('../models/payrollModel');
const Employee = require('../models/employeeModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllPayrolls = catchAsync(async (req, res, next) => {
    const { month } = req.query; // Filter by month string if needed

    let query = {};
    if (month) query.month = month;

    const payrolls = await Payroll.find(query)
        .populate({
            path: 'employee',
            select: 'firstName lastName designation' // Get name and role
        })
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: payrolls.length,
        data: payrolls
    });
});

exports.generatePayroll = catchAsync(async (req, res, next) => {
    const { employeeId, month, year, bonus = 0, deductions = 0 } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) return next(new AppError('Employee not found', 404));

    const baseSalary = employee.salary || 0;
    const netSalary = baseSalary + Number(bonus) - Number(deductions);

    const newPayroll = await Payroll.create({
        employee: employeeId,
        month,
        year,
        baseSalary,
        bonus,
        deductions,
        netSalary,
        status: 'Processing'
    });

    res.status(201).json({
        status: 'success',
        data: newPayroll
    });
});

exports.updateStatus = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const payroll = await Payroll.findByIdAndUpdate(id, { status }, { new: true });

    res.status(200).json({
        status: 'success',
        data: payroll
    });
});

exports.getStats = catchAsync(async (req, res, next) => {
    // Aggregation for quick stats (Total Disbursed, Pending, Tax)
    // Simplified for now
    const stats = await Payroll.aggregate([
        {
            $group: {
                _id: null,
                totalDisbursed: {
                    $sum: {
                        $cond: [{ $eq: ["$status", "Paid"] }, "$netSalary", 0]
                    }
                },
                pendingAmount: {
                    $sum: {
                        $cond: [{ $in: ["$status", ["Processing", "Pending"]] }, "$netSalary", 0]
                    }
                },
                pendingCount: {
                    $sum: {
                        $cond: [{ $in: ["$status", ["Processing", "Pending"]] }, 1, 0]
                    }
                }
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: stats[0] || { totalDisbursed: 0, pendingAmount: 0, pendingCount: 0 }
    });
});
