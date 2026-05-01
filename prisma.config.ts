import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });       // Load base env first (DATABASE_URL, DIRECT_URL)
dotenv.config({ path: '.env.local' }); // Local overrides take precedence
import { defineConfig } from '@prisma/config';

export default defineConfig({
    datasource: {
        url: process.env.DATABASE_URL!,
    },
    migrations: {
        seed: 'tsx prisma/seed.ts',
    },
});
