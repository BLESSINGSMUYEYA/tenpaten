'use client';

import { useState } from 'react';
import { User as UserIcon, Lock, Shield, Settings } from 'lucide-react';
import ProfileForm from '@/components/settings/profile-form';
import PasswordForm from '@/components/settings/password-form';
import { User } from '@prisma/client';

export default function SettingsClient({ user }: { user: User }) {
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#36335e] tracking-tight">Settings</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">
                        Manage your personal profile details and account security preferences.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#36335e] rounded-xl text-white text-sm font-bold shadow-lg shadow-[#36335e]/20">
                    <Settings className="w-4 h-4 text-[#d5a22d]" />
                    <span>Account Management</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                {/* Sidebar Tabs */}
                <div className="w-full md:w-72 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100 p-6 space-y-3">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'profile'
                            ? 'bg-white text-[#36335e] shadow-sm border border-gray-200'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-white/60 border border-transparent'
                            }`}
                    >
                        <div className={`p-2 rounded-lg ${activeTab === 'profile' ? 'bg-[#36335e]/10 text-[#36335e]' : 'bg-gray-100 text-gray-400'}`}>
                            <UserIcon className="w-4 h-4" />
                        </div>
                        Profile Details
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'security'
                            ? 'bg-white text-[#36335e] shadow-sm border border-gray-200'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-white/60 border border-transparent'
                            }`}
                    >
                        <div className={`p-2 rounded-lg ${activeTab === 'security' ? 'bg-[#36335e]/10 text-[#36335e]' : 'bg-gray-100 text-gray-400'}`}>
                            <Shield className="w-4 h-4" />
                        </div>
                        Security
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8 md:p-12 bg-white">
                    {activeTab === 'profile' && (
                        <div className="max-w-2xl space-y-8 animate-in slide-in-from-right-4 duration-500 fade-in">
                            <div>
                                <h2 className="text-xl font-black text-[#36335e] tracking-tight mb-2">Personal Information</h2>
                                <p className="text-sm text-gray-500 font-medium">Update your name and contact information.</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <ProfileForm user={user} theme="school" />
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="max-w-2xl space-y-8 animate-in slide-in-from-right-4 duration-500 fade-in">
                            <div>
                                <h2 className="text-xl font-black text-[#36335e] tracking-tight mb-2">Security Settings</h2>
                                <p className="text-sm text-gray-500 font-medium">Ensure your account stays safe with a strong password.</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <PasswordForm theme="school" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
