const jwt = require('jsonwebtoken');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Access token valid for 1 day
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);

    // Remove password from output
    user.password = undefined;
    user.refreshToken = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

module.exports = { createSendToken, signToken };
