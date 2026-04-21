'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    ExternalLink,
    User,
    Globe,
    CreditCard,
    Loader2,
    Search,
    Filter
} from 'lucide-react';
import { updateAffiliateStatus } from '@/lib/actions/affiliates';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Affiliate {
    id: string;
    userId: string;
    referralCode: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    rewardType: 'CASH' | 'TUITION_DISCOUNT';
    commissionRate: number;
    bankDetails: any;
    user: {
        fullName: string;
        email: string;
        profilePhoto: string | null;
    };
    country: {
        name: string;
    } | null;
    _count?: {
        referrals: number;
    };
}

export default function AdminAffiliatesView({
    initialAffiliates,
    metadata
}: {
    initialAffiliates: any[],
    metadata: any
}) {
    const [affiliates, setAffiliates] = useState<Affiliate[]>(initialAffiliates as Affiliate[]);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const router = useRouter();

    const handleStatusUpdate = async (affiliateId: string, newStatus: 'APPROVED' | 'REJECTED') => {
        setIsUpdating(affiliateId);
        try {
            const result = await updateAffiliateStatus(affiliateId, newStatus);
            if (result === 'success') {
                toast.success(`Affiliate application ${newStatus.toLowerCase()} successfully`);
                setAffiliates(prev => prev.map(a =>
                    a.id === affiliateId ? { ...a, status: newStatus } : a
                ));
                router.refresh();
            } else {
                toast.error(result || 'Failed to update status');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsUpdating(null);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Filters/Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email or code..."
                        className="w-full h-11 pl-12 pr-4 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#36335e]/10 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button variant="outline" className="h-11 rounded-xl gap-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
                        <Filter className="w-4 h-4" />
                        Status
                    </Button>
                    <Button variant="outline" className="h-11 rounded-xl gap-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
                        <Globe className="w-4 h-4" />
                        Country
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="w-[300px] text-[10px] font-black uppercase tracking-widest text-slate-400 py-5">Partner Profile</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Referral Code</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Region</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reward Mode</TableHead>
                            <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-slate-400 pr-8">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {affiliates.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-slate-400 font-medium">
                                    No affiliate applications found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            affiliates.map((affiliate) => (
                                <TableRow key={affiliate.id} className="hover:bg-slate-50/50 transition-colors border-slate-100 group">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                                {affiliate.user.profilePhoto ? (
                                                    <Image
                                                        src={affiliate.user.profilePhoto}
                                                        alt={affiliate.user.fullName}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[#36335e]">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-[#36335e] leading-snug">{affiliate.user.fullName}</div>
                                                <div className="text-[11px] font-bold text-slate-400 leading-tight">{affiliate.user.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-[#36335e]/5 border-none text-[#36335e] font-black rounded-lg px-2.5 py-1 text-[11px]">
                                            {affiliate.referralCode}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                            <Globe className="w-3.5 h-3.5 text-slate-400" />
                                            {affiliate.country?.name || 'Global'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {affiliate.status === 'PENDING' && (
                                            <Badge className="bg-amber-50 text-amber-600 border-amber-100 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest">
                                                Pending Review
                                            </Badge>
                                        )}
                                        {affiliate.status === 'APPROVED' && (
                                            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest">
                                                Authentic
                                            </Badge>
                                        )}
                                        {affiliate.status === 'REJECTED' && (
                                            <Badge className="bg-rose-50 text-rose-600 border-rose-100 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest">
                                                Rejected
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="capitalize">{affiliate.rewardType.replace('_', ' ').toLowerCase()}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="w-9 h-9 p-0 rounded-xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100"
                                                    disabled={isUpdating === affiliate.id}
                                                >
                                                    {isUpdating === affiliate.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                                                    ) : (
                                                        <MoreHorizontal className="w-4 h-4 text-slate-500" />
                                                    )}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-2xl border-slate-100 p-2 shadow-xl">
                                                <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest p-3">Account Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator className="bg-slate-50" />
                                                <DropdownMenuItem
                                                    className="rounded-xl p-3 font-bold text-sm focus:bg-slate-50 cursor-pointer"
                                                    onClick={() => router.push(`/dashboard/admin/affiliates/${affiliate.userId}`)}
                                                >
                                                    <CheckCircle2 className="w-4 h-4 mr-3 text-emerald-500" />
                                                    Verify credentials
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="rounded-xl p-3 font-bold text-sm focus:bg-slate-50 cursor-pointer"
                                                    onClick={() => router.push(`/dashboard/admin/users/${affiliate.userId}`)}
                                                >
                                                    <User className="w-4 h-4 mr-3 text-slate-400" />
                                                    Administrative profile
                                                </DropdownMenuItem>

                                                {affiliate.status === 'PENDING' && (
                                                    <>
                                                        <DropdownMenuSeparator className="bg-slate-50" />
                                                        <DropdownMenuItem
                                                            className="rounded-xl p-3 font-bold text-sm text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700 cursor-pointer"
                                                            onClick={() => handleStatusUpdate(affiliate.id, 'APPROVED')}
                                                        >
                                                            <CheckCircle2 className="w-4 h-4 mr-3" />
                                                            Approve Partner
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="rounded-xl p-3 font-bold text-sm text-rose-600 focus:bg-rose-50 focus:text-rose-700 cursor-pointer"
                                                            onClick={() => handleStatusUpdate(affiliate.id, 'REJECTED')}
                                                        >
                                                            <XCircle className="w-4 h-4 mr-3" />
                                                            Reject Application
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Placeholder */}
            {metadata.totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Showing page {metadata.page} of {metadata.totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!metadata.hasPrevPage}
                            className="rounded-xl font-bold h-9"
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!metadata.hasNextPage}
                            className="rounded-xl font-bold h-9"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
