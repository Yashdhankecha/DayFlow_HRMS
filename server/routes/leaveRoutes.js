const express = require('express');
const leaveController = require('../controllers/leaveController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(protect);

// Employee leave routes
router.get('/my-leaves', leaveController.getMyLeaves);
router.post('/apply', leaveController.applyLeave);

module.exports = router;
