'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteUser } from '@/lib/actions/admin-users';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function DeleteUserButton({ userId, userName }: { userId: string; userName: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!confirm(`Are you sure you want to permanently delete "${userName}"? This action cannot be undone.`)) {
            return;
        }

        startTransition(async () => {
            const result = await deleteUser(userId);
            if (result?.success) {
                toast.success(`User "${userName}" has been deleted.`);
            } else {
                toast.error(result?.error || 'Failed to delete user.');
            }
        });
    };

    return (
        <Button
            size="icon"
            variant="ghost"
            onClick={handleDelete}
            disabled={isPending}
            title={`Delete ${userName}`}
            className="h-10 w-10 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-50"
        >
            <Trash2 className="w-5 h-5" />
        </Button>
    );
}
