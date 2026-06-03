

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    User,
    FileText,
    GraduationCap,
    Upload,
    Sparkles,
    Settings,
    Users,
    Trophy,
    AlertCircle,
    Clock,
    CheckCircle2,
    Save
} from 'lucide-react';
import { toast } from 'sonner';

import ProgramSelection from './ProgramSelection';
import PersonalInfoForm from './PersonalInfoForm';
import FamilyInfoForm from './FamilyInfoForm';
import ActivitiesInfoForm from './ActivitiesInfoForm';
import AcademicInfoForm from './AcademicInfoForm';
import FinancialInfoForm from './FinancialInfoForm';
import WorkExperienceForm from './WorkExperienceForm';
import DocumentsManager from './DocumentsManager';

type Tab = 'program' | 'profile' | 'family' | 'academic' | 'activities' | 'financial' | 'experience' | 'documents' | 'account';

import { useSearchParams } from 'next/navigation';
import { submitFullApplication, saveApplicationDraft } from '@/lib/actions/applications';

interface SettingsTabsProps {
    user: any;
    universities?: any[];
    countries?: any[];
}

export default function SettingsTabs({ user, universities = [], countries = [] }: SettingsTabsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialProgramId = searchParams.get('programId') || '';

    const [activeTab, setActiveTab] = useState<Tab>('program');
    const [selectedProgramId, setSelectedProgramId] = useState(initialProgramId);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialProgramId && initialProgramId !== selectedProgramId) {
            setSelectedProgramId(initialProgramId);
        }
    }, [initialProgramId]);

    // Auto-save draft logic
    const saveDraftProgress = async (programId: string) => {
        if (!programId) return;

        try {
            await saveApplicationDraft({
                programId,
                personalInfo: user.personalInfo,
                academicInfo: user.academicInfo,
                familyInfo: user.familyInfo,
                activitiesInfo: user.activitiesInfo,
                financialInfo: user.financialInfo,
                workExperience: user.workExperience,
            });
            console.log('Draft auto-saved');
        } catch (error) {
            console.error('Failed to auto-save draft:', error);
        }
    };

    useEffect(() => {
        if (selectedProgramId && user.role === 'PROSPECT') {
            saveDraftProgress(selectedProgramId);
        }
    }, [selectedProgramId, user.role]);

    const selectedUniversity = universities.find(u =>
        u.programs.some((p: any) => p.id === selectedProgramId)
    );

    const requirements = (selectedUniversity?.applicationRequirements as any) || {
        personalInfo: true,
        academicInfo: true,
        familyInfo: true,
        activitiesInfo: true,
        financialInfo: true,
        workExperience: true,
        requiredDocuments: ['passport', 'high_school_transcript']
    };

    const isWithinWindow = () => {
        if (!selectedUniversity) return { open: true };
        const now = new Date();
        const open = selectedUniversity.applicationOpenDate ? new Date(selectedUniversity.applicationOpenDate) : null;
        const close = selectedUniversity.applicationCloseDate ? new Date(selectedUniversity.applicationCloseDate) : null;

        if (open && now < open) {
            return {
                open: false,
                message: `Applications for ${selectedUniversity.name} will open on ${open.toLocaleDateString()}.`,
                type: 'future'
            };
        }
        if (close && now > close) {
            return {
                open: false,
                message: `Applications for ${selectedUniversity.name} closed on ${close.toLocaleDateString()}.`,
                type: 'expired'
            };
        }
        return { open: true };
    };

    const windowStatus = isWithinWindow();

    const allTabs = [
        { id: 'program' as Tab, label: '1. Program', icon: GraduationCap, key: 'always' },
        { id: 'profile' as Tab, label: '2. Profile', icon: FileText, key: 'personalInfo' },
        { id: 'family' as Tab, label: '3. Family', icon: Users, key: 'familyInfo' },
        { id: 'academic' as Tab, label: '4. Academic', icon: GraduationCap, key: 'academicInfo' },
        { id: 'activities' as Tab, label: '5. Activities', icon: Trophy, key: 'activitiesInfo' },
        { id: 'financial' as Tab, label: '6. Financial', icon: FileText, key: 'financialInfo' },
        { id: 'experience' as Tab, label: '7. Experience', icon: FileText, key: 'workExperience' },
        { id: 'documents' as Tab, label: '8. Documents', icon: Upload, key: 'always' },
    ];

    const tabs = allTabs.filter(tab =>
        tab.key === 'always' || (requirements as any)[tab.key] !== false
    ).map((tab, index) => ({
        ...tab,
        label: `${index + 1}. ${tab.label.split('. ')[1]}`
    }));

    const handleSubmitApplication = async () => {
        if (!selectedProgramId) return;
        if (user.role !== 'PROSPECT') {
            toast.error('Only students can submit applications.');
            return;
        }
        setIsSubmitting(true);
        try {
            const result = await submitFullApplication({
                programId: selectedProgramId,
                personalInfo: user.personalInfo,
                familyInfo: user.familyInfo,
                academicInfo: user.academicInfo,
                activitiesInfo: user.activitiesInfo,
                financialInfo: user.financialInfo,
                workExperience: user.workExperience,
                saveToProfile: false,
            });

            if (result.success) {
                toast.success('Application submitted successfully!');
                router.push('/dashboard/applications');
            } else {
                toast.error('Failed to submit application. Please try again.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('An unexpected error occurred during submission.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = () => {
        const currentIndex = tabs.findIndex(t => t.id === activeTab);
        if (currentIndex < tabs.length - 1) {
            // Save draft before moving to next tab
            if (selectedProgramId && user.role === 'PROSPECT') {
                saveDraftProgress(selectedProgramId);
            }
            setActiveTab(tabs[currentIndex + 1].id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="space-y-6">
            {!windowStatus.open && selectedProgramId && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-800 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold">Application Window Closed</p>
                        <p className="text-xs font-medium opacity-80">{windowStatus.message}</p>
                    </div>
                </div>
            )}

            {/* Mobile Responsive Tab Scroll Navigation */}
            <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex w-full overflow-x-auto scrollbar-hide border-b border-gray-100 snap-x snap-mandatory">
                    {tabs.map((tab, idx) => {
                        const Icon = tab.icon;
                        const currentIndex = tabs.findIndex(t => t.id === activeTab);
                        const isActive = activeTab === tab.id;
                        const isCompleted = currentIndex > idx;
                        const isDisabled = !isCompleted && !isActive;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    if (!isDisabled) {
                                        setActiveTab(tab.id);
                                    }
                                }}
                                disabled={isDisabled}
                                className={`flex items-center gap-2 px-5 py-4 text-sm font-bold tracking-tight whitespace-nowrap transition-all border-b-[3px] snap-center shrink-0
                                    ${isActive
                                        ? 'border-brand-accent text-brand-accent bg-brand-accent/5'
                                        : isCompleted
                                            ? 'border-brand-accent text-brand-accent hover:bg-brand-accent/5'
                                            : 'border-transparent text-gray-300 cursor-not-allowed'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive || isCompleted ? 'text-brand-accent' : 'text-gray-300'}`} />
                                {tab.label.split('. ')[1]}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content Panel */}
                <div className="min-h-[500px]">
                    {activeTab === 'program' && (
                        <ProgramSelection
                            universities={universities}
                            selectedProgramId={selectedProgramId}
                            onProgramChange={setSelectedProgramId}
                            onNext={handleNext}
                        />
                    )}
                    {activeTab === 'profile' && <PersonalInfoForm user={user} onNext={handleNext} countries={countries} />}
                    {activeTab === 'family' && <FamilyInfoForm user={user} onNext={handleNext} />}
                    {activeTab === 'academic' && <AcademicInfoForm user={user} onNext={handleNext} />}
                    {activeTab === 'activities' && <ActivitiesInfoForm user={user} onNext={handleNext} />}
                    {activeTab === 'financial' && <FinancialInfoForm user={user} onNext={handleNext} />}
                    {activeTab === 'experience' && <WorkExperienceForm user={user} onNext={handleNext} />}
                    {activeTab === 'documents' && (
                        <div className="divide-y divide-gray-100">
                            <DocumentsManager user={user} requiredDocuments={requirements?.requiredDocuments} />

                            {/* Final Submission Section - Only in Documents Tab */}
                            {selectedProgramId && (
                                <div className="p-6 bg-linear-to-br from-[#1a1b41]/5 to-brand-accent/5 border-t-2 border-brand-accent/20">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="w-12 h-12 rounded-full bg-brand-accent flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse">
                                                <Sparkles className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-bold text-[#1a1b41]">Final Step: Submit Your Application</h3>
                                                <p className="text-sm text-[#1a1b41]/70 max-w-md">
                                                    You&apos;ve provided all your details. Review your information one last time and submit your application to get started.
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleSubmitApplication}
                                            disabled={isSubmitting || !windowStatus.open}
                                            className="w-full md:w-auto px-10 py-4 bg-linear-to-r from-brand-accent to-[#b89531] text-white rounded-xl font-black text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none min-w-[200px]"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Submitting...
                                                </span>
                                            ) : (
                                                'Submit Final Application'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
