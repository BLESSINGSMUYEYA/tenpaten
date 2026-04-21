
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const countries = await prisma.country.findMany({
        include: { _count: { select: { universities: true } } }
    });
    console.log('--- ALL COUNTRIES ---');
    countries.forEach(c => console.log(`[${c.id}] ${c.name} (${c.code}) - Universities: ${c._count.universities}`));
    await prisma.$disconnect();
}
main();
