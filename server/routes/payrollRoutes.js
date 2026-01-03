const express = require('express');
const payrollController = require('../controllers/payrollController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(restrictTo('HR_OFFICER', 'SUPER_ADMIN'));

router.get('/', payrollController.getAllPayrolls);
router.post('/generate', payrollController.generatePayroll);
router.patch('/:id/status', payrollController.updateStatus);
router.get('/stats', payrollController.getStats);

module.exports = router;
