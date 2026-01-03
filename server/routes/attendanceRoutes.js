const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(protect);

router.get('/status', attendanceController.getPunchStatus);
router.post('/punch', attendanceController.punch);
router.get('/history', attendanceController.getHistory);
router.get('/all', attendanceController.getAllAttendance);


module.exports = router;
