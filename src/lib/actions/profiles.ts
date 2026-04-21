'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-utils';
import { logAction } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

import {
    PersonalInfoSchema,
    AcademicInfoSchema,
    FamilyInfoSchema,
    ActivitiesInfoSchema,
    FinancialInfoSchema,
    WorkExperienceSchema
} from '@/lib/definitions';

export async function updateProfile(prevState: any, formData: FormData) {
    const user = await getCurrentUser();

    const fullName = formData.get('fullName') as string;

    if (!fullName || fullName.trim().length === 0) {
        return { success: false, error: 'Name is required.' };
    }

    try {
        await prisma.user.update({
            where: { id: user.id as string },
            data: { fullName }
        });

        await logAction(user.id as string, 'UPDATE_PROFILE');

        revalidatePath('/dashboard/student-settings');
        return { success: true, message: 'Profile updated successfully.' };
    } catch (error) {
        console.error('Failed to update profile:', error);
        return { success: false, error: 'Failed to update profile.' };
    }
}

export async function updatePersonalInfo(data: any) {
    const user = await getCurrentUser();

    const parsed = PersonalInfoSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, error: 'Invalid personal information data.' };
    }

    try {
        const { residenceCountryId, ...personalInfo } = parsed.data;

        await prisma.user.update({
            where: { id: user.id as string },
            data: { 
                personalInfo: personalInfo as any,
                residenceCountryId: residenceCountryId || undefined
            },
        });

        await logAction(user.id as string, 'UPDATE_PERSONAL_INFO');
        revalidatePath('/dashboard/student-settings');
        return { success: true, message: 'Personal information saved successfully!' };
    } catch (error) {
        console.error('Failed to update personal info:', error);
        return { success: false, error: 'Failed to save personal information.' };
    }
}

export async function updateAcademicInfo(data: any) {
    const user = await getCurrentUser();

    const parsed = AcademicInfoSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, error: 'Invalid academic information data.' };
    }

    try {
        await prisma.user.update({
            where: { id: user.id as string },
            data: { academicInfo: parsed.data as any },
        });

        await logAction(user.id as string, 'UPDATE_ACADEMIC_INFO');
        revalidatePath('/dashboard/student-settings');
        return { success: true, message: 'Academic information saved successfully!' };
    } catch (error) {
        console.error('Failed to update academic info:', error);
        return { success: false, error: 'Failed to save academic information.' };
    }
}

export async function updateFamilyInfo(data: any) {
    const user = await getCurrentUser();

    const parsed = FamilyInfoSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, error: 'Invalid family information data.' };
    }

    try {
        await prisma.user.update({
            where: { id: user.id as string },
            data: { familyInfo: parsed.data as any },
        });

        await logAction(user.id as string, 'UPDATE_FAMILY_INFO');
        revalidatePath('/dashboard/student-settings');
        return { success: true, message: 'Family information saved successfully!' };
    } catch (error) {
        console.error('Failed to update family info:', error);
        return { success: false, error: 'Failed to save family information.' };
    }
}

export async function updateActivitiesInfo(data: any) {
    const user = await getCurrentUser();

    const parsed = ActivitiesInfoSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, error: 'Invalid activities information data.' };
    }

    try {
        await prisma.user.update({
            where: { id: user.id as string },
            data: { activitiesInfo: parsed.data as any },
        });

        await logAction(user.id as string, 'UPDATE_ACTIVITIES_INFO');
        revalidatePath('/dashboard/student-settings');
        return { success: true, message: 'Activities information saved successfully!' };
    } catch (error) {
        console.error('Failed to update activities info:', error);
        return { success: false, error: 'Failed to save activities information.' };
    }
}

export async function updateFinancialInfo(data: any) {
    const user = await getCurrentUser();

    const parsed = FinancialInfoSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, error: 'Invalid financial information data.' };
    }

    try {
        await prisma.user.update({
            where: { id: user.id as string },
            data: { financialInfo: parsed.data as any },
        });

        await logAction(user.id as string, 'UPDATE_FINANCIAL_INFO');
        revalidatePath('/dashboard/student-settings');
        return { success: true, message: 'Financial information saved successfully!' };
    } catch (error) {
        console.error('Failed to update financial info:', error);
        return { success: false, error: 'Failed to save financial information.' };
    }
}

export async function updateWorkExperience(data: any) {
    const user = await getCurrentUser();

    const parsed = WorkExperienceSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, error: 'Invalid work experience data.' };
    }

    try {
        await prisma.user.update({
            where: { id: user.id as string },
            data: { workExperience: parsed.data as any },
        });

        await logAction(user.id as string, 'UPDATE_WORK_EXPERIENCE');
        revalidatePath('/dashboard/student-settings');
        return { success: true, message: 'Work experience saved successfully!' };
    } catch (error) {
        console.error('Failed to update work experience:', error);
        return { success: false, error: 'Failed to save work experience.' };
    }
}
