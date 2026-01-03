const express = require('express');
const companyController = require('../controllers/companyController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(companyController.getCompanyProfile)
    .patch(restrictTo('SUPER_ADMIN', 'HR_OFFICER'), companyController.updateCompanyProfile);

module.exports = router;
