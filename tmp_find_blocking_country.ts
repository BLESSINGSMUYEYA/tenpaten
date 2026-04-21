
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    try {
        const country = await prisma.country.findFirst({
            where: {
                name: { contains: 'mass', mode: 'insensitive' }
            },
            include: {
                universities: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        
        if (country) {
            console.log('--- COUNTRY FOUND ---');
            console.log(`ID: ${country.id}`);
            console.log(`Name: ${country.name}`);
            console.log(`Code: ${country.code}`);
            console.log('--- ASSOCIATED UNIVERSITIES ---');
            if (country.universities.length === 0) {
                console.log('None.');
            } else {
                country.universities.forEach(u => console.log(`- ${u.name} (ID: ${u.id})`));
            }
        } else {
            console.log('No country found containing "mass"');
        // List all countries that have universities
        const allCountries = await prisma.country.findMany({
            include: { universities: { select: { id: true, name: true } } }
        });
        console.log('--- ALL COUNTRIES AND THEIR UNIVERSITIES ---');
        allCountries.forEach(c => {
            console.log(`${c.name} (${c.universities.length} universities):`);
            c.universities.forEach(u => console.log(`  - ${u.name}`));
        });
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}
main();
