const prisma = require('../prisma/client');
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
        role = 'EMPLOYEE' // Default role
    } = req.body;

    // 1. Check if email already exists
    const existingEmail = await prisma.user.findFirst({ where: { employee: { email } } });
    if (existingEmail) {
        return next(new AppError('Email already exists', 400));
    }

    // 2. Generate Login ID
    const loginId = await generateLoginId(firstName, lastName, dateOfJoining);

    // 3. Generate Temp Password
    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // 4. Create User and Employee in transaction
    const result = await prisma.$transaction(async (prisma) => {
        // Create User
        const newUser = await prisma.user.create({
            data: {
                loginId,
                password: hashedPassword,
                role: role,
                isFirstLogin: true,
                isActive: true
            }
        });

        // Create Employee linked to User
        const newEmployee = await prisma.employee.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                address,
                dateOfJoining: new Date(dateOfJoining),
                designation,
                department: departmentId ? { connect: { id: departmentId } } : undefined,
                user: { connect: { id: newUser.id } }
            }
        });

        // Create Audit Log
        await prisma.auditLog.create({
            data: {
                action: 'CREATE_EMPLOYEE',
                details: `Created employee ${firstName} ${lastName} with Login ID ${loginId}`,
                userId: req.user.id, // The admin performing the action
                ipAddress: req.ip
            }
        });

        return { newUser, newEmployee };
    });

    // 5. Send response with Login Credentials (SHOW ONCE)
    res.status(201).json({
        status: 'success',
        message: 'Employee created successfully. Please save these credentials.',
        data: {
            employeeId: result.newEmployee.id,
            loginId: result.newUser.loginId,
            tempPassword: tempPassword, // Valid to return here as it's the creation step
            role: result.newUser.role
        }
    });
});

exports.getAllEmployees = catchAsync(async (req, res, next) => {
    const employees = await prisma.employee.findMany({
        include: {
            user: {
                select: {
                    role: true,
                    isActive: true,
                    loginId: true
                }
            },
            department: true,
            manager: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        }
    });

    res.status(200).json({
        status: 'success',
        results: employees.length,
        data: employees
    });
});
