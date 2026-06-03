import { getUserById, getAllCountries, getAllUniversities } from '@/lib/data';
import RoleForm from './role-form';
import SuperAgentSchoolManager from '@/components/admin/SuperAgentSchoolManager';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    ArrowLeft,
    User,
    Shield,
    Calendar,
    Mail,
    Hash,
    Activity,
    Lock,
    Users,
    Building2,
    Globe,
    CheckCircle2,
    Ban
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ManagementActions from './ManagementActions';
import { Role, UserStatus } from '@prisma/client';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getUserById(id);
    const [countries, { universities }] = await Promise.all([
        getAllCountries(),
        getAllUniversities()
    ]);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <h2 className="text-xl font-black text-brand-primary">Identity not found</h2>
                <Link href="/dashboard/admin/users" className="text-brand-accent font-bold hover:underline mt-4">
                    Return to Registry
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full space-y-10 pb-12 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link
                        href="/dashboard/admin/users"
                        className="h-14 w-14 rounded-2xl bg-white shadow-xl shadow-brand-primary/10 flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-brand-accent hover:scale-110 transition-all duration-300 border border-gray-100"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-[10px] font-black uppercase tracking-[0.2em] mb-3 border border-brand-accent/20">
                            <Shield className="w-3 h-3" />
                            Identity Registry
                        </div>
                        <h1 className="text-4xl font-black text-brand-primary tracking-tight">{user.fullName}</h1>
                        <p className="text-gray-500 mt-1 font-medium italic flex items-center gap-2">
                            <Mail className="w-4 h-4 text-brand-accent" />
                            {user.email}
                        </p>
                    </div>
                </div>

                <ManagementActions userId={user.id} currentStatus={user.status as UserStatus} userName={user.fullName} />
            </div>

            <div className="grid gap-10 lg:grid-cols-3">
                <div className="lg:col-span-1 space-y-8">
                    {/* Identity Profile Overview */}
                    <Card className="border-none shadow-2xl shadow-brand-primary/10 rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                            <CardTitle className="text-xl font-black flex items-center gap-3 text-brand-primary">
                                <div className="p-2.5 rounded-xl bg-brand-primary text-brand-accent">
                                    <User className="w-5 h-5" />
                                </div>
                                Core Identity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2 block">System Role</label>
                                    <div className="flex items-center gap-2">
                                        <RoleIndicator role={user.role as Role} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2 block">Security Status</label>
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border
                                        ${user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                        {user.status === 'ACTIVE' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                                        {user.status}
                                    </div>
                                </div>
                            </div>
                            <Separator className="bg-gray-100" />
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Entry</span>
                                    <span className="text-sm font-bold text-brand-primary">{new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Applications</span>
                                    <span className="text-sm font-black text-brand-accent">{user._count.applications} Records</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Affiliation Context */}
                    {(user.managedCountry || user.managedUniversity) && (
                        <Card className="border-none shadow-2xl shadow-brand-primary/20 rounded-[2.5rem] bg-brand-primary text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/20 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <CardHeader className="p-8 pb-4 relative z-10">
                                <CardTitle className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em]">Institutional Affiliation</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 space-y-6 relative z-10">
                                {user.managedUniversity && (
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                            <Building2 className="w-6 h-6 text-brand-accent" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-brand-accent uppercase tracking-widest">Directing Institution</p>
                                            <p className="text-lg font-black tracking-tight leading-tight">{user.managedUniversity.name}</p>
                                        </div>
                                    </div>
                                )}
                                {user.managedCountry && (
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                            <Globe className="w-6 h-6 text-brand-accent" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-brand-accent uppercase tracking-widest">Regional Authority</p>
                                            <p className="text-lg font-black tracking-tight leading-tight">{user.managedCountry.name}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="lg:col-span-2">
                    <RoleForm
                        userId={user.id}
                        currentRole={user.role}
                        currentCountryId={user.managedCountry?.id}
                        currentUniversityId={user.managedUniversity?.id}
                        countries={countries}
                        universities={universities}
                    />
                    {user.role === 'SCHOOL_SUPER_AGENT' && (
                        <SuperAgentSchoolManager
                            superAgentId={user.id}
                            allUniversities={universities}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

function RoleIndicator({ role }: { role: Role }) {
    const labels = {
        SUPER_ADMIN: 'Supreme Administrator',
        COUNTRY_DIRECTOR: 'Regional Director',
        SCHOOL_ADMIN: 'Institutional Officer',
        SCHOOL_SUPER_AGENT: 'Schools Super Agent',
        AFFILIATE: 'Marketing Partner',
        PROSPECT: 'Platform Prospect'
    };
    return <span className="text-sm font-black text-brand-primary">{labels[role] || role}</span>;
}
