const express = require('express');
const hrController = require('../controllers/hrController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(restrictTo('HR_OFFICER', 'SUPER_ADMIN'));

router.get('/dashboard-stats', hrController.getDashboardStats);

module.exports = router;
