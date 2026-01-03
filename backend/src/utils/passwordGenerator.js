const crypto = require('crypto');

const generateTempPassword = (length = 10) => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';

    const allChars = uppercase + lowercase + numbers + symbols;

    let password = '';

    // Ensure strict compliance
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill the rest
    for (let i = 4; i < length; i++) {
        password += allChars[crypto.randomInt(0, allChars.length)];
    }

    // Shuffle
    return password.split('').sort(() => 0.5 - Math.random()).join('');
};

module.exports = { generateTempPassword };
