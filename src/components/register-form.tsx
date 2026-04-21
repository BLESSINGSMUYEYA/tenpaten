'use client';

import { useActionState, useState } from 'react';
import { register } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, LockKeyhole, Loader2, AlertCircle, Eye, EyeOff, Globe } from 'lucide-react';
import { SearchableSelect } from '@/components/ui/searchable-select';

export default function RegisterForm({ countries = [], callbackUrl = '' }: { countries?: any[]; callbackUrl?: string }) {
    const [showPassword, setShowPassword] = useState(false);
    const [residenceCountryId, setResidenceCountryId] = useState('');

    const [errorMessage, formAction, isPending] = useActionState(
        register,
        undefined,
    );

    return (
        <form action={formAction} className="space-y-4">
            {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}
            <input type="hidden" name="residenceCountryId" value={residenceCountryId} />
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            id="fullName"
                            type="text"
                            name="fullName"
                            placeholder="Full name"
                            required
                            minLength={2}
                            className="pl-10"
                            disabled={isPending}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Email address"
                            required
                            className="pl-10"
                            disabled={isPending}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            required
                            minLength={6}
                            className="pl-10 pr-10"
                            disabled={isPending}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="residenceCountryId">Country of Residence</Label>
                    <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                        <SearchableSelect
                            options={countries.map(c => ({ value: c.id, label: c.name }))}
                            value={residenceCountryId}
                            onChange={setResidenceCountryId}
                            placeholder="Select your country"
                            className="pl-7"
                        />
                    </div>
                </div>
            </div>

            <Button
                className="w-full h-11 bg-[#d5a22d] hover:bg-[#b89531] text-white transition-all font-semibold rounded-xl shadow-lg shadow-[#d5a22d]/20"
                disabled={isPending}
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                    </>
                ) : (
                    'Register'
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
