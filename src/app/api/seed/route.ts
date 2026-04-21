import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

export async function GET() {
    try {
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

        return NextResponse.json({ success: true, admin, director, india });
    } catch (error) {
        console.error('Seeding error:', error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
