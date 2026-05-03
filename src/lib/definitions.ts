import { z } from 'zod';

export const LoginFormSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(1, { message: 'Password is required.' }),
    callbackUrl: z.string().optional(),
});

export const RegisterFormSchema = z.object({
    fullName: z.string().min(2, { message: 'Must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
    residenceCountryId: z.string().optional().or(z.literal('')),
    role: z.string().optional(),
    callbackUrl: z.string().optional(),
});

export const CreateUniversitySchema = z.object({
    name: z.string().min(3, { message: 'University name must be at least 3 characters.' }),
    description: z.string().optional(),
    website: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
    tuition: z.string().optional(),
});

export const PersonalInfoSchema = z.object({
    dateOfBirth: z.string().optional(),
    nationality: z.string().optional(),
    passportNumber: z.string().optional(),
    passportIssueDate: z.string().optional(),
    passportExpiryDate: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    residenceCountryId: z.string().optional(),
    postalCode: z.string().optional(),
    gender: z.string().optional(),
    maritalStatus: z.string().optional(),
    placeOfBirth: z.string().optional(),
    nativeLanguage: z.string().optional(),
    visaStatus: z.string().optional(),
    medicalConditions: z.string().optional(),
});

export const AcademicInfoSchema = z.object({
    highestQualification: z.enum(['high_school', 'diploma', 'bachelors', 'masters', 'phd']).optional(),
    institution: z.string().optional(),
    fieldOfStudy: z.string().optional(),
    graduationYear: z.string().optional(),
    gpa: z.string().optional(),
    testType: z.string().optional(),
    testScore: z.string().optional(),
    testDate: z.string().optional(),
    examinationBoard: z.enum(['MSCE', 'IGSCE', 'Other']).optional(),
    bestSubjects: z.array(z.object({
        subject: z.string(),
        points: z.string(),
    })).optional(),
    ieltsScore: z.string().optional(),
    toeflScore: z.string().optional(),
    pteScore: z.string().optional(),
    disciplinaryHistory: z.string().optional(),
    desiredIntake: z.string().optional(),
    studyMode: z.string().optional(),
});

export const FamilyInfoSchema = z.object({
    fatherName: z.string().optional(),
    fatherOccupation: z.string().optional(),
    fatherMobile: z.string().optional(),
    motherName: z.string().optional(),
    motherOccupation: z.string().optional(),
    motherMobile: z.string().optional(),
    emergencyContactName: z.string().optional(),
    emergencyContactRelation: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
});

export const ActivitiesInfoSchema = z.object({
    extracurriculars: z.string().optional(),
    achievements: z.string().optional(),
    volunteerWork: z.string().optional(),
    hobbies: z.string().optional(),
});

export const FinancialInfoSchema = z.object({
    fundingSource: z.string().optional(),
    sponsorName: z.string().optional(),
    sponsorRelationship: z.string().optional(),
    sponsorContact: z.string().optional(),
    requestFinancialAid: z.boolean().optional(),
});

export const WorkExperienceSchema = z.object({
    experiences: z.array(z.object({
        company: z.string(),
        jobTitle: z.string(),
        startDate: z.string(),
        endDate: z.string().optional(),
        responsibilities: z.string(),
    })).optional(),
    totalYearsExperience: z.string().optional(),
});

export const BankDetailsSchema = z.object({
    bankName: z.string().min(1, 'Bank name is required'),
    accountName: z.string().min(1, 'Account name is required'),
    accountNumber: z.string().min(1, 'Account number is required'),
    swiftCode: z.string().optional(),
});

export const UserDocumentSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    type: z.string(),
    subType: z.string().optional(),
    label: z.string().optional(),
    url: z.string().url(),
    size: z.number().optional(),
    publicId: z.string().optional(),
    uploadedAt: z.string().optional().or(z.date().transform(d => d.toISOString())),
});

export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export type AcademicInfo = z.infer<typeof AcademicInfoSchema>;
export type FamilyInfo = z.infer<typeof FamilyInfoSchema>;
export type ActivitiesInfo = z.infer<typeof ActivitiesInfoSchema>;
export type BankDetails = z.infer<typeof BankDetailsSchema>;
export type UserDocument = z.infer<typeof UserDocumentSchema>;
export type FinancialInfo = z.infer<typeof FinancialInfoSchema>;
export type WorkExperience = z.infer<typeof WorkExperienceSchema>;
