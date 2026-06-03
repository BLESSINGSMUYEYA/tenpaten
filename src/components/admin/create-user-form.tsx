'use client';

import { useActionState, useState } from 'react';
import { createUserByAdmin } from '@/lib/actions/users';
import { Button } from '@/components/ui/button';
import { Country } from '@prisma/client';

export default function CreateUserForm({ countries }: { countries: Country[] }) {
    const [role, setRole] = useState('');
    const [errorMessage, formAction, isPending] = useActionState(
        createUserByAdmin,
        undefined,
    );

    return (
        <form action={formAction} className="space-y-6 max-w-md bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="space-y-4">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2" htmlFor="fullName">
                        Full Name
                    </label>
                    <input
                        className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-accent/20 transition-all outline-none"
                        id="fullName"
                        type="text"
                        name="fullName"
                        required
                        placeholder="e.g. John Doe"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-accent/20 transition-all outline-none"
                        id="email"
                        type="email"
                        name="email"
                        required
                        placeholder="john@example.com"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2" htmlFor="password">
                        Initial Password
                    </label>
                    <input
                        className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-accent/20 transition-all outline-none"
                        id="password"
                        type="password"
                        name="password"
                        required
                        minLength={6}
                        placeholder="Min. 6 characters"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2" htmlFor="role">
                        Platform Role
                    </label>
                    <select
                        className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-accent/20 transition-all outline-none appearance-none"
                        id="role"
                        name="role"
                        required
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="" disabled>Select Access Level</option>
                        <option value="COUNTRY_DIRECTOR">Country Director</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                        <option value="AFFILIATE">Affiliate</option>
                    </select>
                </div>

                {role === 'COUNTRY_DIRECTOR' && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                        <label className="block text-[10px] font-black text-brand-accent uppercase tracking-widest mb-2" htmlFor="countryId">
                            Assign Regional Territory
                        </label>
                        <select
                            className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-accent/20 transition-all outline-none appearance-none"
                            id="countryId"
                            name="countryId"
                            required
                        >
                            <option value="" disabled selected>Select Managed Country</option>
                            {countries.map((c) => (
                                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                            ))}
                        </select>
                        <p className="text-[10px] text-slate-400 mt-2 font-medium italic">This user will have full oversight of operations in the selected country.</p>
                    </div>
                )}
            </div>

            <Button type="submit" className="w-full h-12 bg-brand-primary hover:bg-brand-primary-hover text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-brand-primary/10 transition-all" disabled={isPending}>
                {isPending ? 'Propagating Records...' : 'Instantiate Account'}
            </Button>

            {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
                    <p className="text-xs font-bold text-rose-500 text-center">{errorMessage}</p>
                </div>
            )}
        </form>
    );
}
