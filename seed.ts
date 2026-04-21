import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');
    const password = await bcrypt.hash('password123', 10);

    // 1. Create Super Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@tenpaten.com' },
        update: {},
        create: {
            email: 'admin@tenpaten.com',
            passwordHash: password,
            fullName: 'Super Admin',
            role: Role.SUPER_ADMIN,
        },
    });
    console.log('Admin created/updated:', admin.email);

    // 2. Create Country Director for India
    const director = await prisma.user.upsert({
        where: { email: 'director@india.com' },
        update: {},
        create: {
            email: 'director@india.com',
            passwordHash: password,
            fullName: 'India Director',
            role: Role.COUNTRY_DIRECTOR,
        },
    });
    console.log('Director created/updated:', director.email);

    // 3. Create Country (India) and link Director
    const india = await prisma.country.upsert({
        where: { code: 'IN' },
        update: {
            directorId: director.id,
        },
        create: {
            name: 'India',
            code: 'IN',
            directorId: director.id,
            currencySymbol: '₹',
        },
    });
    console.log('Country created/updated:', india.name);
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
