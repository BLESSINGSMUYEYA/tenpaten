'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { switchActiveSchool } from '@/lib/actions/super-agent';
import { toast } from 'sonner';

interface ManageSchoolButtonProps {
    schoolId: string;
    schoolName: string;
}

export default function ManageSchoolButton({ schoolId, schoolName }: ManageSchoolButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleManage = async () => {
        setIsLoading(true);
        try {
            const res = await switchActiveSchool(schoolId);
            if (res?.success) {
                toast.success(`Switched active school to ${schoolName}`);
                router.push('/dashboard/school');
                // Force router refresh to load the new context fully
                router.refresh();
            } else {
                toast.error('Failed to switch context');
            }
        } catch (err: any) {
            toast.error(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleManage}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Loading
                </>
            ) : (
                <>
                    Manage School
                    <ArrowRight className="w-3.5 h-3.5" />
                </>
            )}
        </button>
    );
}
