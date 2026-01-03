const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(protect);

// Employee attendance routes
router.get('/status', attendanceController.getStatus);
router.post('/punch', attendanceController.punch);
router.get('/my-attendance', attendanceController.getMyAttendance);

module.exports = router;
