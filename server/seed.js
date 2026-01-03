const mongoose = require('mongoose');
const User = require('./models/userModel');
const bcrypt = require('bcrypt');
require('dotenv').config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('DB Connected for Seeding');

        // Check if super admin exists
        const adminId = 'ADMIN01';
        const existingAdmin = await User.findOne({ loginId: adminId });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('Admin123!', 12);
            await User.create({
                loginId: adminId,
                password: hashedPassword,
                role: 'SUPER_ADMIN',
                isActive: true,
                isFirstLogin: false
            });
            console.log('Super Admin created: ADMIN01 / Admin123!');
        } else {
            console.log('Super Admin already exists');
        }

        process.exit();
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seed();
