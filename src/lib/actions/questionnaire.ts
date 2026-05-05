'use server';

import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';

export type QuestionOption = { value: string; label: string };

export type QuestionnaireQuestionData = {
    id?: string;
    key: string;
    title: string;
    description?: string;
    type: 'select' | 'searchable-select' | 'text' | 'grid';
    category?: string;
    placeholder?: string;
    options?: QuestionOption[];
    order?: number;
    active?: boolean;
};

/** Public — used by the register page */
export async function getActiveQuestions(category: string = 'PROSPECT') {
    try {
        return await prisma.questionnaireQuestion.findMany({
            where: {
                active: true,
                category: category
            },
            orderBy: { order: 'asc' },
        });
    } catch (error) {
        console.error('Failed to fetch active questions:', error);
        return [];
    }
}

/** Admin: upsert (create or update) a question */
export async function upsertQuestion(data: QuestionnaireQuestionData) {
    await requireRole(['SUPER_ADMIN']);

    const payload = {
        key: data.key.trim().replace(/\s+/g, '_'),
        title: data.title.trim(),
        description: data.description?.trim() || null,
        type: data.type,
        category: data.category || 'PROSPECT',
        placeholder: data.placeholder?.trim() || null,
        options: data.options ?? [],
        active: data.active ?? true,
        order: data.order ?? 0,
    };

    try {
        if (data.id) {
            await prisma.questionnaireQuestion.update({ where: { id: data.id }, data: payload });
        } else {
            // Auto-assign order = max + 1
            const max = await prisma.questionnaireQuestion.aggregate({ _max: { order: true } });
            payload.order = (max._max.order ?? -1) + 1;
            await prisma.questionnaireQuestion.create({ data: payload });
        }
        revalidatePath('/dashboard/admin/questionnaire');
        return { success: true };
    } catch (error) {
        console.error('Failed to upsert question:', error);
        return { error: 'Failed to save question' };
    }
}

/** Admin: delete a question */
export async function deleteQuestion(id: string) {
    await requireRole(['SUPER_ADMIN']);
    try {
        await prisma.questionnaireQuestion.delete({ where: { id } });
        revalidatePath('/dashboard/admin/questionnaire');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete question:', error);
        return { error: 'Failed to delete question' };
    }
}

/** Admin: move a question up or down */
export async function moveQuestion(id: string, direction: 'up' | 'down') {
    await requireRole(['SUPER_ADMIN']);
    try {
        const all = await prisma.questionnaireQuestion.findMany({ orderBy: { order: 'asc' } });
        const idx = all.findIndex(q => q.id === id);
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= all.length) return { success: true };

        const a = all[idx];
        const b = all[swapIdx];

        await prisma.$transaction([
            prisma.questionnaireQuestion.update({ where: { id: a.id }, data: { order: b.order } }),
            prisma.questionnaireQuestion.update({ where: { id: b.id }, data: { order: a.order } }),
        ]);

        revalidatePath('/dashboard/admin/questionnaire');
        return { success: true };
    } catch (error) {
        console.error('Failed to move question:', error);
        return { error: 'Failed to reorder' };
    }
}

/** Admin: toggle active/inactive */
export async function toggleQuestion(id: string, active: boolean) {
    await requireRole(['SUPER_ADMIN']);
    try {
        await prisma.questionnaireQuestion.update({ where: { id }, data: { active } });
        revalidatePath('/dashboard/admin/questionnaire');
        return { success: true };
    } catch (error) {
        return { error: 'Failed to toggle question' };
    }
}
