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
            <div className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</Label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#36335e] transition-colors" />
                        <Input
                            id="fullName"
                            type="text"
                            name="fullName"
                            placeholder="e.g. Jane Smith"
                            required
                            minLength={2}
                            className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#36335e]/10 focus:border-[#36335e] transition-all font-medium"
                            disabled={isPending}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</Label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#36335e] transition-colors" />
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="e.g. jane@example.com"
                            required
                            className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#36335e]/10 focus:border-[#36335e] transition-all font-medium"
                            disabled={isPending}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Create Password</Label>
                    <div className="relative group">
                        <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#36335e] transition-colors" />
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Min 6 characters"
                            required
                            minLength={6}
                            className="pl-12 pr-12 h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#36335e]/10 focus:border-[#36335e] transition-all font-medium"
                            disabled={isPending}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#36335e] transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="residenceCountryId" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Country of Residence</Label>
                    <div className="relative group">
                        <Globe className="absolute left-4 top-[1.35rem] h-4 w-4 text-gray-400 group-focus-within:text-[#36335e] transition-colors z-10" />
                        <SearchableSelect
                            options={countries.map(c => ({ value: c.id, label: c.name }))}
                            value={residenceCountryId}
                            onChange={setResidenceCountryId}
                            placeholder="Select your country"
                            className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-medium"
                        />
                    </div>
                </div>
            </div>

            <Button
                className="w-full h-14 bg-[#36335e] hover:bg-[#2a284a] text-white transition-all font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-[#36335e]/20 active:scale-[0.98] mt-4"
                disabled={isPending}
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                    </>
                ) : (
                    'Create Account'
                )}
            </Button>

            <div
                className="flex min-h-[32px] items-end"
                aria-live="polite"
                aria-atomic="true"
            >
                {errorMessage && (
                    <div className="flex w-full items-center gap-3 rounded-2xl bg-red-50 p-4 text-xs font-bold text-red-600 border border-red-100 animate-in fade-in zoom-in duration-300">
                        <AlertCircle className="h-4 w-4 min-w-[16px]" />
                        <p>{errorMessage}</p>
                    </div>
                )}
            </div>
        </form>
    );
}
