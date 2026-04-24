'use client';

import { useState, useActionState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserPlus, Loader2, CheckCircle2, Eye, EyeOff, ShieldCheck, Globe, Building2, User } from 'lucide-react';
import { createUserByAdmin } from '@/lib/actions/users';
import { toast } from 'sonner';

interface ProvisionIdentityModalProps {
    children?: React.ReactNode;
}

const ROLE_OPTIONS = [
    { value: 'SUPER_ADMIN', label: 'Supreme Administrator', icon: ShieldCheck, description: 'Full platform control & configuration' },
    { value: 'COUNTRY_DIRECTOR', label: 'Country Director', icon: Globe, description: 'Manages a regional territory' },
    { value: 'SCHOOL_ADMIN', label: 'School Administrator', icon: Building2, description: 'Manages an institutional profile' },
    { value: 'AFFILIATE', label: 'Partner Affiliate', icon: User, description: 'Marketing & referral partner' },
];

export default function ProvisionIdentityModal({ children }: ProvisionIdentityModalProps) {
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');

    // Auto-open modal if action=provision is in URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('action') === 'provision') {
            setOpen(true);
            // Clear the param without refreshing
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, []);

    const [state, formAction, isPending] = useActionState(createUserByAdmin, undefined);

    // Handle initial state and updates from action state
    const [prevActionState, setPrevActionState] = useState(state);
    if (state !== prevActionState) {
        setPrevActionState(state);
        if (state === 'User created successfully.') {
            setOpen(false);
            setSelectedRole('');
        }
    }

    // When state indicates success or error, show a toast
    useEffect(() => {
        if (state === 'User created successfully.') {
            toast.success('Identity provisioned successfully');
        } else if (state && state !== 'All fields are required.') {
            toast.error(state);
        }
    }, [state]);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            setSelectedRole('');
            setShowPassword(false);
        }
    };

    return (
        <>
            <div onClick={() => setOpen(true)} className="cursor-pointer">
                {children}
            </div>

            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="max-w-xl p-0 gap-0 border-none rounded-[2.5rem] overflow-hidden shadow-2xl shadow-[#36335e]/20">
                    {/* Modal Header */}
                    <div className="bg-[#36335e] p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#d5a22d]/10 rounded-full -translate-y-16 translate-x-16 blur-3xl" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 bg-[#d5a22d]/20 rounded-xl">
                                    <UserPlus className="w-5 h-5 text-[#d5a22d]" />
                                </div>
                                <DialogHeader className="p-0 space-y-0">
                                    <DialogTitle className="text-xl font-black text-white leading-tight">
                                        Provision New Identity
                                    </DialogTitle>
                                    <DialogDescription className="text-white/50 text-xs font-medium mt-1">
                                        Create a new platform identity with assigned privileges
                                    </DialogDescription>
                                </DialogHeader>
                            </div>
                        </div>
                    </div>

                    {/* Modal Body */}
                    <form action={formAction} className="p-8 space-y-6 bg-white">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]" htmlFor="provision-fullName">
                                Full Name
                            </label>
                            <input
                                id="provision-fullName"
                                type="text"
                                name="fullName"
                                required
                                placeholder="e.g. Alexandra Reyes"
                                className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-semibold text-[#36335e] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d5a22d]/40 focus:border-[#d5a22d]/40 transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]" htmlFor="provision-email">
                                Email Address
                            </label>
                            <input
                                id="provision-email"
                                type="email"
                                name="email"
                                required
                                placeholder="e.g. user@domain.com"
                                className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-semibold text-[#36335e] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d5a22d]/40 focus:border-[#d5a22d]/40 transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]" htmlFor="provision-password">
                                Temporary Password
                            </label>
                            <div className="relative">
                                <input
                                    id="provision-password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    minLength={6}
                                    placeholder="Minimum 6 characters"
                                    className="w-full px-4 py-3.5 pr-12 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-semibold text-[#36335e] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d5a22d]/40 focus:border-[#d5a22d]/40 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#36335e] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                Privilege Level
                            </label>
                            <input type="hidden" name="role" value={selectedRole} />
                            <div className="grid grid-cols-2 gap-2">
                                {ROLE_OPTIONS.map(({ value, label, icon: Icon, description }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setSelectedRole(value)}
                                        className={`p-3.5 rounded-2xl border-2 text-left transition-all hover:border-[#d5a22d]/40 hover:bg-[#d5a22d]/5 group
                                            ${selectedRole === value
                                                ? 'border-[#d5a22d] bg-[#d5a22d]/5 shadow-md shadow-[#d5a22d]/10'
                                                : 'border-gray-100 bg-gray-50'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 transition-all
                                            ${selectedRole === value ? 'bg-[#36335e] text-[#d5a22d]' : 'bg-white text-gray-400 group-hover:text-[#36335e]'}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <p className={`text-xs font-black leading-none mb-1 transition-colors ${selectedRole === value ? 'text-[#36335e]' : 'text-gray-600'}`}>
                                            {label}
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-medium leading-tight">{description}</p>
                                    </button>
                                ))}
                            </div>
                            {state === 'All fields are required.' && !selectedRole && (
                                <p className="text-[11px] text-red-500 font-bold">Please select a privilege level.</p>
                            )}
                        </div>

                        {/* Error message */}
                        {state && state !== 'User created successfully.' && (
                            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 border border-red-100">
                                <p className="text-xs font-bold text-red-600">{state}</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenChange(false)}
                                className="flex-1 h-12 rounded-2xl font-bold border-gray-200 text-gray-500 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending || !selectedRole}
                                className="flex-1 h-12 bg-[#36335e] hover:bg-[#2a284a] text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-[#36335e]/20 disabled:opacity-50"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Provisioning...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 text-[#d5a22d]" />
                                        <span>Provision Identity</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
