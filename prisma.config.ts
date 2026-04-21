import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { defineConfig } from '@prisma/config';

export default defineConfig({
    datasource: {
        url: process.env.DATABASE_URL!,
    },
    migrations: {
        seed: 'tsx prisma/seed.ts',
    },
});
