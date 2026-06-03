'use client';

import { useActionState } from 'react';
import { register } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, LockKeyhole, Loader2, AlertCircle } from 'lucide-react';

export default function SchoolRegisterForm() {
    const [errorMessage, formAction, isPending] = useActionState(
        register,
        undefined,
    );

    return (
        <form action={formAction} className="space-y-4">
            {/* Hidden inputs for role and schema-required fields */}
            <input type="hidden" name="role" value="SCHOOL_ADMIN" />
            <input type="hidden" name="residenceCountryId" value="" />

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            id="fullName"
                            type="text"
                            name="fullName"
                            placeholder="John Doe"
                            required
                            minLength={2}
                            className="pl-10"
                            disabled={isPending}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Work Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="name@school.edu"
                            required
                            className="pl-10"
                            disabled={isPending}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Create a password (min 6 chars)"
                            required
                            minLength={6}
                            className="pl-10"
                            disabled={isPending}
                        />
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                className="w-full bg-linear-to-r from-brand-primary to-brand-primary-hover hover:from-brand-primary-hover hover:to-brand-primary text-white transition-all font-semibold shadow-lg shadow-brand-primary/20"
                disabled={isPending}
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating school account...
                    </>
                ) : (
                    'Register School'
                )}
            </Button>

            <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
            >
                {errorMessage && (
                    <div className="flex w-full items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                        <AlertCircle className="h-4 w-4 min-w-[16px]" />
                        <p>{errorMessage}</p>
                    </div>
                )}
            </div>
        </form>
    );
}
