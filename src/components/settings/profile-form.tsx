'use client';

import { useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { updateProfile } from '@/lib/actions';
import { toast } from 'sonner';

export default function ProfileForm({ user, theme = 'student' }: { user: any; theme?: 'student' | 'school' }) {
    const isSchool = theme === 'school';
    const [state, dispatch, isPending] = useActionState(updateProfile, null);

    useEffect(() => {
        if (state) {
            if (state.success) {
                toast.success(state.message);
            } else if (state.error) {
                toast.error(state.error);
            }
        }
    }, [state]);

    return (
        <form action={dispatch} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900" htmlFor="fullName">
                    Full Name
                </label>
                <input
                    className={`flex h-11 w-full rounded-md border-2 border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 ${isSchool ? 'focus-visible:ring-brand-accent' : 'focus-visible:ring-indigo-500'} focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all`}
                    id="fullName"
                    name="fullName"
                    type="text"
                    defaultValue={user.fullName}
                    placeholder="Enter your full name"
                    required
                />
            </div>

            <Button
                type="submit"
                disabled={isPending}
                className={isSchool 
                    ? "bg-brand-primary hover:bg-brand-primary-hover text-white px-8 h-11 transition-all shadow-sm active:scale-95" 
                    : "bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-11 transition-all shadow-sm active:scale-95"
                }
            >
                {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
        </form>
    );
}
