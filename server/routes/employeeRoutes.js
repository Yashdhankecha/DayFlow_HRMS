const express = require('express');
const employeeController = require('../controllers/employeeController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router
    .route('/')
    .post(restrictTo('HR_OFFICER'), employeeController.createEmployee)
    .get(restrictTo('HR_OFFICER'), employeeController.getAllEmployees);

// Employee can view/update their own profile
router.get('/profile', employeeController.getMyProfile);
router.patch('/profile', employeeController.updateMyProfile);

module.exports = router;
