import { getAllUsers } from '@/lib/data';
import { UserPlus, Search, Filter, Mail, Shield, ShieldCheck, UserCog, Ban, CheckCircle2, MoreVertical, Building2, Globe } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/common/Pagination';
import { format } from 'date-fns';
import { Role, UserStatus } from '@prisma/client';
import DeleteUserButton from '@/components/admin/DeleteUserButton';
import ProvisionIdentityModal from '@/components/admin/ProvisionIdentityModal';

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams?: Promise<{ page?: string; role?: string }>;
}) {
    const { page, role } = (await searchParams) || {};
    const currentPage = Number(page) || 1;
    const currentRole = role || 'all';
    const { users, metadata } = await getAllUsers(currentPage, 10, currentRole);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tight">Identity & Access</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Manage platform-wide user roles, permissions, and security status.</p>
                </div>
                <div className="flex items-center gap-3">
                    <ProvisionIdentityModal>
                        <Button className="bg-brand-primary hover:bg-brand-primary-hover text-white rounded-2xl px-6 py-6 shadow-lg shadow-brand-primary/20 transition-all active:scale-95 flex gap-2 font-bold group">
                            <UserPlus className="w-5 h-5 text-brand-accent group-hover:scale-110 transition-transform" />
                            <span>Provision New Identity</span>
                        </Button>
                    </ProvisionIdentityModal>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-white p-2 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center p-1 bg-gray-50 rounded-2xl">
                    <Link 
                        href="/dashboard/admin/users?role=all"
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${currentRole === 'all' ? 'bg-brand-primary text-brand-accent shadow-lg shadow-brand-primary/20' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        All Identities
                    </Link>
                    <Link 
                        href="/dashboard/admin/users?role=staff"
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${currentRole === 'staff' ? 'bg-brand-primary text-brand-accent shadow-lg shadow-brand-primary/20' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Staff Only
                    </Link>
                </div>

                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-accent transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or identity code..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-brand-accent/30 focus:ring-0 rounded-xl text-sm font-medium transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="rounded-xl border-gray-200 text-gray-600 font-bold flex gap-2 h-11 px-6">
                        <Filter className="w-4 h-4 text-brand-accent" />
                        <span>Advanced Filters</span>
                    </Button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-brand-primary text-white">
                                <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em]">Identity Profile</th>
                                <th className="px-6 py-6 text-xs font-black uppercase tracking-[0.2em]">Privilege Level</th>
                                <th className="px-6 py-6 text-xs font-black uppercase tracking-[0.2em]">Affiliation</th>
                                <th className="px-6 py-6 text-xs font-black uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-6 text-xs font-black uppercase tracking-[0.2em] text-center">Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors duration-200 group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary font-black group-hover:bg-brand-primary group-hover:text-brand-accent transition-all shadow-inner">
                                                {user.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-black text-brand-primary group-hover:text-brand-accent transition-colors leading-none">
                                                    {user.fullName}
                                                </h3>
                                                <div className="flex items-center gap-1.5 mt-1.5 opacity-60">
                                                    <Mail className="w-3 h-3" />
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <RoleBadge role={user.role as Role} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-1">
                                            {user.role === 'SCHOOL_ADMIN' && user.managedUniversity && (
                                                <div className="flex items-center gap-1.5 text-xs font-black text-brand-primary">
                                                    <Building2 className="w-3.5 h-3.5 text-brand-accent" />
                                                    <span className="truncate max-w-[150px]">{user.managedUniversity.name}</span>
                                                </div>
                                            )}
                                            {user.role === 'SCHOOL_SUPER_AGENT' && (
                                                <div className="flex items-center gap-1.5 text-xs font-black text-indigo-600">
                                                    <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                                                    <span>Multi-School Operator</span>
                                                </div>
                                            )}
                                            {user.role === 'COUNTRY_DIRECTOR' && user.managedCountry && (
                                                <div className="flex items-center gap-1.5 text-xs font-black text-brand-primary">
                                                    <Globe className="w-3.5 h-3.5 text-brand-accent" />
                                                    <span>{user.managedCountry.name}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                <span>Joined {format(new Date(user.createdAt), 'MMM yyyy')}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            {user.status === 'BLOCKED' ? (
                                                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-red-50 text-red-600 border border-red-100 uppercase tracking-widest">Blocked</span>
                                            ) : (
                                                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest">Active</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link href={`/dashboard/admin/users/${user.id}`}>
                                                <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl text-brand-primary hover:bg-brand-primary hover:text-brand-accent transition-all">
                                                    <UserCog className="w-5 h-5" />
                                                </Button>
                                            </Link>
                                            <DeleteUserButton userId={user.id} userName={user.fullName} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                        Log Segment {currentPage} of {metadata.totalPages}
                    </p>
                    <Pagination totalPages={metadata.totalPages} currentPage={currentPage} />
                </div>
            </div>
        </div>
    );
}

function RoleBadge({ role }: { role: Role }) {
    const configs = {
        SUPER_ADMIN: { label: 'Super Admin', style: 'bg-brand-primary text-brand-accent border-brand-primary', icon: ShieldCheck },
        COUNTRY_DIRECTOR: { label: 'Regional Director', style: 'bg-blue-50 text-blue-600 border-blue-100', icon: Globe },
        SCHOOL_ADMIN: { label: 'School Admin', style: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: Building2 },
        SCHOOL_SUPER_AGENT: { label: 'Schools Super Agent', style: 'bg-violet-50 text-violet-600 border-violet-100', icon: ShieldCheck },
        AFFILIATE: { label: 'Partner Affiliate', style: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: Shield },
        PROSPECT: { label: 'Student User', style: 'bg-gray-100 text-gray-600 border-gray-200', icon: Shield },
    };

    const config = configs[role] || configs.PROSPECT;
    const Icon = config.icon;

    return (
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border flex items-center gap-2 ${config.style}`}>
            <Icon className="w-3 h-3" />
            {config.label}
        </span>
    );
}
