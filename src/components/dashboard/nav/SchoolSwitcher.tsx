'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, School, Check } from 'lucide-react';
import { switchActiveSchool } from '@/lib/actions/super-agent';
import { toast } from 'sonner';

interface SchoolSwitcherProps {
    assignedSchools: {
        id: string;
        name: string;
        logo: string | null;
        slug: string | null;
    }[];
    activeSchoolId: string | null;
}

export default function SchoolSwitcher({ assignedSchools, activeSchoolId }: SchoolSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const activeSchool = assignedSchools.find(s => s.id === activeSchoolId) || assignedSchools[0];

    const handleSwitch = async (schoolId: string) => {
        if (schoolId === activeSchoolId) {
            setIsOpen(false);
            return;
        }

        setIsPending(true);
        try {
            const res = await switchActiveSchool(schoolId);
            if (res?.success) {
                toast.success(`Switched context to ${assignedSchools.find(s => s.id === schoolId)?.name}`);
                setIsOpen(false);
                // Hard reload is best to clear caches and let layout re-render with new cookies
                window.location.reload();
            } else {
                toast.error('Failed to switch school context.');
            }
        } catch (err: any) {
            toast.error(err.message || 'An error occurred.');
        } finally {
            setIsPending(false);
        }
    };

    if (assignedSchools.length === 0) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 text-white/50 text-xs bg-white/5 rounded-lg border border-dashed border-white/10">
                <School className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>No schools assigned</span>
            </div>
        );
    }

    return (
        <div className="relative w-full">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending}
                className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all text-left border border-white/10 disabled:opacity-50"
            >
                <div className="flex items-center gap-2 min-w-0">
                    {activeSchool?.logo ? (
                        <img
                            src={activeSchool.logo}
                            alt={activeSchool.name}
                            className="w-6 h-6 rounded-md object-contain bg-white p-0.5 flex-shrink-0"
                        />
                    ) : (
                        <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0">
                            <School className="w-3.5 h-3.5 text-white/60" />
                        </div>
                    )}
                    <span className="font-semibold text-sm truncate">{activeSchool?.name || 'Select School'}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop to close click */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    
                    <div className="absolute left-0 right-0 mt-2 z-50 rounded-lg bg-[#27244f] border border-white/10 shadow-xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
                        <div className="py-1">
                            {assignedSchools.map((school) => {
                                const isSelected = school.id === activeSchool?.id;
                                return (
                                    <button
                                        key={school.id}
                                        type="button"
                                        onClick={() => handleSwitch(school.id)}
                                        className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-white/5 transition-colors ${
                                            isSelected ? 'text-brand-accent bg-white/5 font-semibold' : 'text-white/80'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            {school.logo ? (
                                                <img
                                                    src={school.logo}
                                                    alt={school.name}
                                                    className="w-5 h-5 rounded object-contain bg-white p-0.5 flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center flex-shrink-0">
                                                    <School className="w-3.5 h-3.5 text-white/40" />
                                                </div>
                                            )}
                                            <span className="truncate">{school.name}</span>
                                        </div>
                                        {isSelected && <Check className="w-4 h-4 text-brand-accent" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
