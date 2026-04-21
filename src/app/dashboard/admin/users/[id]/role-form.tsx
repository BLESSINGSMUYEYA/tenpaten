'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateUserRole } from '@/lib/actions/admin-users';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Role } from '@prisma/client';
import { Loader2, ShieldCheck, UserCog, Building2, Globe, CheckCircle2 } from 'lucide-react';

type Country = { id: string; name: string; };
type University = { id: string; name: string; };

export default function RoleForm({
    userId,
    currentRole,
    currentCountryId,
    currentUniversityId,
    countries,
    universities
}: {
    userId: string,
    currentRole: string,
    currentCountryId?: string,
    currentUniversityId?: string,
    countries: Country[],
    universities: University[]
}) {
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role>(currentRole as Role);
    const [countryId, setCountryId] = useState(currentCountryId || '');
    const [universityId, setUniversityId] = useState(currentUniversityId || '');
    const router = useRouter();

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const result = await updateUserRole(
                userId,
                selectedRole,
                selectedRole === 'COUNTRY_DIRECTOR' ? countryId : undefined,
                selectedRole === 'SCHOOL_ADMIN' ? universityId : undefined
            );
            if (result.success) {
                toast.success('Identity privileges successfully updated');
                router.refresh();
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('Identity update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-none shadow-2xl shadow-[#36335e]/10 rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                <CardTitle className="text-xl font-black flex items-center gap-3 text-[#36335e]">
                    <div className="p-2.5 rounded-xl bg-[#d5a22d]/10 text-[#d5a22d]">
                        <UserCog className="w-5 h-5" />
                    </div>
                    Privilege Reconfiguration
                </CardTitle>
                <CardDescription className="font-bold text-gray-400 mt-1 uppercase tracking-tight text-[10px]">Adjust the authority level and institutional ties for this identity.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Authority Tier</Label>
                        <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as Role)}>
                            <SelectTrigger className="h-14 bg-gray-50 border-gray-100 rounded-2xl focus:ring-[#d5a22d]/20 focus:border-[#d5a22d]/30 font-bold text-[#36335e]">
                                <SelectValue placeholder="Select authorization role" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                                <SelectGroup>
                                    <SelectLabel className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 py-2">System Roles</SelectLabel>
                                    <SelectItem value="PROSPECT" className="py-3 px-4 font-bold text-[#36335e]">Prospect</SelectItem>
                                    <SelectItem value="AFFILIATE" className="py-3 px-4 font-bold text-[#36335e]">Partner Affiliate</SelectItem>
                                    <SelectItem value="SCHOOL_ADMIN" className="py-3 px-4 font-bold text-[#36335e]">Institutional Admin</SelectItem>
                                    <SelectItem value="COUNTRY_DIRECTOR" className="py-3 px-4 font-bold text-[#36335e]">Regional Director</SelectItem>
                                    <SelectItem value="SUPER_ADMIN" className="py-3 px-4 font-bold text-[#36335e]">Supreme Admin</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedRole === 'COUNTRY_DIRECTOR' && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Globe className="w-3 h-3 text-[#d5a22d]" />
                                Assigned Territory
                            </Label>
                            <Select value={countryId} onValueChange={setCountryId}>
                                <SelectTrigger className="h-14 bg-gray-50 border-gray-100 rounded-2xl focus:ring-[#d5a22d]/20 focus:border-[#d5a22d]/30 font-bold text-[#36335e]">
                                    <SelectValue placeholder="Assign a country" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                                    <SelectGroup>
                                        <SelectLabel className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 py-2">Global Operations</SelectLabel>
                                        {countries.map((c) => (
                                            <SelectItem key={c.id} value={c.id} className="py-3 px-4 font-bold text-[#36335e]">{c.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {selectedRole === 'SCHOOL_ADMIN' && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Building2 className="w-3 h-3 text-[#d5a22d]" />
                                Assigned Institution
                            </Label>
                            <Select value={universityId} onValueChange={setUniversityId}>
                                <SelectTrigger className="h-14 bg-gray-50 border-gray-100 rounded-2xl focus:ring-[#d5a22d]/20 focus:border-[#d5a22d]/30 font-bold text-[#36335e]">
                                    <SelectValue placeholder="Assign a school" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-gray-100 shadow-2xl min-w-[250px]">
                                    <SelectGroup>
                                        <SelectLabel className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 py-2">Academia Registry</SelectLabel>
                                        {universities.map((u) => (
                                            <SelectItem key={u.id} value={u.id} className="py-3 px-4 font-bold text-[#36335e]">{u.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                <div className="pt-8 border-t border-gray-50 flex justify-end">
                    <Button
                        onClick={handleUpdate}
                        disabled={loading || (selectedRole === currentRole && countryId === currentCountryId && universityId === currentUniversityId)}
                        className="h-14 px-10 bg-[#36335e] hover:bg-[#2a284a] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-[#36335e]/20 transition-all transform active:scale-95 flex gap-3"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin text-[#d5a22d]" />
                                <span>Reconfiguring...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-5 h-5 text-[#d5a22d]" />
                                <span>Finalize Privilege Update</span>
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
