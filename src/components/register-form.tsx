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

            {/* Full Name */}
            <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-bold text-gray-500 tracking-wide">
                    Full name
                </Label>
                <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                    <Input
                        id="fullName"
                        type="text"
                        name="fullName"
                        placeholder="Jane Smith"
                        required
                        minLength={2}
                        className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-300 focus:bg-white focus:border-brand-accent focus:ring-0 transition-all text-sm font-medium"
                        disabled={isPending}
                    />
                </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-gray-500 tracking-wide">
                    Email address
                </Label>
                <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        required
                        className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-300 focus:bg-white focus:border-brand-accent focus:ring-0 transition-all text-sm font-medium"
                        disabled={isPending}
                    />
                </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-bold text-gray-500 tracking-wide">
                    Password
                </Label>
                <div className="relative">
                    <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Min. 6 characters"
                        required
                        minLength={6}
                        className="pl-10 pr-10 h-12 rounded-xl border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-300 focus:bg-white focus:border-brand-accent focus:ring-0 transition-all text-sm font-medium"
                        disabled={isPending}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* Country */}
            <div className="space-y-1.5">
                <Label htmlFor="residenceCountryId" className="text-xs font-bold text-gray-500 tracking-wide">
                    Country of residence
                </Label>
                <div className="relative">
                    <Globe className="absolute left-3.5 top-[1.35rem] h-4 w-4 text-gray-300 z-10" />
                    <SearchableSelect
                        options={countries.map(c => ({ value: c.id, label: c.name }))}
                        value={residenceCountryId}
                        onChange={setResidenceCountryId}
                        placeholder="Select your country"
                        className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50 transition-all text-sm font-medium"
                    />
                </div>
            </div>

            {/* Submit */}
            <Button
                className="w-full h-12 bg-brand-accent hover:bg-[#b89531] text-white font-bold tracking-wide text-sm rounded-xl transition-all active:scale-[0.98] shadow-md shadow-brand-accent/20 mt-2"
                disabled={isPending}
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                    </>
                ) : (
                    'Create Account'
                )}
            </Button>

            {/* Error */}
            <div aria-live="polite" aria-atomic="true">
                {errorMessage && (
                    <div className="flex items-center gap-3 rounded-xl bg-red-50 p-3.5 text-xs font-semibold text-red-600 border border-red-100 animate-in fade-in duration-300">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <p>{errorMessage}</p>
                    </div>
                )}
            </div>
        </form>
    );
}
