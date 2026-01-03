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

module.exports = router;
