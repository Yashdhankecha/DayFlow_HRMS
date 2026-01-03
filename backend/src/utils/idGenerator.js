const prisma = require('../prisma/client');

const generateLoginId = async (firstName, lastName, dateOfJoining) => {
  const companyCode = 'OI'; // Customizable
  const fNameCode = firstName.substring(0, 2).toUpperCase();
  const lNameCode = lastName.substring(0, 2).toUpperCase();
  const year = new Date(dateOfJoining).getFullYear().toString();

  // We need to find the maximum serial used for this year.
  // Since the prefix (OI + Name codes) changes, but the serial is global per year (based on "Serial resets every year"),
  // we need to scan all IDs with that year at index 6.
  
  // Fetch all login IDs that look like they belong to this system (length 14 and contains year)
  // Optimization: In a real large scale system, we'd have a separate Sequence table. 
  // For this scale, selecting generic matches is fine.
  
  const users = await prisma.user.findMany({
    where: {
      loginId: {
        contains: year
      }
    },
    select: {
      loginId: true
    }
  });

  let maxSerial = 0;

  for (const u of users) {
    const id = u.loginId;
    // Expected format length is 14
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
