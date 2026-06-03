'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Ban, Trash2, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { updateUserStatus, deleteUser } from '@/lib/actions/admin-users';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { UserStatus } from '@prisma/client';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function UserManagementActions({ userId, currentStatus, userName }: { userId: string, currentStatus: UserStatus, userName: string }) {
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    const handleStatusUpdate = async () => {
        const nextStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
        setLoading('status');
        try {
            const result = await updateUserStatus(userId, nextStatus as UserStatus);
            if (result.success) {
                toast.success(`User successfully ${nextStatus === 'BLOCKED' ? 'blocked' : 'activated'}`);
                router.refresh();
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('Operation failed');
        } finally {
            setLoading(null);
        }
    };

    const handleDelete = async () => {
        setLoading('delete');
        try {
            const result = await deleteUser(userId);
            if (result.success) {
                toast.success('User profile permanently purged');
                router.push('/dashboard/admin/users');
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('Deletion failed');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <Button
                variant="outline"
                onClick={handleStatusUpdate}
                disabled={!!loading}
                className={`h-12 px-6 rounded-2xl font-bold flex gap-2 transition-all border-2
                    ${currentStatus === 'ACTIVE'
                        ? 'text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200'
                        : 'text-emerald-600 border-emerald-100 hover:bg-emerald-50 hover:border-emerald-200'}`}
            >
                {loading === 'status' ? <Loader2 className="w-4 h-4 animate-spin" /> :
                    currentStatus === 'ACTIVE' ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                {currentStatus === 'ACTIVE' ? 'Restrict Access' : 'Restore Access'}
            </Button>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="ghost"
                        disabled={!!loading}
                        className="h-12 w-12 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-700 transition-all"
                    >
                        {loading === 'delete' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl p-10">
                    <AlertDialogHeader>
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-black text-brand-primary">Terminate User Identity?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-500 font-medium text-base mt-2">
                            This action is final. All data associated with <span className="text-brand-primary font-black">{userName}</span> will be permanently purged from the platform registry.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 gap-3">
                        <AlertDialogCancel className="h-14 px-8 rounded-2xl font-bold border-gray-100 hover:bg-gray-50">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="h-14 px-8 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs"
                        >
                            Purge Records
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
