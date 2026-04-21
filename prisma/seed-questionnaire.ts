/**
 * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-questionnaire.ts
 * Or: npx tsx prisma/seed-questionnaire.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const questions = [
    {
        key: 'nationality',
        title: 'What is your nationality?',
        description: 'This helps us find universities that accept students from your country.',
        type: 'searchable-select',
        placeholder: 'Type to search your country...',
        order: 0,
        active: true,
        options: [
            { value: 'algeria', label: '🇩🇿 Algeria (+213)' },
            { value: 'angola', label: '🇦🇴 Angola (+244)' },
            { value: 'benin', label: '🇧🇯 Benin (+229)' },
            { value: 'botswana', label: '🇧🇼 Botswana (+267)' },
            { value: 'burkina_faso', label: '🇧🇫 Burkina Faso (+226)' },
            { value: 'burundi', label: '🇧🇮 Burundi (+257)' },
            { value: 'cameroon', label: '🇨🇲 Cameroon (+237)' },
            { value: 'chad', label: '🇹🇩 Chad (+235)' },
            { value: 'congo_drc', label: '🇨🇩 Congo DRC (+243)' },
            { value: 'congo_republic', label: '🇨🇬 Congo Republic (+242)' },
            { value: 'cote_divoire', label: "🇨🇮 Côte d'Ivoire (+225)" },
            { value: 'egypt', label: '🇪🇬 Egypt (+20)' },
            { value: 'ethiopia', label: '🇪🇹 Ethiopia (+251)' },
            { value: 'ghana', label: '🇬🇭 Ghana (+233)' },
            { value: 'guinea', label: '🇬🇳 Guinea (+224)' },
            { value: 'kenya', label: '🇰🇪 Kenya (+254)' },
            { value: 'lesotho', label: '🇱🇸 Lesotho (+266)' },
            { value: 'liberia', label: '🇱🇷 Liberia (+231)' },
            { value: 'madagascar', label: '🇲🇬 Madagascar (+261)' },
            { value: 'malawi', label: '🇲🇼 Malawi (+265)' },
            { value: 'mali', label: '🇲🇱 Mali (+223)' },
            { value: 'mauritius', label: '🇲🇺 Mauritius (+230)' },
            { value: 'morocco', label: '🇲🇦 Morocco (+212)' },
            { value: 'mozambique', label: '🇲🇿 Mozambique (+258)' },
            { value: 'namibia', label: '🇳🇦 Namibia (+264)' },
            { value: 'niger', label: '🇳🇪 Niger (+227)' },
            { value: 'nigeria', label: '🇳🇬 Nigeria (+234)' },
            { value: 'rwanda', label: '🇷🇼 Rwanda (+250)' },
            { value: 'senegal', label: '🇸🇳 Senegal (+221)' },
            { value: 'sierra_leone', label: '🇸🇱 Sierra Leone (+232)' },
            { value: 'south_africa', label: '🇿🇦 South Africa (+27)' },
            { value: 'south_sudan', label: '🇸🇸 South Sudan (+211)' },
            { value: 'sudan', label: '🇸🇩 Sudan (+249)' },
            { value: 'eswatini', label: '🇸🇿 Eswatini (+268)' },
            { value: 'tanzania', label: '🇹🇿 Tanzania (+255)' },
            { value: 'togo', label: '🇹🇬 Togo (+228)' },
            { value: 'tunisia', label: '🇹🇳 Tunisia (+216)' },
            { value: 'uganda', label: '🇺🇬 Uganda (+256)' },
            { value: 'zambia', label: '🇿🇲 Zambia (+260)' },
            { value: 'zimbabwe', label: '🇿🇼 Zimbabwe (+263)' },
        ]
    },
    {
        key: 'highestEducation',
        title: 'What is your highest level of education?',
        description: 'We will match you with programs that fit your academic background.',
        type: 'select',
        placeholder: 'Select education level',
        order: 1,
        active: true,
        options: [
            { value: 'high_school', label: 'High School / Secondary School' },
            { value: 'diploma', label: 'Diploma / Associate Degree' },
            { value: 'bachelors', label: "Bachelor's Degree" },
            { value: 'masters', label: "Master's Degree" },
            { value: 'phd', label: 'PhD / Doctorate' },
        ]
    },
    {
        key: 'desiredDestination',
        title: 'Where do you want to study?',
        description: 'Pick your dream study destination.',
        type: 'select',
        placeholder: 'Select destination',
        order: 2,
        active: true,
        options: [
            { value: 'malawi', label: 'Malawi' },
            { value: 'india', label: 'India' },
        ]
    },
    {
        key: 'englishProficiency',
        title: 'What is your level of English proficiency?',
        description: 'Select the option that best represents your English language skills or test status.',
        type: 'select',
        placeholder: 'Select English test status',
        order: 3,
        active: true,
        options: [
            { value: 'fluent', label: 'Fluent / Native Speaker' },
            { value: 'advanced', label: 'Advanced (C1/C2)' },
            { value: 'intermediate', label: 'Intermediate (B1/B2)' },
            { value: 'basic', label: 'Basic / Beginner' },
        ]
    },
    {
        key: 'startDate',
        title: 'When do you plan to start studying?',
        description: 'Helps us find intakes that are open for you.',
        type: 'select',
        placeholder: 'Select start date',
        order: 4,
        active: true,
        category: 'PROSPECT',
        options: [
            { value: 'asap', label: 'As soon as possible' },
            { value: 'next_6_months', label: 'In the next 6 months' },
            { value: 'next_year', label: 'In 1 year' },
            { value: 'unsure', label: "I'm not sure yet" },
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
        title: 'Approximate Student Capacity',
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
    for (const q of questions) {
        await prisma.questionnaireQuestion.upsert({
            where: { key: q.key },
            update: { ...q },
            create: { ...q as any },
        });
        console.log(`  ✓ ${q.key} (${q.category || 'PROSPECT'})`);
    }
    console.log('Done!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
