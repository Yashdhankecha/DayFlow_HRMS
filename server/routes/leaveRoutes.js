const express = require('express');
const leaveController = require('../controllers/leaveController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/apply', leaveController.applyLeave);
router.get('/my-leaves', leaveController.getMyLeaves);

// HR Only Routes
router.get('/all', restrictTo('HR_OFFICER', 'SUPER_ADMIN'), leaveController.getAllLeaves);
router.patch('/:id/status', restrictTo('HR_OFFICER', 'SUPER_ADMIN'), leaveController.updateLeaveStatus);


module.exports = router;
