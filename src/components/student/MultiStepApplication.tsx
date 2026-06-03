'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { saveApplicationDraft, submitFullApplication } from '@/lib/actions/applications';
import { initiateApplicationPayment } from '@/lib/actions/payments';
import PaymentCheckoutModal from './PaymentCheckoutModal';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, User, GraduationCap, Eye, Users, School, Trophy, FileText, ArrowRight, Sparkles, Building2, AlertCircle } from 'lucide-react';
import { APPLICATION_DOCUMENTS } from '@/lib/constants';

type University = {
    id: string;
    name: string;
    programs: { id: string; name: string; }[];
};

type MultiStepApplicationProps = {
    universities: University[];
    existingApplication?: any;
    userProfile?: any;
    mode?: 'application' | 'profile';
    trackerOnly?: boolean;
    completionFields?: { name: string; completed: boolean; link: string; }[];
    completionPercentage?: number;
};

const BASE_STEPS = [
    { number: 1, id: 'program', title: 'Program Selection', icon: GraduationCap },
    { number: 2, id: 'personalInfo', title: 'Personal Info', icon: User },
    { number: 3, id: 'familyInfo', title: 'Family Details', icon: Users },
    { number: 4, id: 'academicInfo', title: 'Academic Info', icon: School },
    { number: 5, id: 'activitiesInfo', title: 'Activities', icon: Trophy },
    { number: 6, id: 'documents', title: 'Documents', icon: FileText },
    { number: 7, id: 'review', title: 'Review & Submit', icon: Eye },
];

export default function MultiStepApplication({
    universities,
    existingApplication,
    userProfile,
    mode = 'application',
    trackerOnly = false,
    completionFields = [],
    completionPercentage = 0
}: MultiStepApplicationProps) {
    const router = useRouter();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(!trackerOnly);
    const [showSuccess, setShowSuccess] = useState(false);
    const [saveToProfile, setSaveToProfile] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(existingApplication?.updatedAt ? new Date(existingApplication.updatedAt) : null);

    // Payment State
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [transactionData, setTransactionData] = useState<{
        transactionId: string;
        referenceId: string;
        totalAmount: number;
        currency: string;
        checkoutUrl?: string | null;
    } | null>(null);

    const [activeSteps, setActiveSteps] = useState(
        mode === 'profile'
            ? BASE_STEPS.filter(s => s.id !== 'program').map((s, i) => ({ ...s, number: i + 1 }))
            : BASE_STEPS
    );

    // Form data state
    const [formData, setFormData] = useState({
        // Step 1
        programId: existingApplication?.programId || '',
        referralCode: existingApplication?.referralCode || '',
        // Step 2
        fullName: existingApplication?.personalInfo?.fullName || userProfile?.personalInfo?.fullName || '',
        dateOfBirth: existingApplication?.personalInfo?.dateOfBirth || userProfile?.personalInfo?.dateOfBirth || '',
        nationality: existingApplication?.personalInfo?.nationality || userProfile?.personalInfo?.nationality || '',
        passportNumber: existingApplication?.personalInfo?.passportNumber || userProfile?.personalInfo?.passportNumber || '',
        phone: existingApplication?.personalInfo?.phone || userProfile?.personalInfo?.phone || '',
        address: existingApplication?.personalInfo?.address || userProfile?.personalInfo?.address || '',
        // Step 3
        highestQualification: existingApplication?.academicInfo?.highestQualification || userProfile?.academicInfo?.highestQualification || '',
        institution: existingApplication?.academicInfo?.institution || userProfile?.academicInfo?.institution || '',
        graduationYear: existingApplication?.academicInfo?.graduationYear || userProfile?.academicInfo?.graduationYear || '',
        gpa: existingApplication?.academicInfo?.gpa || userProfile?.academicInfo?.gpa || '',
        testScore: existingApplication?.academicInfo?.testScore || userProfile?.academicInfo?.testScore || '',
        testType: existingApplication?.academicInfo?.testType || userProfile?.academicInfo?.testType || '',
        // High School Specific
        examinationBoard: existingApplication?.academicInfo?.examinationBoard || userProfile?.academicInfo?.examinationBoard || '',
        bestSubjects: existingApplication?.academicInfo?.bestSubjects || userProfile?.academicInfo?.bestSubjects || Array(6).fill({ subject: '', points: '' }),
        // Step 3: Family Info
        fatherName: existingApplication?.familyInfo?.fatherName || userProfile?.familyInfo?.fatherName || '',
        motherName: existingApplication?.familyInfo?.motherName || userProfile?.familyInfo?.motherName || '',
        emergencyContactName: existingApplication?.familyInfo?.emergencyContactName || userProfile?.familyInfo?.emergencyContactName || '',
        emergencyContactPhone: existingApplication?.familyInfo?.emergencyContactPhone || userProfile?.familyInfo?.emergencyContactPhone || '',
        // Step 5: Activities
        extracurriculars: existingApplication?.activitiesInfo?.extracurriculars || userProfile?.activitiesInfo?.extracurriculars || '',
        achievements: existingApplication?.activitiesInfo?.achievements || userProfile?.activitiesInfo?.achievements || '',
    });

    // Dynamic percentage calculation
    const localPercentage = useMemo(() => {
        const sections = [
            {
                completed: !!formData.fullName && !!formData.dateOfBirth && !!formData.nationality && !!formData.passportNumber && !!formData.phone
            },
            {
                completed: !!formData.fatherName && !!formData.emergencyContactPhone
            },
            {
                completed: !!formData.highestQualification && !!formData.institution && !!formData.graduationYear &&
                    (formData.highestQualification === 'high_school'
                        ? !!formData.examinationBoard && formData.bestSubjects.every((s: any) => !!s.subject && !!s.points)
                        : true)
            },
            {
                completed: !!formData.extracurriculars || !!formData.achievements
            }
        ];

        const completedCount = sections.filter(s => s.completed).length;
        // Total percentage: 25% for each of the 4 main info sections
        // We'll leave the documents step as always "complete" for the purpose of the gauge if we want it to reach 100% easily,
        // or just calculate based on these 4. Let's do 4 sections for 100%.
        return Math.round((completedCount / sections.length) * 100);
    }, [formData]);

    const isComplete = localPercentage === 100;

    // Find school requirements based on selected program
    const schoolRequirements = useMemo(() => {
        if (!formData.programId) return null;
        for (const uni of universities) {
            const program = uni.programs.find(p => p.id === formData.programId);
            if (program) {
                return (program as any).school?.applicationRequirements;
            }
        }
        return null;
    }, [formData.programId, universities]);

    // Dynamic steps logic
    useEffect(() => {
        if (trackerOnly) {
            setActiveSteps(BASE_STEPS.filter(s => s.id !== 'program' && s.id !== 'review').map((s, i) => ({ ...s, number: i + 1 })));
            return;
        }

        if (mode === 'profile') {
            setActiveSteps(BASE_STEPS.filter(s => s.id !== 'program').map((s, i) => ({ ...s, number: i + 1 })));
            return;
        }

        if (schoolRequirements) {
            const filteredSteps = BASE_STEPS.filter(step => {
                if (step.id === 'program' || step.id === 'documents' || step.id === 'review') return true;
                return schoolRequirements[step.id] !== false; // Default to true if not explicitly false
            }).map((step, index) => ({ ...step, number: index + 1 }));

            setActiveSteps(filteredSteps);
        } else {
            setActiveSteps(BASE_STEPS);
        }
    }, [schoolRequirements, trackerOnly, mode, formData.programId]);

    const currentStep = activeSteps[currentStepIndex]?.number || 1;
    const currentStepId = activeSteps[currentStepIndex]?.id || 'program';

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateStep = (stepId: string): boolean => {
        const newErrors: Record<string, string> = {};

        if (stepId === 'program') {
            if (!formData.programId) newErrors.programId = 'Please select a program';
        } else if (stepId === 'personalInfo') {
            if (!formData.fullName) newErrors.fullName = 'Full name is required';
            if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
            if (!formData.nationality) newErrors.nationality = 'Nationality is required';
            if (!formData.passportNumber) newErrors.passportNumber = 'Passport number is required';
            if (!formData.phone) newErrors.phone = 'Phone number is required';
        } else if (stepId === 'familyInfo') {
            if (!formData.fatherName) newErrors.fatherName = "Father's name is required";
            if (!formData.emergencyContactPhone) newErrors.emergencyContactPhone = "Emergency contact is required";
        } else if (stepId === 'academicInfo') {
            if (!formData.highestQualification) newErrors.highestQualification = 'Qualification is required';
            if (!formData.institution) newErrors.institution = 'Institution is required';
            if (!formData.graduationYear) newErrors.graduationYear = 'Graduation year is required';
            if (formData.highestQualification === 'high_school') {
                if (!formData.examinationBoard) newErrors.examinationBoard = 'Examination board is required';
                if (formData.bestSubjects.some((s: any) => !s.subject || !s.points)) {
                    newErrors.bestSubjects = 'All 6 subjects and points are required';
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        if (validateStep(currentStepId)) {
            // Force save draft before moving to next step
            await saveDraft(true);
            setCurrentStepIndex(prev => Math.min(prev + 1, activeSteps.length - 1));
        }
    };

    const handleBack = () => {
        setCurrentStepIndex(prev => Math.max(prev - 1, 0));
    };

    const saveDraft = async (showToast = false) => {
        if (!formData.programId) return; // Need at least a program to save a draft record
        
        setIsSaving(true);
        try {
            await saveApplicationDraft({
                programId: formData.programId,
                referralCode: formData.referralCode,
                personalInfo: {
                    fullName: formData.fullName,
                    dateOfBirth: formData.dateOfBirth,
                    nationality: formData.nationality,
                    passportNumber: formData.passportNumber,
                    phone: formData.phone,
                    address: formData.address,
                },
                academicInfo: {
                    highestQualification: formData.highestQualification,
                    institution: formData.institution,
                    graduationYear: formData.graduationYear,
                    gpa: formData.gpa,
                    testScore: formData.testScore,
                    testType: formData.testType,
                    examinationBoard: formData.examinationBoard,
                    bestSubjects: formData.bestSubjects,
                },
                familyInfo: {
                    fatherName: formData.fatherName,
                    motherName: formData.motherName,
                    emergencyContactName: formData.emergencyContactName,
                    emergencyContactPhone: formData.emergencyContactPhone,
                },
                activitiesInfo: {
                    extracurriculars: formData.extracurriculars,
                    achievements: formData.achievements,
                },
                currentStep,
            });
            setLastSaved(new Date());
            if (showToast) toast.success('Progress saved');
        } catch (error) {
            console.error('Failed to save draft:', error);
            if (showToast) toast.error('Failed to save progress');
        } finally {
            setIsSaving(false);
        }
    };

    // Auto-save logic: debounce changes
    useEffect(() => {
        if (trackerOnly || mode === 'profile' || !formData.programId) return;

        const timer = setTimeout(() => {
            saveDraft();
        }, 3000); // 3 seconds debounce

        return () => clearTimeout(timer);
    }, [formData, trackerOnly, mode]);

    const handleSubmit = async () => {
        if (!validateStep(currentStepId)) return;

        setIsSubmitting(true);
        try {
            const result = await submitFullApplication({
                programId: formData.programId,
                referralCode: formData.referralCode,
                personalInfo: {
                    fullName: formData.fullName,
                    dateOfBirth: formData.dateOfBirth,
                    nationality: formData.nationality,
                    passportNumber: formData.passportNumber,
                    phone: formData.phone,
                    address: formData.address,
                },
                academicInfo: {
                    highestQualification: formData.highestQualification,
                    institution: formData.institution,
                    graduationYear: formData.graduationYear,
                    gpa: formData.gpa,
                    testScore: formData.testScore,
                    testType: formData.testType,
                    examinationBoard: formData.examinationBoard,
                    bestSubjects: formData.bestSubjects,
                },
                familyInfo: {
                    fatherName: formData.fatherName,
                    motherName: formData.motherName,
                    emergencyContactName: formData.emergencyContactName,
                    emergencyContactPhone: formData.emergencyContactPhone,
                },
                activitiesInfo: {
                    extracurriculars: formData.extracurriculars,
                    achievements: formData.achievements,
                },
                saveToProfile,
            });

            if (result.success) {
                if (result.requiresPayment) {
                    const payResult = await initiateApplicationPayment(result.applicationId);
                    if (payResult.success && !payResult.noPaymentRequired) {
                        setTransactionData({
                            transactionId: payResult.transactionId!,
                            referenceId: payResult.referenceId!,
                            totalAmount: payResult.totalAmount!,
                            currency: payResult.currency!,
                            checkoutUrl: payResult.checkoutUrl
                        });
                        setIsPaymentModalOpen(true);
                        return;
                    }
                }

                setShowSuccess(true);
                toast.success('Application submitted successfully!');
                setTimeout(() => {
                    router.push('/dashboard/applications');
                }, 3000);
            }
        } catch (error) {
            console.error('Failed to submit application:', error);
            toast.error('Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (showSuccess) {
        return (
            <div className="w-full max-w-2xl mx-auto">
                <Card className="border-2 border-green-200 shadow-xl overflow-hidden">
                    <div className="h-40 relative">
                        <img
                            src="https://images.unsplash.com/photo-1544717297-fa95b35c76d5?auto=format&fit=crop&q=80&w=800"
                            alt="Successful application celebration"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-xl animate-bounce">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                    </div>
                    <CardContent className="pt-8 pb-12 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">
                            Application Submitted Successfully!
                        </h2>
                        <p className="text-lg text-gray-600 mb-6">
                            Your application has been received and is now under review.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                            <h3 className="text-sm font-semibold text-blue-900 mb-2">What's Next?</h3>
                            <ul className="text-sm text-blue-700 space-y-2 text-left">
                                <li>• Your application will be reviewed by our country director</li>
                                <li>• You'll receive email updates on your application status</li>
                                <li>• Review typically takes 2-4 weeks</li>
                                <li>• You can track progress in your applications dashboard</li>
                            </ul>
                        </div>
                        <Button
                            onClick={() => router.push('/dashboard/applications')}
                            className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        >
                            View My Applications
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }


    return (
        <div className="w-full space-y-6">
            {/* Completion Success Section */}
            {trackerOnly && isComplete && !showForm && (
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-indigo-600 via-purple-600 to-blue-700 p-8 text-white shadow-xl animate-in fade-in zoom-in duration-500">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-4 max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                                Profile Complete
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                                Outstanding! Your Profile is <span className="text-yellow-300">100%</span> Ready.
                            </h2>
                            <p className="text-indigo-50 text-base sm:text-lg font-medium">
                                You've done the hard work. Now it's time to find the perfect university and start your applications!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <Link
                                    href="/dashboard/colleges"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-indigo-600 font-bold text-lg shadow-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95 group"
                                >
                                    <Building2 className="w-5 h-5" />
                                    Browse Universities
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Button
                                    onClick={() => setShowForm(true)}
                                    variant="ghost"
                                    className="px-8 py-4 rounded-xl border-2 border-white/30 hover:bg-white/10 text-white font-bold"
                                >
                                    Review My Info
                                </Button>
                            </div>
                        </div>

                        {/* Visual Strength Indicator for Complete State */}
                        <div className="flex flex-col items-center gap-4 bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-inner">
                            <div className="relative w-32 h-32">
                                <svg className="w-32 h-32 transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="58"
                                        stroke="rgba(255,255,255,0.1)"
                                        strokeWidth="8"
                                        fill="none"
                                    />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="58"
                                        stroke="#FBDF12" // Gold/Yellow
                                        strokeWidth="8"
                                        fill="none"
                                        strokeDasharray={2 * Math.PI * 58}
                                        strokeDashoffset={0}
                                        strokeLinecap="round"
                                        className="animate-[dash_2s_ease-out]"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <CheckCircle2 className="w-16 h-16 text-yellow-300" />
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-black">EXCELLENT</div>
                                <div className="text-xs font-bold text-white/60 uppercase tracking-widest">Profile Score</div>
                            </div>
                        </div>
                    </div>

                    {/* Background decorations */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
                </div>
            )}

            {/* Header for Tracker mode */}
            {trackerOnly && (!isComplete || showForm) && (
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-linear-to-r from-indigo-50/50 to-purple-50/50 p-6 rounded-2xl border border-indigo-100/50">
                    <div className="space-y-1">
                        <p className="text-base text-gray-500 max-w-md">
                            Your profile is {localPercentage}% complete. Finish the remaining sections to boost your admission chances.
                        </p>
                    </div>

                    {/* Integrated Profile Strength Meter */}
                    <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-xl border border-indigo-100 shadow-sm self-start md:self-auto">
                        <div className="relative w-14 h-14">
                            <svg className="w-14 h-14 transform -rotate-90">
                                <circle
                                    cx="28"
                                    cy="28"
                                    r="24"
                                    stroke="#f3f4f6"
                                    strokeWidth="5"
                                    fill="none"
                                />
                                <circle
                                    cx="28"
                                    cy="28"
                                    r="24"
                                    stroke={localPercentage >= 100 ? '#10b981' : '#4f46e5'}
                                    strokeWidth="5"
                                    fill="none"
                                    strokeDasharray={2 * Math.PI * 24}
                                    strokeDashoffset={2 * Math.PI * 24 * (1 - localPercentage / 100)}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className={`absolute inset-0 flex items-center justify-center text-base font-bold ${localPercentage >= 100 ? 'text-green-600' : 'text-indigo-600'}`}>
                                {localPercentage}%
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Profile Strength</span>
                            <span className="text-sm font-bold text-gray-900">
                                {localPercentage >= 80 ? 'Excellent' : localPercentage >= 50 ? 'Developing' : 'Getting Started'}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Progress Indicator - Minimal flow style */}
            {(!isComplete || showForm) && (
                <div className={`w-full relative ${trackerOnly ? 'mb-8' : 'bg-white rounded-xl border-2 border-gray-200 p-4 sm:p-6 shadow-sm overflow-x-auto scrollbar-hide'}`}>
                    {/* Optional Fade effects for scrolling */}
                    {trackerOnly && (
                        <>
                            <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-white to-transparent z-10 pointer-events-none opacity-0 sm:opacity-100" />
                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-white to-transparent z-10 pointer-events-none opacity-0 sm:opacity-100" />
                        </>
                    )}

                    <div className={trackerOnly
                        ? "flex items-center justify-between gap-0 overflow-x-auto scrollbar-hide pb-4 px-2"
                        : "flex items-center justify-between gap-4 min-w-[600px] sm:min-w-0"
                    }>
                        {activeSteps.map((step, index) => {
                            const Icon = step.icon;

                            // Determine status based on trackerOnly and completionFields
                            let isActive = currentStep === step.number;
                            let isCompleted = currentStep > step.number;
                            let stepLink = '#';

                            if (trackerOnly) {
                                const field = completionFields.find(f => f.name.toLowerCase().includes(step.title.split(' ')[0].toLowerCase()));
                                isCompleted = !!field?.completed;
                                isActive = (currentStepIndex === index) && showForm;
                                stepLink = field?.link || '/dashboard/student-settings';
                            }

                            const StepContent = (
                                <div className="flex flex-col items-center flex-1 relative min-w-[120px] sm:min-w-[150px]">
                                    {/* Icon and Connector Row */}
                                    <div className="flex items-center w-full mb-3">
                                        {/* Line Before */}
                                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${index === 0 ? 'bg-transparent' :
                                            isCompleted ? 'bg-green-500' : 'bg-gray-200'
                                            }`} />

                                        {/* Icon Button */}
                                        <button
                                            onClick={() => {
                                                if (trackerOnly) {
                                                    setCurrentStepIndex(index);
                                                    setShowForm(true);
                                                }
                                            }}
                                            className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 transform hover:scale-110 active:scale-95 mx-2 ${isCompleted ? 'bg-green-500 border-green-500 hover:bg-green-600 shadow-sm' :
                                                isActive ? 'bg-indigo-600 border-indigo-600 hover:bg-indigo-700 shadow-lg scale-110 z-10' :
                                                    'bg-white border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50'
                                                } ${!isCompleted && !isActive && trackerOnly ? 'animate-pulse' : ''}`}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                            ) : (
                                                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                            )}
                                        </button>

                                        {/* Line After */}
                                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${index === activeSteps.length - 1 ? 'bg-transparent' :
                                            (isCompleted && (index + 1 < activeSteps.length)) ? 'bg-green-500' : 'bg-gray-200'
                                            }`} />
                                    </div>

                                    {/* Label */}
                                    <span className={`text-[11px] sm:text-xs font-semibold text-center leading-tight transition-colors px-1 whitespace-nowrap uppercase tracking-wider ${isActive ? 'text-indigo-600 scale-105' :
                                        isCompleted ? 'text-green-600' : 'text-gray-500'
                                        }`}>
                                        {step.title}
                                    </span>
                                </div>
                            );

                            return (
                                <div
                                    key={step.id}
                                    className={`${trackerOnly ? 'flex-shrink-0' : 'flex-1'}`}
                                    style={trackerOnly ? { flex: '1 0 120px' } : undefined}
                                >
                                    {StepContent}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Step Content - Visible if not trackerOnly or if showForm is true */}
            {(showForm || !trackerOnly) && (
                <Card className="shadow-lg border-2 border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
                    <CardHeader className="space-y-3 pb-6 flex flex-row items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                {(() => {
                                    const Icon = activeSteps[currentStepIndex].icon;
                                    return <Icon className="w-6 h-6 text-white" />;
                                })()}
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-2xl">Step {currentStep}: {activeSteps[currentStepIndex].title}</CardTitle>
                                    {!trackerOnly && mode === 'application' && (
                                        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                            isSaving ? 'bg-amber-50 text-amber-600 animate-pulse' : 'bg-green-50 text-green-600'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${isSaving ? 'bg-amber-500 animate-ping' : 'bg-green-500'}`} />
                                            {isSaving ? 'Saving...' : lastSaved ? `Saved` : 'Ready'}
                                        </div>
                                    )}
                                </div>
                                <CardDescription className="text-base text-gray-500">
                                    {currentStepId === 'program' && 'Select the program you wish to apply for'}
                                    {currentStepId === 'personalInfo' && 'Provide your personal details'}
                                    {currentStepId === 'familyInfo' && 'Tell us about your family and emergency contacts'}
                                    {currentStepId === 'academicInfo' && 'Tell us about your academic background'}
                                    {currentStepId === 'activitiesInfo' && 'Tell us about your extracurriculars and achievements'}
                                    {currentStepId === 'documents' && 'Review required documents'}
                                    {currentStepId === 'review' && 'Review your details before saving'}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            {existingApplication?.expiresAt && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-xl border border-red-100 animate-in fade-in slide-in-from-right-4">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        Draft expires in {Math.ceil((new Date(existingApplication.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                                    </span>
                                </div>
                            )}
                            {trackerOnly && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowForm(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    Hide Form
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Step Content based on currentStepId */}
                        {currentStepId === 'program' && (
                            <>
                                <div className="space-y-3">
                                    <Label htmlFor="programId" className="text-base font-semibold text-gray-900">
                                        Select Program <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.programId}
                                        onValueChange={(value) => setFormData({ ...formData, programId: value })}
                                    >
                                        <SelectTrigger className="h-12 text-base border-2">
                                            <SelectValue placeholder="Choose a program from the list" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {universities.map((uni) => (
                                                <SelectGroup key={uni.id}>
                                                    <SelectLabel className="text-sm font-semibold text-indigo-600">{uni.name}</SelectLabel>
                                                    {uni.programs.map((prog) => (
                                                        <SelectItem key={prog.id} value={prog.id} className="text-base py-3">
                                                            {prog.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.programId && <p className="text-sm text-red-600">{errors.programId}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="referralCode" className="text-base font-semibold text-gray-900">
                                        Referral Code (Optional)
                                    </Label>
                                    <Input
                                        id="referralCode"
                                        value={formData.referralCode}
                                        onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                                        placeholder="Enter referral code if you have one"
                                        className="h-12 text-base border-2"
                                    />
                                </div>
                            </>
                        )}

                        {/* Step Content: Personal Information */}
                        {currentStepId === 'personalInfo' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Full Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="h-12 border-2"
                                    />
                                    {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Date of Birth <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                        className="h-12 border-2"
                                    />
                                    {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Nationality <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={formData.nationality}
                                        onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                                        className="h-12 border-2"
                                    />
                                    {errors.nationality && <p className="text-sm text-red-600">{errors.nationality}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Passport Number <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={formData.passportNumber}
                                        onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                                        className="h-12 border-2"
                                    />
                                    {errors.passportNumber && <p className="text-sm text-red-600">{errors.passportNumber}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Phone Number <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="h-12 border-2"
                                    />
                                    {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                                </div>

                                <div className="space-y-3 md:col-span-2">
                                    <Label className="text-base font-semibold">Address</Label>
                                    <Input
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="h-12 border-2"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step Content: Family Information */}
                        {currentStepId === 'familyInfo' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Father's Full Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={formData.fatherName}
                                        onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                                        className="h-12 border-2"
                                    />
                                    {errors.fatherName && <p className="text-sm text-red-600">{errors.fatherName}</p>}
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Mother's Full Name</Label>
                                    <Input
                                        value={formData.motherName}
                                        onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                                        className="h-12 border-2"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Emergency Contact Name</Label>
                                    <Input
                                        value={formData.emergencyContactName}
                                        onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                                        className="h-12 border-2"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Emergency Contact Phone <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="tel"
                                        value={formData.emergencyContactPhone}
                                        onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                                        className="h-12 border-2"
                                    />
                                    {errors.emergencyContactPhone && <p className="text-sm text-red-600">{errors.emergencyContactPhone}</p>}
                                </div>
                            </div>
                        )}

                        {/* Step Content: Academic Background */}
                        {currentStepId === 'academicInfo' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Highest Qualification <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={formData.highestQualification}
                                        onValueChange={(value) => setFormData({ ...formData, highestQualification: value })}
                                    >
                                        <SelectTrigger className="h-12 border-2">
                                            <SelectValue placeholder="Select qualification" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="high_school">High School</SelectItem>
                                            <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                                            <SelectItem value="masters">Master's Degree</SelectItem>
                                            <SelectItem value="phd">PhD</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.highestQualification && <p className="text-sm text-red-600">{errors.highestQualification}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Institution <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={formData.institution}
                                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                        className="h-12 border-2"
                                    />
                                    {errors.institution && <p className="text-sm text-red-600">{errors.institution}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Graduation Year <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="number"
                                        value={formData.graduationYear}
                                        onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                                        className="h-12 border-2"
                                        min="1950"
                                        max="2030"
                                    />
                                    {errors.graduationYear && <p className="text-sm text-red-600">{errors.graduationYear}</p>}
                                </div>

                                {formData.highestQualification !== 'high_school' && (
                                    <>
                                        <div className="space-y-3">
                                            <Label className="text-base font-semibold">GPA / Percentage</Label>
                                            <Input
                                                value={formData.gpa}
                                                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                                                className="h-12 border-2"
                                                placeholder="e.g., 3.8 or 85%"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-base font-semibold">Test Type</Label>
                                            <Select
                                                value={formData.testType}
                                                onValueChange={(value) => setFormData({ ...formData, testType: value })}
                                            >
                                                <SelectTrigger className="h-12 border-2">
                                                    <SelectValue placeholder="Select test" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">None</SelectItem>
                                                    <SelectItem value="toefl">TOEFL</SelectItem>
                                                    <SelectItem value="ielts">IELTS</SelectItem>
                                                    <SelectItem value="gre">GRE</SelectItem>
                                                    <SelectItem value="gmat">GMAT</SelectItem>
                                                    <SelectItem value="sat">SAT</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-base font-semibold">Test Score</Label>
                                            <Input
                                                value={formData.testScore}
                                                onChange={(e) => setFormData({ ...formData, testScore: e.target.value })}
                                                className="h-12 border-2"
                                                placeholder="Enter score"
                                            />
                                        </div>
                                    </>
                                )}

                                {formData.highestQualification === 'high_school' && (
                                    <div className="md:col-span-2 space-y-6 pt-6 border-t border-gray-100">
                                        <div className="space-y-3">
                                            <Label className="text-base font-semibold">Examination Board <span className="text-red-500">*</span></Label>
                                            <Select
                                                value={formData.examinationBoard}
                                                onValueChange={(value) => setFormData({ ...formData, examinationBoard: value })}
                                            >
                                                <SelectTrigger className="h-12 border-2">
                                                    <SelectValue placeholder="Select examination board" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="MSCE">MSCE (Malawi School Certificate of Education)</SelectItem>
                                                    <SelectItem value="IGSCE">IGSCE (International General Certificate of Secondary Education)</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.examinationBoard && <p className="text-sm text-red-600">{errors.examinationBoard}</p>}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-base font-semibold">Best Six Subjects <span className="text-red-500">*</span></Label>
                                                <span className="text-xs text-gray-500 font-medium">Please list your 6 strongest subjects</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-xl border-2 border-dashed border-gray-200">
                                                {formData.bestSubjects.map((subject: any, index: number) => (
                                                    <div key={index} className="flex gap-2">
                                                        <div className="flex-1">
                                                            <Input
                                                                placeholder={`Subject ${index + 1}`}
                                                                value={subject.subject}
                                                                onChange={(e) => {
                                                                    const newSubjects = [...formData.bestSubjects];
                                                                    newSubjects[index] = { ...newSubjects[index], subject: e.target.value };
                                                                    setFormData({ ...formData, bestSubjects: newSubjects });
                                                                }}
                                                                className="h-10 border-gray-300"
                                                            />
                                                        </div>
                                                        <div className="w-24">
                                                            <Input
                                                                placeholder="Points"
                                                                value={subject.points}
                                                                onChange={(e) => {
                                                                    const newSubjects = [...formData.bestSubjects];
                                                                    newSubjects[index] = { ...newSubjects[index], points: e.target.value };
                                                                    setFormData({ ...formData, bestSubjects: newSubjects });
                                                                }}
                                                                className="h-10 border-gray-300"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {errors.bestSubjects && <p className="text-sm text-red-600">{errors.bestSubjects}</p>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step Content: Activities & Achievements */}
                        {currentStepId === 'activitiesInfo' && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Extracurricular Activities</Label>
                                    <Input
                                        value={formData.extracurriculars}
                                        onChange={(e) => setFormData({ ...formData, extracurriculars: e.target.value })}
                                        placeholder="e.g., Sports, Music, Clubs"
                                        className="h-12 border-2"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Achievements & Awards</Label>
                                    <Input
                                        value={formData.achievements}
                                        onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                                        placeholder="e.g., First place in Science Fair"
                                        className="h-12 border-2"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step Content: Documents */}
                        {currentStepId === 'documents' && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Required Documents</h3>
                                    <ul className="text-sm text-blue-700 space-y-2">
                                        {schoolRequirements?.requiredDocuments?.length > 0 ? (
                                            schoolRequirements.requiredDocuments.map((docValue: string) => {
                                                const doc = APPLICATION_DOCUMENTS.find(d => d.value === docValue);
                                                return <li key={docValue}>• {doc?.label || docValue.replace(/_/g, ' ')}</li>;
                                            })
                                        ) : (
                                            <>
                                                <li>• Passport copy (clear, readable)</li>
                                                <li>• Academic transcripts</li>
                                                <li>• English proficiency test scores (if applicable)</li>
                                                <li>• Letters of recommendation</li>
                                                <li>• Statement of purpose</li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                                <p className="text-sm text-gray-600">
                                    You can upload documents after submitting your application from the application details page.
                                </p>
                            </div>
                        )}

                        {/* Step Content: Review */}
                        {currentStepId === 'review' && (
                            <div className="space-y-6">
                                <div className="bg-linear-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Application</h3>

                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">{mode === 'profile' ? 'Profile Summary' : 'Program'}</h4>
                                        <p className="text-sm text-gray-600">
                                            {mode === 'profile'
                                                ? 'Review your details to complete your profile.'
                                                : (universities.flatMap(u => u.programs).find(p => p.id === formData.programId)?.name || 'Not selected')}
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Personal Information</h4>
                                                <div className="space-y-1 text-sm text-gray-600">
                                                    <div>Name: {formData.fullName}</div>
                                                    <div>DOB: {formData.dateOfBirth}</div>
                                                    <div>Nationality: {formData.nationality}</div>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Family Information</h4>
                                                <div className="space-y-1 text-sm text-gray-600">
                                                    <div>Father: {formData.fatherName}</div>
                                                    <div>Mother: {formData.motherName || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Academic Background</h4>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
                                                <div>Qualification: <span className="font-medium text-gray-900">{formData.highestQualification}</span></div>
                                                <div>Institution: <span className="font-medium text-gray-900">{formData.institution}</span></div>
                                                <div>Year: <span className="font-medium text-gray-900">{formData.graduationYear}</span></div>

                                                {formData.highestQualification !== 'high_school' ? (
                                                    <div>GPA: <span className="font-medium text-gray-900">{formData.gpa || 'N/A'}</span></div>
                                                ) : (
                                                    <div className="col-span-2 pt-2 border-t mt-2">
                                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Exams & Subjects</div>
                                                        <div>Board: <span className="font-medium text-gray-900">{formData.examinationBoard}</span></div>
                                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                                            {formData.bestSubjects.map((s: any, i: number) => (
                                                                <div key={i} className="flex justify-between bg-white px-2 py-1 rounded border text-[11px]">
                                                                    <span className="truncate mr-2">{s.subject || `Subject ${i + 1}`}</span>
                                                                    <span className="font-bold text-indigo-600">{s.points || '-'} pts</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 pt-4 border-t border-indigo-100 mt-4">
                                        <input
                                            type="checkbox"
                                            id="saveToProfile"
                                            checked={saveToProfile}
                                            onChange={(e) => setSaveToProfile(e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                        <Label htmlFor="saveToProfile" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                                            Update my profile with this information for future applications
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-6 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleBack}
                                disabled={currentStepIndex === 0}
                                className="px-6"
                            >
                                Back
                            </Button>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => saveDraft()}
                                    className="px-6"
                                >
                                    Save Draft
                                </Button>

                                {currentStepIndex < activeSteps.length - 1 ? (
                                    <Button
                                        type="button"
                                        onClick={handleNext}
                                        className="px-6 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="px-6 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                    >
                                        {isSubmitting ? 'Saving...' : (mode === 'profile' ? 'Save Profile' : 'Submit Application')}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {transactionData && (
                <PaymentCheckoutModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    transactionData={transactionData}
                    onSuccess={() => {
                        setShowSuccess(true);
                        toast.success('Payment confirmed & Application submitted!');
                    }}
                />
            )}
        </div>
    );
}
