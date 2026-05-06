/**
 * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-questionnaire.ts
 * Or: npx tsx prisma/seed-questionnaire.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const questions = [
    {
        key: 'fieldOfInterest',
        title: 'What do you want to study?',
        description: 'Select your primary area of interest to see relevant programmes.',
        type: 'grid',
        placeholder: 'Select a field',
        order: 0,
        category: 'PROSPECT',
        active: true,
        options: [
            { value: 'medicine', label: 'Medicine & Health' },
            { value: 'engineering', label: 'Engineering' },
            { value: 'tech', label: 'Computing & Tech' },
            { value: 'business', label: 'Business & Finance' },
            { value: 'arts', label: 'Arts & Humanities' },
            { value: 'law', label: 'Law & Governance' },
            { value: 'science', label: 'Natural Sciences' },
        ]
    },
    {
        key: 'highestEducation',
        title: 'Your highest education?',
        description: 'We will match you with programs that fit your academic level.',
        type: 'select',
        placeholder: 'Select education level',
        order: 1,
        category: 'PROSPECT',
        active: true,
        options: [
            { value: 'high_school', label: 'High School / Secondary' },
            { value: 'diploma', label: 'Diploma / Associate' },
            { value: 'bachelors', label: "Bachelor's Degree" },
            { value: 'masters', label: "Master's Degree" },
            { value: 'phd', label: 'PhD / Doctorate' },
        ]
    },
    {
        key: 'desiredDestination',
        title: 'Preferred destination?',
        description: 'Where would you like to pursue your studies?',
        type: 'select',
        placeholder: 'Select destination',
        order: 2,
        category: 'PROSPECT',
        active: true,
        options: [
            { value: 'malawi', label: '🇲🇼 Malawi (Local)' },
            { value: 'india', label: '🇮🇳 India (International)' },
            { value: 'both', label: '🌍 Open to both' },
        ]
    },
    {
        key: 'startDate',
        title: 'When do you want to start?',
        description: 'This helps us find universities with open intakes.',
        type: 'select',
        placeholder: 'Select start date',
        order: 3,
        category: 'PROSPECT',
        active: true,
        options: [
            { value: 'asap', label: 'As soon as possible' },
            { value: 'next_6_months', label: 'In the next 6 months' },
            { value: 'next_year', label: 'Next year' },
        ]
    },
    // University Category Questions
    {
        key: 'institutionType',
        title: 'Institution Type',
        description: 'What type of institution are you representing?',
        type: 'select',
        placeholder: 'Select institution type',
        order: 0,
        active: true,
        category: 'UNIVERSITY',
        options: [
            { value: 'public', label: 'Public University' },
            { value: 'private', label: 'Private University' },
            { value: 'vocational', label: 'Vocational / Technical' },
            { value: 'college', label: 'Community College' },
        ]
    },
    {
        key: 'studentCapacity',
        title: 'Student Capacity',
        description: 'How many students do you currently enroll?',
        type: 'select',
        placeholder: 'Select capacity',
        order: 1,
        active: true,
        category: 'UNIVERSITY',
        options: [
            { value: 'small', label: 'Under 5,000' },
            { value: 'medium', label: '5,000 - 15,000' },
            { value: 'large', label: '15,000 - 30,000' },
            { value: 'huge', label: 'Over 30,000' },
        ]
    }
];

async function main() {
    console.log('Seeding questionnaire questions...');
    
    // Deactivate all existing questions first to ensure only the ones in our list are active
    await prisma.questionnaireQuestion.updateMany({
        data: { active: false }
    });

    for (const q of questions) {
        await prisma.questionnaireQuestion.upsert({
            where: { key: q.key },
            update: { ...q, active: true },
            create: { ...q as any, active: true },
        });
        console.log(`  ✓ ${q.key} (${q.category || 'PROSPECT'})`);
    }
    console.log('Done!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
