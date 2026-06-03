import { PrismaClient, Role } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const malawi = await prisma.country.findFirst({
        where: { name: { contains: 'Malawi' } },
        include: { director: true }
    });
    console.log('Malawi details:', JSON.stringify(malawi, null, 2));
    
    const directors = await prisma.user.findMany({
        where: { role: Role.COUNTRY_DIRECTOR }
    });
    console.log('All directors in DB:', JSON.stringify(directors, null, 2));
    
    await prisma.$disconnect();
}
main();
