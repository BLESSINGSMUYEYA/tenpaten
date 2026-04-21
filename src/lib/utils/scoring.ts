
export type AcademicInfo = {
    highestQualification?: string;
    gpa?: string;
    testScore?: string;
    testType?: string;
    bestSubjects?: { subject: string; points: string; }[];
};

export type ScoringResult = {
    score: number; // 0-100
    label: 'EXCEPTIONAL' | 'STRONG' | 'GOOD' | 'AVERAGE' | 'DEVELOPING';
    color: string;
    highlights: string[];
};

export function calculateMeritScore(info: AcademicInfo | null | undefined): ScoringResult {
    if (!info) {
        return { score: 0, label: 'DEVELOPING', color: '#9ca3af', highlights: ['Incomplete Profile'] };
    }

    let score = 0;
    const highlights: string[] = [];

    // Qualification Level Weight
    const qualWeights: Record<string, number> = {
        'phd': 100,
        'masters': 90,
        'bachelors': 80,
        'high_school': 70,
    };
    const qualScore = qualWeights[info.highestQualification || ''] || 50;
    
    // GPA Scoring (assuming 4.0 scale or percentage)
    if (info.gpa) {
        const gpa = parseFloat(info.gpa);
        if (gpa > 0) {
            if (gpa <= 4.0) {
                // 4.0 Scale
                score += (gpa / 4.0) * 40;
                if (gpa >= 3.8) highlights.push('Elite GPA (3.8+)');
            } else if (gpa <= 100) {
                // Percentage Scale
                score += (gpa / 100) * 40;
                if (gpa >= 90) highlights.push('Top 10% Academic Performer');
            }
        }
    } else if (info.bestSubjects && info.bestSubjects.length > 0) {
        // High School Points Scoring (Common in many regions)
        // Usually, lower points are better (e.g., 1 is A)
        // Let's assume a generic points system where we look for "1"s and "A"s
        const validSubjects = info.bestSubjects.filter(s => s.subject && s.points);
        if (validSubjects.length > 0) {
            const topGrades = validSubjects.filter(s => 
                s.points.toLowerCase() === '1' || 
                s.points.toLowerCase() === 'a' || 
                s.points.toLowerCase() === 'a*' ||
                parseInt(s.points) <= 2
            ).length;
            
            score += (topGrades / 6) * 40;
            if (topGrades >= 4) highlights.push(`Exceptional Grades (${topGrades} Distinctions)`);
        }
    }

    // Test Scores (IELTS, TOEFL, SAT, etc.)
    if (info.testScore) {
        score += 10;
        highlights.push(`Standardized Test Taken (${info.testType || 'General'})`);
    }

    // Base score from qualification
    score += (qualScore / 100) * 50;

    // Normalize to 100
    const finalScore = Math.min(Math.round(score), 100);

    let label: ScoringResult['label'] = 'AVERAGE';
    let color = '#3b82f6'; // blue

    if (finalScore >= 90) {
        label = 'EXCEPTIONAL';
        color = '#d5a22d'; // gold
    } else if (finalScore >= 75) {
        label = 'STRONG';
        color = '#10b981'; // emerald
    } else if (finalScore >= 60) {
        label = 'GOOD';
        color = '#6366f1'; // indigo
    } else if (finalScore >= 40) {
        label = 'AVERAGE';
        color = '#f59e0b'; // amber
    } else {
        label = 'DEVELOPING';
        color = '#ef4444'; // red
    }

    return { score: finalScore, label, color, highlights };
}
