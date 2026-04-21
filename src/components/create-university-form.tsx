'use client';

import { useActionState } from 'react';
import { createUniversity } from '@/lib/director-actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CreateUniversityForm() {
    const [errorMessage, formAction, isPending] = useActionState(
        createUniversity,
        undefined,
    );

    return (
        <form action={formAction} className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className="mb-3 text-2xl font-bold">
                    Add University
                </h1>
                <div className="w-full">
                    <div>
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="name"
                        >
                            University Name
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="name"
                                name="name"
                                placeholder="e.g. University of Mumbai"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <Link
                        href="/dashboard/country-director/universities"
                        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    >
                        Cancel
                    </Link>
                    <Button type="submit" aria-disabled={isPending}>
                        Create University
                    </Button>
                </div>
                <div
                    className="flex h-8 items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {errorMessage && (
                        <p className="text-sm text-red-500">{errorMessage}</p>
                    )}
                </div>
            </div>
        </form>
    );
}
