const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('password123', 10);

    // 1. Create Super Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@tenpaten.com' },
        update: {},
        create: {
            email: 'admin@tenpaten.com',
            passwordHash: password,
            fullName: 'Super Admin',
            role: 'SUPER_ADMIN',
        },
    });

    // 2. Create Country Director for India
    const director = await prisma.user.upsert({
        where: { email: 'director@india.com' },
        update: {},
        create: {
            email: 'director@india.com',
            passwordHash: password,
            fullName: 'India Director',
            role: 'COUNTRY_DIRECTOR',
        },
    });

    console.log({ admin, director });

    // 3. Create Country (India) and link Director
    // Note: Circular dependency between Country and Director handled via updates or optionality.
    // Managing relationships:
    // User -> Country via `managedCountry` (CountryDirector relation)
    // Country -> User via `directorId` (CountryDirector relation)
    // Let's create Country with directorId.

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

    console.log({ india });
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
