'use client';

import { useState, useTransition } from 'react';
import { Plus, Trash2, Globe, Loader2, X, Edit3 } from 'lucide-react';
import { createCountry, deleteCountry, updateCountry } from '@/lib/actions/admin-countries';
import { toast } from 'sonner';

type Country = {
    id: string;
    name: string;
    code: string;
    directorId: string | null;
    _count?: { universities: number };
    director?: { fullName: string } | null;
};

export default function CountriesManager({ initialCountries }: { initialCountries: Country[] }) {
    const [countries, setCountries] = useState<Country[]>(initialCountries);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [isPending, startTransition] = useTransition();

    const handleAction = () => {
        if (!name.trim() || !code.trim()) return;
        
        startTransition(async () => {
            if (editingId) {
                // Update
                const result = await updateCountry(editingId, name, code);
                if (result?.success && result.country) {
                    setCountries(prev => prev.map(c => c.id === editingId ? { ...c, name: result.country!.name, code: result.country!.code } : c));
                    resetForm();
                    toast.success(`"${result.country.name}" updated successfully`);
                } else {
                    toast.error(result?.error || 'Failed to update country');
                }
            } else {
                // Create
                const result = await createCountry(name, code);
                if (result?.success && result.country) {
                    setCountries(prev => [...prev, { ...result.country!, _count: { universities: 0 }, director: null } as Country]);
                    resetForm();
                    toast.success(`"${result.country.name}" added successfully`);
                } else {
                    toast.error(result?.error || 'Failed to add country');
                }
            }
        });
    };

    const resetForm = () => {
        setName('');
        setCode('');
        setEditingId(null);
        setShowForm(false);
    };

    const startEdit = (country: Country) => {
        setEditingId(country.id);
        setName(country.name);
        setCode(country.code);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (countryId: string, countryName: string) => {
        if (!confirm(`Delete "${countryName}"? This will unlink its director and cannot be undone.`)) return;
        startTransition(async () => {
            const result = await deleteCountry(countryId);
            if (result?.success) {
                setCountries(prev => prev.filter(c => c.id !== countryId));
                toast.success(`"${countryName}" removed`);
            } else {
                toast.error(result?.error || 'Failed to delete country');
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Add/Edit Country Form */}
            {showForm ? (
                <div className="bg-white rounded-2xl border border-[#d5a22d]/30 shadow-xl p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-black text-[#36335e] text-sm uppercase tracking-widest">
                            {editingId ? 'Edit Country' : 'Add New Country'}
                        </h3>
                        <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Country Name *</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAction()}
                                placeholder="e.g. Malawi"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#d5a22d]/20 focus:border-[#d5a22d] text-sm font-bold text-[#36335e] transition-all"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Code * (e.g. +265 or MW)</label>
                            <input
                                type="text"
                                value={code}
                                onChange={e => setCode(e.target.value.toUpperCase().slice(0, 6))}
                                onKeyDown={e => e.key === 'Enter' && handleAction()}
                                placeholder="+265"
                                maxLength={6}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#d5a22d]/20 focus:border-[#d5a22d] text-sm font-bold text-[#36335e] uppercase tracking-widest transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={resetForm}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAction}
                            disabled={isPending || !name.trim() || !code.trim()}
                            className="px-6 py-2.5 rounded-xl text-sm font-black bg-[#36335e] text-white hover:bg-[#2a284a] shadow-lg shadow-[#36335e]/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin text-[#d5a22d]" /> : <Plus className="w-4 h-4 text-[#d5a22d]" />}
                            {editingId ? 'Update Country' : 'Add Country'}
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#d5a22d] hover:bg-[#d5a22d]/5 transition-all flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-[#d5a22d] group"
                >
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Add Country
                </button>
            )}

            {/* Countries Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                {countries.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
                        <Globe className="w-10 h-10 text-gray-300 mb-3" />
                        <p className="font-black text-gray-400 text-sm uppercase tracking-widest">No countries yet</p>
                        <p className="text-xs text-gray-400 mt-1">Add your first country to get started</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#36335e] text-white">
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em]">Country</th>
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Code</th>
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Director</th>
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Universities</th>
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {countries.map(country => (
                                    <tr key={country.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-[#36335e]/5 group-hover:bg-[#36335e] flex items-center justify-center transition-colors">
                                                    <Globe className="w-4 h-4 text-[#36335e] group-hover:text-[#d5a22d] transition-colors" />
                                                </div>
                                                <span className="font-black text-[#36335e]">{country.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-[10px] font-black bg-gray-100 text-gray-600 uppercase tracking-widest">
                                                {country.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {country.director ? (
                                                <span className="text-sm font-bold text-[#36335e]">{country.director.fullName}</span>
                                            ) : (
                                                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-widest">
                                                    No Director
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-black text-[#36335e]">{country._count?.universities ?? 0}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() => startEdit(country)}
                                                    className="p-2 rounded-xl text-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100"
                                                    title="Edit country"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(country.id, country.name)}
                                                    disabled={isPending}
                                                    title="Delete country"
                                                    className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-40"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
