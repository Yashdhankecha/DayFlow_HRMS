// Quick test to verify employee controller
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getMyProfile = catchAsync(async (req, res, next) => {
    console.log('=== GET MY PROFILE CALLED ===');
    console.log('User ID:', req.user?._id);
    console.log('User data:', JSON.stringify(req.user, null, 2));

    try {
        // Just return user data for now to test
        return res.status(200).json({
            status: 'success',
            data: {
                firstName: req.user.name?.split(' ')[0] || 'Test',
                lastName: req.user.name?.split(' ').slice(1).join(' ') || 'User',
                email: req.user.loginId || 'test@example.com',
                phone: null,
                address: null,
                dateOfJoining: null,
                designation: null,
                department: null
            }
        });
    } catch (error) {
        console.error('=== ERROR IN getMyProfile ===');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        return next(new AppError('Failed to fetch profile: ' + error.message, 500));
    }
});
