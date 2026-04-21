import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function getStudentStats() {
    const session = await auth();
    if (!session?.user?.email) return null;

    try {
        const applications = await prisma.application.findMany({
            where: { prospect: { email: session.user.email } },
        });

        const stats = {
            total: applications.length,
            submitted: applications.filter(app => app.status === 'SUBMITTED').length,
            underReview: applications.filter(app =>
                app.status === 'COUNTRY_REVIEW' || app.status === 'UNIVERSITY_REVIEW'
            ).length,
            offerIssued: applications.filter(app => app.status === 'OFFER_ISSUED').length,
            accepted: applications.filter(app =>
                app.status === 'OFFER_ACCEPTED' || app.status === 'ENROLLED'
            ).length,
            rejected: applications.filter(app => app.status === 'REJECTED').length,
        };

        return stats;
    } catch (error) {
        console.error('Failed to fetch student stats:', error);
        return null;
    }
}

export async function getStudentProgress() {
    const session = await auth();
    if (!session?.user?.email) return null;

    try {
        const applications = await prisma.application.findMany({
            where: { prospect: { email: session.user.email } },
            orderBy: { createdAt: 'desc' },
        });

        const total = applications.length;
        const submitted = applications.filter(app => app.status !== 'DRAFT').length;
        const offers = applications.filter(app => app.status === 'OFFER_ISSUED').length;
        const accepted = applications.filter(app =>
            app.status === 'OFFER_ACCEPTED' || app.status === 'ENROLLED'
        ).length;

        // Calculate progress milestones
        let currentMilestone = 'Getting Started';
        let nextMilestone = 'First Application';
        let pointsToNext = 1;
        let completionPercentage = 0;

        if (total === 0) {
            currentMilestone = 'Getting Started';
            nextMilestone = 'First Application';
            pointsToNext = 1;
            completionPercentage = 0;
        } else if (total < 3) {
            currentMilestone = 'Beginner';
            nextMilestone = 'Application Master';
            pointsToNext = 3 - total;
            completionPercentage = Math.round((total / 3) * 100);
        } else if (offers === 0) {
            currentMilestone = 'Application Master';
            nextMilestone = 'First Offer';
            pointsToNext = 1;
            completionPercentage = 60;
        } else if (accepted === 0) {
            currentMilestone = 'Offer Received';
            nextMilestone = 'Acceptance';
            pointsToNext = 1;
            completionPercentage = 80;
        } else {
            currentMilestone = 'Success!';
            nextMilestone = 'Enrolled';
            pointsToNext = 0;
            completionPercentage = 100;
        }

        return {
            currentMilestone,
            nextMilestone,
            pointsToNext,
            completionPercentage,
            totalApplications: total,
            submittedApplications: submitted,
            offersReceived: offers,
            acceptedOffers: accepted,
        };
    } catch (error) {
        console.error('Failed to fetch prospect progress:', error);
        return null;
    }
}

export async function getStudentAchievements() {
    const session = await auth();
    if (!session?.user?.email) return [];

    try {
        const applications = await prisma.application.findMany({
            where: { prospect: { email: session.user.email } },
            orderBy: { createdAt: 'asc' },
        });

        const badges = [];
        const total = applications.length;
        const submitted = applications.filter(app => app.status !== 'DRAFT').length;
        const offers = applications.filter(app => app.status === 'OFFER_ISSUED').length;
        const accepted = applications.filter(app =>
            app.status === 'OFFER_ACCEPTED' || app.status === 'ENROLLED'
        ).length;

        // First Application badge
        if (total >= 1) {
            badges.push({
                id: 'first-app',
                label: 'First Step',
                color: 'blue' as const,
            });
        }

        // Fast Learner (submitted within first week)
        if (submitted >= 1 && applications[0]) {
            const firstApp = applications[0];
            const daysSinceCreation = Math.floor(
                (Date.now() - new Date(firstApp.createdAt).getTime()) / (1000 * 60 * 60 * 24)
            );
            if (daysSinceCreation <= 7 && firstApp.status !== 'DRAFT') {
                badges.push({
                    id: 'fast-learner',
                    label: 'Fast Learner',
                    color: 'yellow' as const,
                });
            }
        }

        // Application Master (3+ applications)
        if (total >= 3) {
            badges.push({
                id: 'app-master',
                label: 'Application Master',
                color: 'purple' as const,
                count: total,
            });
        }

        // Offer Received
        if (offers >= 1) {
            badges.push({
                id: 'offer-received',
                label: 'Offer Received',
                color: 'indigo' as const,
                count: offers > 1 ? offers : undefined,
            });
        }

        // Top Performer (accepted offer)
        if (accepted >= 1) {
            badges.push({
                id: 'top-performer',
                label: 'Top Performer',
                color: 'green' as const,
            });
        }

        return badges;
    } catch (error) {
        console.error('Failed to fetch prospect achievements:', error);
        return [];
    }
}

export async function getUpcomingDeadlines() {
    const session = await auth();
    if (!session?.user?.email) return [];

    try {
        const applications = await prisma.application.findMany({
            where: {
                prospect: { email: session.user.email },
                status: { in: ['SUBMITTED', 'COUNTRY_REVIEW', 'UNIVERSITY_REVIEW', 'OFFER_ISSUED'] }
            },
            include: { program: { include: { university: true } } },
        });

        const deadlines = applications.flatMap(app => {
            const deadlineList = [];
            const now = new Date();

            if (app.status === 'SUBMITTED') {
                const reviewDeadline = new Date(app.createdAt);
                reviewDeadline.setDate(reviewDeadline.getDate() + 14);
                if (reviewDeadline > now) {
                    deadlineList.push({
                        id: `${app.id}-review`,
                        title: `Review: ${app.program.name}`,
                        date: reviewDeadline,
                        type: 'application' as const,
                        applicationId: app.id,
                        daysUntil: Math.ceil((reviewDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
                    });
                }
            }

            if (app.status === 'OFFER_ISSUED') {
                const acceptDeadline = new Date(app.updatedAt);
                acceptDeadline.setDate(acceptDeadline.getDate() + 7);
                if (acceptDeadline > now) {
                    deadlineList.push({
                        id: `${app.id}-accept`,
                        title: `Accept Offer: ${app.program.name}`,
                        date: acceptDeadline,
                        type: 'decision' as const,
                        applicationId: app.id,
                        daysUntil: Math.ceil((acceptDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
                    });
                }
            }

            return deadlineList;
        });

        return deadlines.sort((a, b) => a.daysUntil - b.daysUntil);
    } catch (error) {
        console.error('Failed to fetch upcoming deadlines:', error);
        return [];
    }
}

export async function getProfileCompletion() {
    const session = await auth();
    if (!session?.user?.email) return { completionPercentage: 0, missingFields: [] };

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) return { completionPercentage: 0, missingFields: [] };

        const fields = [
            { name: 'Full Name', completed: !!user.fullName, link: '/dashboard/student-settings?tab=account' },
            { name: 'Email', completed: !!user.email, link: '/dashboard/student-settings?tab=account' },
            {
                name: 'Personal Information',
                completed: !!user.personalInfo && Object.keys(user.personalInfo as object).length > 0,
                link: '/dashboard/student-settings?tab=personal'
            },
            {
                name: 'Family Information',
                completed: !!user.familyInfo && Object.keys(user.familyInfo as object).length > 0,
                link: '/dashboard/student-settings?tab=family'
            },
            {
                name: 'Academic Background',
                completed: !!user.academicInfo && Object.keys(user.academicInfo as object).length > 0,
                link: '/dashboard/student-settings?tab=academic'
            },
            {
                name: 'Activities & Achievements',
                completed: !!user.activitiesInfo && Object.keys(user.activitiesInfo as object).length > 0,
                link: '/dashboard/student-settings?tab=activities'
            },
            {
                name: 'Documents',
                completed: !!user.documents && Array.isArray(user.documents) && user.documents.length > 0,
                link: '/dashboard/student-settings?tab=documents'
            },
        ];

        const completedCount = fields.filter(f => f.completed).length;
        const completionPercentage = Math.round((completedCount / fields.length) * 100);
        const missingFields = fields.filter(f => !f.completed);

        return { completionPercentage, missingFields, allFields: fields };
    } catch (error) {
        console.error('Failed to fetch profile completion:', error);
        return { completionPercentage: 0, missingFields: [], allFields: [] };
    }
}

export async function getQuickActionsCounts() {
    const session = await auth();
    if (!session?.user?.email) return { draftCount: 0, pendingDocuments: 0, unreadMessages: 0 };

    try {
        const [draftCount, unreadMessages] = await Promise.all([
            prisma.application.count({
                where: {
                    prospect: { email: session.user.email },
                    status: 'DRAFT'
                },
            }),
            prisma.notification.count({
                where: {
                    user: { email: session.user.email },
                    read: false
                }
            })
        ]);

        const pendingDocuments = 0;

        return { draftCount, pendingDocuments, unreadMessages };
    } catch (error) {
        console.error('Failed to fetch quick actions counts:', error);
        return { draftCount: 0, pendingDocuments: 0, unreadMessages: 0 };
    }
}
