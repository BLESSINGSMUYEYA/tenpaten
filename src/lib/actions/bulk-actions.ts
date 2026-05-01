'use server';

import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { logAction } from '@/lib/audit';
import { createNotification } from '../notifications';
import { pusherServer } from '../pusher';
import { calculateMeritScore, AcademicInfo } from '@/lib/utils/scoring';

// ─────────────────────────────────────────────────────────────────────────────
// BULK STATUS UPDATE
// Used by the Bulk Action Bar when officer selects multiple applicants
// and clicks "Issue Offers", "Move to Review", etc.
// ─────────────────────────────────────────────────────────────────────────────
export async function bulkUpdateApplicationStatus(
    ids: string[],
    newStatus: string,
    reason: string
): Promise<{ succeeded: number; failed: string[] }> {
    const user = await requireRole(['SCHOOL_ADMIN', 'COUNTRY_DIRECTOR', 'SUPER_ADMIN']);

    if (!ids || ids.length === 0) return { succeeded: 0, failed: [] };

    const succeeded: string[] = [];
    const failed: string[] = [];

    // Fetch all applications in one query to avoid N+1
    const applications = await prisma.application.findMany({
        where: { id: { in: ids } },
        include: {
            prospect: { select: { id: true, fullName: true, email: true } },
            program: { select: { id: true, name: true, universityId: true } },
        },
    });

    // Process all updates in parallel
    await Promise.all(
        applications.map(async (app) => {
            try {
                await prisma.application.update({
                    where: { id: app.id },
                    data: { status: newStatus as any },
                });

                await prisma.applicationStatusHistory.create({
                    data: {
                        applicationId: app.id,
                        status: newStatus as any,
                        changedBy: user.id as string,
                        note: reason || `Bulk action: status updated to ${newStatus}`,
                        isOverride: false,
                    },
                });

                // Notify the student
                const statusLabels: Record<string, string> = {
                    OFFER_ISSUED: 'Offer Issued 🎉',
                    UNIVERSITY_REVIEW: 'Under University Review',
                    REJECTED: 'Not Accepted',
                    ENROLLED: 'Enrolled 🏆',
                };
                const label = statusLabels[newStatus] || newStatus.replace(/_/g, ' ');

                createNotification(
                    app.prospectId,
                    `Application Update: ${label}`,
                    `Your application for ${app.program.name} has been updated to "${label}".`,
                    ['OFFER_ISSUED', 'ENROLLED'].includes(newStatus) ? 'SUCCESS' : newStatus === 'REJECTED' ? 'ERROR' : 'INFO',
                    `/dashboard/applications/${app.id}`
                ).catch(console.error);

                succeeded.push(app.id);
            } catch (err) {
                console.error(`Failed to update application ${app.id}:`, err);
                failed.push(app.id);
            }
        })
    );

    await logAction(user.id as string, 'BULK_STATUS_UPDATE', {
        newStatus,
        reason,
        succeeded: succeeded.length,
        failed: failed.length,
        ids,
    });

    // Broadcast real-time update to university channel
    if (succeeded.length > 0 && applications[0]) {
        try {
            await pusherServer.trigger(
                `university-${applications[0].program.universityId}`,
                'new-activity',
                {
                    type: 'BULK_ACTION',
                    message: `Bulk action: ${succeeded.length} applications updated to ${newStatus}`,
                    timestamp: new Date(),
                }
            );
        } catch (e) {
            console.error('Pusher bulk trigger failed:', e);
        }
    }

    return { succeeded: succeeded.length, failed };
}

// ─────────────────────────────────────────────────────────────────────────────
// RUN SCORING AND RANK
// Calculates meritScore for all active applications in a programme,
// sorts them, and persists rank + meritScore to the DB.
// Triggered by the "Run Scoring" button on a Programme Card.
// ─────────────────────────────────────────────────────────────────────────────
export async function runScoringAndRank(programId: string): Promise<{
    ranked: number;
    programName: string;
}> {
    const user = await requireRole(['SCHOOL_ADMIN', 'SUPER_ADMIN']);

    const program = await prisma.program.findUnique({
        where: { id: programId },
        select: { id: true, name: true, universityId: true },
    });

    if (!program) throw new Error('Programme not found');

    // Fetch all non-draft, non-rejected applications for this programme
    const applications = await prisma.application.findMany({
        where: {
            programId,
            status: {
                notIn: ['DRAFT', 'PAYMENT_PENDING', 'REJECTED', 'ENROLLED'],
            },
        },
        select: {
            id: true,
            academicInfo: true,
        },
    });

    // Score each application
    const scored = applications.map((app) => ({
        id: app.id,
        score: calculateMeritScore(app.academicInfo as unknown as AcademicInfo).score,
    }));

    // Sort descending — highest score = rank 1
    scored.sort((a, b) => b.score - a.score);

    // Persist meritScore and rank in a transaction
    await prisma.$transaction(
        scored.map((app, idx) =>
            prisma.application.update({
                where: { id: app.id },
                data: {
                    meritScore: app.score,
                    rank: idx + 1,
                },
            })
        )
    );

    await logAction(user.id as string, 'RUN_SCORING', {
        programId,
        programName: program.name,
        applicantsRanked: scored.length,
    });

    return { ranked: scored.length, programName: program.name };
}

// ─────────────────────────────────────────────────────────────────────────────
// OVERRIDE IMPACT PREVIEW
// Returns a preview of who gets displaced if an applicant's rank changes.
// Called before the override is confirmed — purely read-only.
// ─────────────────────────────────────────────────────────────────────────────
export async function getOverrideImpactPreview(
    applicationId: string,
    newRank: number
): Promise<{
    currentRank: number | null;
    displaced: { id: string; name: string; currentRank: number; newRank: number }[];
}> {
    await requireRole(['SCHOOL_ADMIN', 'SUPER_ADMIN']);

    const target = await prisma.application.findUnique({
        where: { id: applicationId },
        select: {
            rank: true,
            programId: true,
            prospect: { select: { fullName: true } },
        },
    });

    if (!target) throw new Error('Application not found');

    const currentRank = target.rank;
    if (!currentRank || currentRank === newRank) {
        return { currentRank, displaced: [] };
    }

    const moving_up = newRank < currentRank;

    // Find applicants whose rank will shift
    const affected = await prisma.application.findMany({
        where: {
            programId: target.programId,
            id: { not: applicationId },
            rank: moving_up
                ? { gte: newRank, lt: currentRank }  // Moving up: push these down by 1
                : { gt: currentRank, lte: newRank },  // Moving down: pull these up by 1
        },
        select: {
            id: true,
            rank: true,
            prospect: { select: { fullName: true } },
        },
        orderBy: { rank: 'asc' },
    });

    const displaced = affected.map((app) => ({
        id: app.id,
        name: app.prospect.fullName,
        currentRank: app.rank!,
        newRank: moving_up ? app.rank! + 1 : app.rank! - 1,
    }));

    return { currentRank, displaced };
}

// ─────────────────────────────────────────────────────────────────────────────
// SAVE OVERRIDE
// The structured override action. Requires a reason from a fixed list.
// Updates status, persists override marker in history, and adjusts ranks.
// ─────────────────────────────────────────────────────────────────────────────

import { OVERRIDE_REASONS, OverrideReason } from '../constants/admissions';

export async function saveOverride(
    applicationId: string,
    newStatus: string,
    overrideReason: OverrideReason,
    newRank?: number
): Promise<'success' | string> {
    const user = await requireRole(['SCHOOL_ADMIN', 'SUPER_ADMIN']);

    try {
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                prospect: { select: { id: true, fullName: true, email: true } },
                program: { select: { id: true, name: true, universityId: true } },
            },
        });

        if (!application) return 'Application not found';

        // Update the application status (and optionally rank)
        await prisma.application.update({
            where: { id: applicationId },
            data: {
                status: newStatus as any,
                ...(newRank !== undefined ? { rank: newRank } : {}),
            },
        });

        // Log with override markers
        await prisma.applicationStatusHistory.create({
            data: {
                applicationId,
                status: newStatus as any,
                changedBy: user.id as string,
                note: `Manual override by officer — Reason: ${overrideReason}`,
                isOverride: true,
                overrideReason,
            },
        });

        // If rank changed, reorder surrounding applicants
        if (newRank !== undefined && application.rank !== null && application.rank !== undefined) {
            const movingUp = newRank < application.rank;
            if (newRank !== application.rank) {
                const affected = await prisma.application.findMany({
                    where: {
                        programId: application.programId,
                        id: { not: applicationId },
                        rank: movingUp
                            ? { gte: newRank, lt: application.rank }
                            : { gt: application.rank, lte: newRank },
                    },
                    select: { id: true, rank: true },
                });

                await prisma.$transaction(
                    affected.map((a) =>
                        prisma.application.update({
                            where: { id: a.id },
                            data: { rank: movingUp ? a.rank! + 1 : a.rank! - 1 },
                        })
                    )
                );
            }
        }

        await logAction(user.id as string, 'MANUAL_OVERRIDE', {
            applicationId,
            newStatus,
            overrideReason,
            newRank,
            applicantName: application.prospect.fullName,
            programName: application.program.name,
        });

        // Notify student
        createNotification(
            application.prospectId,
            `Application Update`,
            `Your application for ${application.program.name} has been updated.`,
            ['OFFER_ISSUED', 'ENROLLED'].includes(newStatus) ? 'SUCCESS' : 'INFO',
            `/dashboard/applications/${applicationId}`
        ).catch(console.error);

        return 'success';
    } catch (error) {
        console.error('Override failed:', error);
        return 'Failed to save override.';
    }
}
