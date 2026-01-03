const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const globalErrorHandler = require('./middlewares/errorHandler');
const AppError = require('./utils/AppError');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const { protect, restrictTo } = require('./middlewares/authMiddleware');

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);


// Protected Routes Example
app.get('/api/dashboard/user', protect, (req, res) => {
    res.status(200).json({
        status: 'success',
        message: `Welcome User ${req.user.name}`,
        user: req.user
    });
});

app.get('/api/dashboard/admin', protect, restrictTo('ADMIN'), (req, res) => {
    res.status(200).json({
        status: 'success',
        message: `Welcome Admin ${req.user.name}`,
        data: 'Secret Admin Data'
    });
});

// 404 Handler
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
