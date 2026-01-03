const express = require('express');
const employeeController = require('../controllers/employeeController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router
    .route('/')
    .post(restrictTo('SUPER_ADMIN', 'HR_OFFICER'), employeeController.createEmployee)
    .get(restrictTo('SUPER_ADMIN', 'HR_OFFICER', 'MANAGER'), employeeController.getAllEmployees);

router
    .route('/:id')
    .get(restrictTo('SUPER_ADMIN', 'HR_OFFICER', 'MANAGER'), employeeController.getEmployee)
    .delete(restrictTo('SUPER_ADMIN', 'HR_OFFICER'), employeeController.deleteEmployee);

router.patch('/:id/toggle-status', restrictTo('SUPER_ADMIN', 'HR_OFFICER'), employeeController.toggleEmployeeStatus);

module.exports = router;
