const express = require('express');
const payrollController = require('../controllers/payrollController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/my', payrollController.getMyPayroll);

// HR/Admin Only
router.use(restrictTo('HR_OFFICER', 'SUPER_ADMIN'));

router.get('/', payrollController.getAllPayrolls);
router.get('/stats', payrollController.getPayrollStats);
router.post('/generate', payrollController.generatePayroll);

module.exports = router;
