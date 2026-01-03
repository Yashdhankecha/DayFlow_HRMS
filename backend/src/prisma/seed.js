const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const adminPassword = await bcrypt.hash('Admin123!', 10);

    const admin = await prisma.user.upsert({
        where: { loginId: 'ADMIN01' },
        update: {},
        create: {
            loginId: 'ADMIN01',
            password: adminPassword,
            role: 'SUPER_ADMIN',
            isFirstLogin: false, // Admin doesn't need to change password immediately for dev
            isActive: true
        },
    });

    console.log({ admin });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
