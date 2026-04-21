"use server";

import prisma from '@/lib/prisma';
import { AlternativeStatus, ApplicationStatus } from '@prisma/client';

export interface SubjectGrade {
    subject: string;
    grade: number; // 1-9 in MSCE, where 1 is best, 9 is worst
}

export interface ProgramRequirements {
    requiredSubjects: { subject: string; maximumGrade: number }[]; // Lower is better
    maximumTotalPoints?: number; // Sum of best 6, lower is better
}

export interface StudentAcademicInfo {
    subjects?: SubjectGrade[];
    [key: string]: any;
}

/**
 * Calculates a match score (0-100) based on MSCE grading system.
 * Best 6 subjects determine total points. 1 is best, 9 is worst in a subject.
 */
function calculateMatchScore(studentAcademicInfo: StudentAcademicInfo | null, programRequirements: ProgramRequirements | null): number {
    if (!programRequirements || (!programRequirements.requiredSubjects?.length && !programRequirements.maximumTotalPoints)) {
        return 100; // If no requirements, it's a perfect fit.
    }

    if (!studentAcademicInfo || !studentAcademicInfo.subjects || studentAcademicInfo.subjects.length === 0) {
        return 0; // Student has no subjects listed.
    }

    let penalty = 0; // We'll deduct from 100 based on missed requirements

    // 1. Check Total Points (Best 6 subjects)
    if (programRequirements.maximumTotalPoints) {
        const sortedGrades = [...studentAcademicInfo.subjects]
            .map(s => Number(s.grade))
            .filter(g => !isNaN(g))
            .sort((a, b) => a - b); // Ascending order (lowest points = best)
        
        const best6 = sortedGrades.slice(0, 6);
        const totalPoints = best6.reduce((sum, val) => sum + val, 0);

        // If they don't have at least 6 grades, or their total exceeds the maximum allowed
        if (best6.length < 6 || totalPoints > programRequirements.maximumTotalPoints) {
            penalty += 40; // Heavy penalty for missing the main cut-off
        }
    }

    // 2. Check Specific Subject Requirements
    if (programRequirements.requiredSubjects && programRequirements.requiredSubjects.length > 0) {
        const required = programRequirements.requiredSubjects;
        const subjectWeight = 60 / required.length; // Remaining 60% based on specific subjects

        for (const req of required) {
            const studentSubject = studentAcademicInfo.subjects.find(
                s => s.subject.toLowerCase() === req.subject.toLowerCase()
            );

            if (!studentSubject) {
                penalty += subjectWeight; // Didn't even take the subject
                continue;
            }

            const studentVal = Number(studentSubject.grade);
            const reqVal = Number(req.maximumGrade);
            
            // In MSCE, a grade strictly HIGHER than the requested number is WORSE
            // e.g., if max grade is 4, a 5 or 6 is a fail.
            if (studentVal > reqVal || isNaN(studentVal)) {
                penalty += subjectWeight; 
            }
        }
    }

    const finalScore = Math.max(0, Math.round(100 - penalty));
    return finalScore;
}

/**
 * Finds alternative programs for a given application based on merit fit.
 */
export async function findAlternativePrograms(applicationId: string) {
    const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: { program: true }
    });

    if (!application) throw new Error('Application not found');

    const universityId = application.program.universityId;
    const studentInfo = application.academicInfo as unknown as StudentAcademicInfo;

    // Find all other active programs in the same university
    const otherPrograms = await prisma.program.findMany({
        where: {
            universityId,
            id: { not: application.programId }
        }
    });

    const matches = otherPrograms.map(program => {
        const requirements = program.subjectRequirements as unknown as ProgramRequirements;
        const score = calculateMatchScore(studentInfo, requirements);
        return {
            program,
            score
        };
    });

    // Sort by highest score first, only return top 3 matches greater than 0%
    return matches
        .filter(m => m.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
}

/**
 * Sends an alternative program switch suggestion to the student.
 */
export async function sendSwitchSuggestion(applicationId: string, alternativeProgramId: string) {
    // We update the application to note the alternative offer
    const updatedApplication = await prisma.application.update({
        where: { id: applicationId },
        data: {
            alternativeProgramId,
            alternativeStatus: AlternativeStatus.PENDING,
            // You might keep the status as UNIVERSITY_REVIEW if you want it to still seem active
            status: ApplicationStatus.UNIVERSITY_REVIEW 
        }
    });

    // Generate a notification for the student
    await prisma.notification.create({
        data: {
            userId: updatedApplication.prospectId,
            title: 'Action Required: Application Update',
            message: 'The admissions team has suggested an alternative program based on our merit-matching system. Please review the offer.',
            type: 'ACTION'
        }
    });

    return updatedApplication;
}
