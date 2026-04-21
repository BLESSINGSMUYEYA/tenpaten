'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { changePassword } from '@/lib/actions';

export default function PasswordForm({ theme = 'student' }: { theme?: 'student' | 'school' }) {
    const isSchool = theme === 'school';
    const [errorMessage, dispatch, isPending] = useActionState(changePassword, undefined);

    return (
        <form action={dispatch} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="currentPassword">
                    Current Password
                </label>
                <input
                    className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 ${isSchool ? 'focus:border-[#d5a22d] focus:ring-[#d5a22d]' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="newPassword">
                    New Password
                </label>
                <input
                    className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 ${isSchool ? 'focus:border-[#d5a22d] focus:ring-[#d5a22d]' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    minLength={6}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                    Confirm New Password
                </label>
                <input
                    className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 ${isSchool ? 'focus:border-[#d5a22d] focus:ring-[#d5a22d]' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    minLength={6}
                    required
                />
            </div>

            {errorMessage && (
                <div className={`text-sm ${errorMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                    {errorMessage}
                </div>
            )}

            <Button 
                type="submit" 
                aria-disabled={isPending} 
                disabled={isPending}
                className={isSchool 
                    ? "bg-[#36335e] hover:bg-[#2a284a] text-white px-8 h-11 transition-all shadow-sm active:scale-95" 
                    : "bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-11 transition-all shadow-sm active:scale-95"
                }
            >
                {isPending ? 'Updating...' : 'Change Password'}
            </Button>
        </form>
    );
}
