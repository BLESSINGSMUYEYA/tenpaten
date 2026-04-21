'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, FileText, Users, GraduationCap, Trophy, Upload } from 'lucide-react';

import AccountSettingsForm from './AccountSettingsForm';
import PersonalInfoForm from './PersonalInfoForm';
import FamilyInfoForm from './FamilyInfoForm';
import AcademicInfoForm from './AcademicInfoForm';
import ActivitiesInfoForm from './ActivitiesInfoForm';
import FinancialInfoForm from './FinancialInfoForm';
import WorkExperienceForm from './WorkExperienceForm';
import DocumentsManager from './DocumentsManager';

type TabType = 'account' | 'personal' | 'family' | 'academic' | 'activities' | 'financial' | 'experience' | 'documents';

interface StudentSettingsTabsProps {
    user: any;
    countries?: any[];
}

export default function StudentSettingsTabs({ user, countries = [] }: StudentSettingsTabsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Check URL params for active tab, default to 'account'
    const initialTab = (searchParams.get('tab') as TabType) || 'account';
    
    // State to hold active tab safely
    const [activeTab, setActiveTab] = useState<TabType>(initialTab);

    // Sync state if URL changes (like when clicking sidebar links again) WITHOUT useEffect
    const [prevSearchParams, setPrevSearchParams] = useState(searchParams);
    if (searchParams !== prevSearchParams) {
        setPrevSearchParams(searchParams);
        const tabParam = searchParams.get('tab') as TabType;
        if (tabParam && ['account', 'personal', 'family', 'academic', 'activities', 'financial', 'experience', 'documents'].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }

    // Handle tab change
    const handleTabChange = (tabId: TabType) => {
        setActiveTab(tabId);
        // Shallow push to URL to keep the back button / active state working, but no layout shift
        router.push(`/dashboard/student-settings?tab=${tabId}`, { scroll: false });
    };

    const tabs = [
        { id: 'account' as TabType, label: 'Account', icon: User },
        { id: 'personal' as TabType, label: 'Personal', icon: FileText },
        { id: 'family' as TabType, label: 'Family', icon: Users },
        { id: 'academic' as TabType, label: 'Academic', icon: GraduationCap },
        { id: 'activities' as TabType, label: 'Activities', icon: Trophy },
        { id: 'financial' as TabType, label: 'Financial', icon: FileText },
        { id: 'experience' as TabType, label: 'Experience', icon: FileText },
        { id: 'documents' as TabType, label: 'Documents', icon: Upload },
    ];

    return (
        <div className="space-y-6">
            {/* Mobile Responsive Tab Scroll Container */}
            <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex w-full overflow-x-auto scrollbar-hide border-b border-gray-100 snap-x snap-mandatory">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex items-center gap-2 px-5 py-4 text-sm font-bold tracking-tight whitespace-nowrap transition-all border-b-[3px] snap-center shrink-0
                                    ${isActive
                                        ? 'border-[#d5a22d] text-[#d5a22d] bg-[#d5a22d]/5'
                                        : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-[#d5a22d]' : 'text-gray-400'}`} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content Panel */}
                <div className="min-h-[500px]">
                    {activeTab === 'account' && <AccountSettingsForm user={user} />}
                    {activeTab === 'personal' && <PersonalInfoForm user={user} countries={countries} />}
                    {activeTab === 'family' && <FamilyInfoForm user={user} />}
                    {activeTab === 'academic' && <AcademicInfoForm user={user} />}
                    {activeTab === 'activities' && <ActivitiesInfoForm user={user} />}
                    {activeTab === 'financial' && <FinancialInfoForm user={user} />}
                    {activeTab === 'experience' && <WorkExperienceForm user={user} />}
                    {activeTab === 'documents' && <DocumentsManager user={user} />}
                </div>
            </div>
        </div>
    );
}
