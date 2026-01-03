const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', protect, authController.logout);
router.patch('/change-password', protect, authController.changePassword);
module.exports = router;

