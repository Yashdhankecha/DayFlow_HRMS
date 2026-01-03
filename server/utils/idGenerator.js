const User = require('../models/userModel');

const generateLoginId = async (firstName, lastName, dateOfJoining) => {
  const companyCode = 'OI'; // Customizable
  const fNameCode = firstName.substring(0, 2).toUpperCase();
  const lNameCode = lastName.substring(0, 2).toUpperCase();
  const year = new Date(dateOfJoining).getFullYear().toString();

  // Find users with matching year in loginId using regex
  const users = await User.find({
    loginId: { $regex: year }
  }).select('loginId');

  let maxSerial = 0;

  for (const u of users) {
    const id = u.loginId;
    if (id.length === 14) {
      const extractedYear = id.substring(6, 10);
      if (extractedYear === year) {
        const serialPart = id.substring(10);
        const serial = parseInt(serialPart, 10);
        if (!isNaN(serial) && serial > maxSerial) {
          maxSerial = serial;
        }
      }
    }
  }

  const nextSerial = (maxSerial + 1).toString().padStart(4, '0');

  return `${companyCode}${fNameCode}${lNameCode}${year}${nextSerial}`;
};

module.exports = { generateLoginId };
