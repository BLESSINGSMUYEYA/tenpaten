'use client';

import { useActionState } from 'react';
import { joinAffiliateProgram } from '@/lib/actions';
import { Button } from '@/components/ui/button';

export default function JoinAffiliateForm() {
    const [errorMessage, formAction, isPending] = useActionState(
        joinAffiliateProgram,
        undefined,
    );

    return (
        <form action={formAction} className="space-y-4 max-w-md">
            <p className="text-gray-600 mb-4">
                Join our affiliate program to earn commissions by referring students to our partner universities.
            </p>

            <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-4">
                <h3 className="font-semibold text-blue-800">Benefits</h3>
                <ul className="list-disc list-inside text-sm text-blue-700 mt-2">
                    <li>Earn for every successful enrollment.</li>
                    <li>Track your referrals in real-time.</li>
                    <li>Access marketing materials.</li>
                </ul>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
                Join Affiliate Program
            </Button>

            {errorMessage && (
                <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
            )}
        </form>
    );
}
