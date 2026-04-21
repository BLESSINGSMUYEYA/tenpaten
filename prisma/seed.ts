import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('password123', 10);

    // 0. Cleanup existing data to avoid conflicts
    await prisma.message.deleteMany();
    await prisma.conversationParticipant.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.auditLog.deleteMany();

    await prisma.payout.deleteMany();
    await prisma.institutionalTransaction.deleteMany();
    await prisma.affiliatePayout.deleteMany();
    await prisma.applicationStatusHistory.deleteMany();
    await prisma.application.deleteMany();
    await prisma.program.deleteMany();
    await prisma.department.deleteMany();
    await prisma.affiliateProfile.deleteMany();

    // Cleanup universities and countries carefully due to circular relations (Director <-> Country)
    // First, remove the director relation from country to delete users freely? 
    // Actually, University -> Country. Country -> User (Director). User -> Country (managedCountry).
    // The existing script deleted University then Country.
    // We might need to handle the circular dependency if strict. 
    // For now, following the existing pattern but adding more robust cleanup if needed.
    await prisma.university.deleteMany();
    await prisma.country.deleteMany();
    await prisma.user.deleteMany(); // Clear users to ensure clean slate

    const admin = await prisma.user.create({
        data: {
            email: 'admin@tenpaten.com',
            passwordHash: password,
            fullName: 'Super Admin',
            role: Role.SUPER_ADMIN,
        },
    });

    // 2. Create Country Director for India
    const director = await prisma.user.create({
        data: {
            email: 'director@india.com',
            passwordHash: password,
            fullName: 'India Director',
            role: Role.COUNTRY_DIRECTOR,
        },
    });

    // 3. Create Prospect User
    const prospect = await prisma.user.create({
        data: {
            email: 'prospect@test.com',
            passwordHash: password,
            fullName: 'Test Prospect',
            role: Role.PROSPECT,
        },
    });

    console.log({ admin, director, prospect });

    // 4. Create Country (India) and link Director
    const india = await prisma.country.create({
        data: {
            name: 'India',
            code: 'IN',
            directorId: director.id,
            currencySymbol: '₹',
        },
    });

    console.log({ india });

    // University 1: Indian Institute of Technology Delhi
    const iitDelhi = await prisma.university.create({
        data: {
            name: 'Indian Institute of Technology Delhi',
            countryId: india.id,
            departments: {
                create: [
                    { name: 'School of Engineering' },
                    { name: 'School of Artificial Intelligence' }
                ]
            }
        },
        include: { departments: true }
    });

    const iitDelhiEng = iitDelhi.departments.find(s => s.name === 'School of Engineering')!;
    const iitDelhiAI = iitDelhi.departments.find(s => s.name === 'School of Artificial Intelligence')!;

    // Create School Admin for IIT Delhi Engineering
    const schoolAdmin = await prisma.user.create({
        data: {
            email: 'school@iitd.com',
            passwordHash: password,
            fullName: 'IIT Delhi School Admin',
            role: Role.SCHOOL_ADMIN,
            managedUniversityId: iitDelhi.id,
        },
    });

    console.log({ schoolAdmin });

    await prisma.program.createMany({
        data: [
            {
                name: 'B.Tech in Computer Science',
                description: 'A comprehensive undergraduate program focusing on computer systems, algorithms, and software development.',
                duration: '4 Years',
                baseTuition: 200000,
                level: 'Undergraduate',
                requirements: 'JEE Advanced Rank < 500, Mathematics 90%+',
                intake: 'July',
                universityId: iitDelhi.id,
                departmentId: iitDelhiEng.id
            },
            {
                name: 'M.Tech in Artificial Intelligence',
                description: 'Advanced postgraduate study in machine learning, neural networks, and robotics.',
                duration: '2 Years',
                baseTuition: 150000,
                level: 'Postgraduate',
                requirements: 'GATE Score 800+, B.Tech in relevant field',
                intake: 'July, January',
                universityId: iitDelhi.id,
                departmentId: iitDelhiAI.id
            }
        ]
    });

    // University 2: University of Mumbai
    const mumbaiUni = await prisma.university.create({
        data: {
            name: 'University of Mumbai',
            countryId: india.id,
            departments: {
                create: [
                    { name: 'School of Management' },
                    { name: 'School of Science' }
                ]
            }
        },
        include: { departments: true }
    });

    const mumbaiMgmt = mumbaiUni.departments.find(s => s.name === 'School of Management')!;
    const mumbaiSci = mumbaiUni.departments.find(s => s.name === 'School of Science')!;

    await prisma.program.createMany({
        data: [
            {
                name: 'Master of Business Administration (MBA)',
                description: 'A flagship management program with focus on finance, marketing, and leadership.',
                duration: '2 Years',
                baseTuition: 300000,
                level: 'Postgraduate',
                requirements: 'CAT/MAT Percentile 90+, Bachelor degree with 50%+',
                intake: 'August',
                universityId: mumbaiUni.id,
                departmentId: mumbaiMgmt.id
            },
            {
                name: 'Bachelor of Science in Data Science',
                description: 'Modern undergraduate program teaching statistical analysis, big data technologies, and predictive modeling.',
                duration: '3 Years',
                baseTuition: 120000,
                level: 'Undergraduate',
                requirements: 'HS Result 80%+, Math as mandatory subject',
                intake: 'June',
                universityId: mumbaiUni.id,
                departmentId: mumbaiSci.id
            }
        ]
    });

    // University 3: University of Delhi (Keeping it simple)
    const delhiUni = await prisma.university.create({
        data: {
            name: 'University of Delhi',
            countryId: india.id,
            programs: {
                create: [
                    {
                        name: 'Bachelor of Arts in Economics',
                        description: 'Top-tier economics program covering micro/macro economics, econometrics, and public policy.',
                        duration: '3 Years',
                        baseTuition: 25000,
                        level: 'Undergraduate',
                        requirements: 'DU Cut-off 98%+, Mathematics in 12th',
                        intake: 'June'
                    }
                ],
            },
        },
    });

    // University 4: Bangalore Institute of Technology
    const bitBangalore = await prisma.university.create({
        data: {
            name: 'Bangalore Institute of Technology',
            countryId: india.id,
            departments: {
                create: [
                    { name: 'School of Computing' }
                ]
            }
        },
        include: { departments: true }
    });

    const bitComp = bitBangalore.departments.find(s => s.name === 'School of Computing')!;

    await prisma.program.createMany({
        data: [
            {
                name: 'B.E. in Information Science',
                description: 'Focused on information processing, database management, and networking.',
                duration: '4 Years',
                baseTuition: 180000,
                level: 'Undergraduate',
                requirements: 'KCET/COMEDK Rank, Math 75%+',
                intake: 'August',
                universityId: bitBangalore.id,
                departmentId: bitComp.id
            }
        ]
    });

    // University 5: Jawaharlal Nehru University
    const jnu = await prisma.university.create({
        data: {
            name: 'Jawaharlal Nehru University',
            countryId: india.id,
            programs: {
                create: [
                    { name: 'Master of Arts in International Relations' },
                    { name: 'Master of Science in Environmental Sciences' },
                    { name: 'Ph.D. in Political Science' },
                    { name: 'Master of Arts in History' },
                ],
            },
        },
    });

    // University 6: Anna University
    const annaUni = await prisma.university.create({
        data: {
            name: 'Anna University',
            countryId: india.id,
            programs: {
                create: [
                    { name: 'B.E. in Civil Engineering' },
                    { name: 'B.Tech in Biotechnology' },
                    { name: 'M.E. in Structural Engineering' },
                    { name: 'M.Tech in Software Engineering' },
                ],
            },
        },
    });

    // University 7: Pune University
    const puneUni = await prisma.university.create({
        data: {
            name: 'Savitribai Phule Pune University',
            countryId: india.id,
            programs: {
                create: [
                    { name: 'Bachelor of Engineering in Computer Engineering' },
                    { name: 'Master of Computer Applications (MCA)' },
                    { name: 'Bachelor of Pharmacy' },
                    { name: 'Master of Science in Chemistry' },
                ],
            },
        },
    });

    // University 8: Calcutta University
    const calcuttaUni = await prisma.university.create({
        data: {
            name: 'University of Calcutta',
            countryId: india.id,
            programs: {
                create: [
                    { name: 'Bachelor of Science in Mathematics' },
                    { name: 'Master of Arts in Bengali Literature' },
                    { name: 'Bachelor of Law (LLB)' },
                    { name: 'Master of Commerce' },
                ],
            },
        },
    });

    // University 9: Massachusetts Institute of Technology (Rich Data Example)
    const mit = await prisma.university.create({
        data: {
            name: 'Massachusetts Institute of Technology (MIT)',
            country: {
                create: {
                    name: 'United States',
                    code: 'US',
                    currencySymbol: '$',
                    director: {
                        create: {
                            email: 'director@us.com',
                            passwordHash: password,
                            fullName: 'US Country Director',
                            role: Role.COUNTRY_DIRECTOR,
                        }
                    }
                }
            },
            departments: {
                create: [
                    {
                        name: 'School of Engineering',
                    }
                ]
            }
        },
        include: { departments: true }
    });

    const mitEng = mit.departments.find(s => s.name === 'School of Engineering')!;

    // Create School Admin for MIT
    const mitAdmin = await prisma.user.create({
        data: {
            email: 'admin@mit.edu',
            passwordHash: password,
            fullName: 'MIT School Admin',
            role: Role.SCHOOL_ADMIN,
            managedUniversityId: mit.id,
            profilePhoto: 'https://i.pravatar.cc/150?u=mit_admin'
        },
    });

    // Create Programs for MIT
    const mitPrograms = await prisma.program.createManyAndReturn({
        data: [
            {
                name: 'B.S. in Computer Science and Engineering',
                description: 'A deep dive into computation, algorithms, and systems engineering.',
                duration: '4 Years',
                baseTuition: 57590,
                level: 'Undergraduate',
                requirements: 'SAT 1500+, High GPA, Strong Math Background',
                intake: 'September',
                universityId: mit.id,
                departmentId: mitEng.id
            },
            {
                name: 'Master of Engineering in AI',
                description: 'Advanced professional degree focused on practical AI applications.',
                duration: '1 Year',
                baseTuition: 80000,
                level: 'Postgraduate',
                requirements: 'B.S. in CS, GRE Required',
                intake: 'September',
                universityId: mit.id,
                departmentId: mitEng.id
            }
        ]
    });

    // Connect Prospect to Application (Data Connection)
    // Using the 'prospect' user created earlier
    const csProgram = mitPrograms.find(p => p.name.includes('Computer Science'));
    if (csProgram && prospect) {
        await prisma.application.create({
            data: {
                prospectId: prospect.id,
                programId: csProgram.id,
                status: 'SUBMITTED',
                statusHistory: {
                    create: {
                        status: 'SUBMITTED',
                        changedBy: prospect.id,
                        note: 'Initial submission'
                    }
                }
            }
        });
    }

    console.log('✅ Successfully seeded 8 universities with 32 programs!');
    console.log({
        iitDelhi: iitDelhi.name,
        mumbaiUni: mumbaiUni.name,
        delhiUni: delhiUni.name,
        bitBangalore: bitBangalore.name,
        jnu: jnu.name,
        annaUni: annaUni.name,
        puneUni: puneUni.name,
        calcuttaUni: calcuttaUni.name,
        mit: mit.name
    });
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
