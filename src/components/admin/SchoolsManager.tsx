'use client';

import { useState, useTransition, useEffect } from 'react';
import { 
    Search, Filter, Plus, Building2, MapPin, 
    GraduationCap, ExternalLink, Trash2, Check, X,
    Loader2, MoreVertical, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UniversityStatus } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { deleteUniversity, updateUniversityStatus } from '@/lib/actions/universities';
import { registerUniversityByAdmin } from '@/lib/actions/admin-universities';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type School = {
    id: string;
    name: string;
    logo: string | null;
    website: string | null;
    status: UniversityStatus;
    country: { name: string, code: string };
    programs: { id: string }[];
    departments: { id: string, name: string }[];
};

interface SchoolsManagerProps {
    initialSchools: School[];
    total: number;
    countries: { id: string, name: string, code: string }[];
}

export default function SchoolsManager({ initialSchools, total, countries }: SchoolsManagerProps) {
    const [schools, setSchools] = useState<School[]>(initialSchools);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPending, startTransition] = useTransition();
    const [loadingIds, setLoadingIds] = useState<string[]>([]);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    // Auto-open register modal if action=register is in URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('action') === 'register') {
            setIsRegisterModalOpen(true);
            // Clear the param without refreshing to avoid re-opening on reload
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, []);

    const filteredSchools = schools.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id: string, name: string, force = false) => {
        const message = force 
            ? `FORCE DELETE "${name}"? This will permanently delete ALL active programs and student applications associated with this school. This cannot be undone!`
            : `Are you sure you want to delete "${name}"? This action cannot be undone.`;

        if (!confirm(message)) return;
        
        startTransition(async () => {
            setLoadingIds(prev => [...prev, id]);
            const result = await deleteUniversity(id, force);
            if (result.success) {
                setSchools(prev => prev.filter(s => s.id !== id));
                toast.success(`"${name}" deleted successfully ${force ? '(cascaded)' : ''}.`);
            } else if (result.hasPrograms && !force) {
                // Initial check failed due to programs, offer force delete
                handleDelete(id, name, true);
            } else {
                toast.error(result.error || 'Failed to delete university');
            }
            setLoadingIds(prev => prev.filter(lid => lid !== id));
        });
    };

    const handleStatusChange = (id: string, newStatus: UniversityStatus) => {
        startTransition(async () => {
            setLoadingIds(prev => [...prev, id]);
            const result = await updateUniversityStatus(id, newStatus);
            if (result.success) {
                setSchools(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
                toast.success(`Status updated to ${newStatus}`);
            } else {
                toast.error(result.error || 'Failed to update status');
            }
            setLoadingIds(prev => prev.filter(lid => lid !== id));
        });
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsRegistering(true);
        const formData = new FormData(e.currentTarget);
        
        try {
            const result = await registerUniversityByAdmin(formData);
            if (result.success) {
                toast.success('University registered and credentials sent!');
                setIsRegisterModalOpen(false);
                // Refresh list or trigger revalidation
                window.location.reload(); 
            } else {
                toast.error(result.error || 'Failed to register university');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tight">University Management</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Monitor and manage all educational institutions across the platform.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        onClick={() => setIsRegisterModalOpen(true)}
                        className="bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl px-6 py-6 shadow-lg shadow-brand-primary/20 transition-all active:scale-95 flex gap-2 font-bold"
                    >
                        <Plus className="w-5 h-5 text-brand-accent" />
                        <span>Register New School</span>
                    </Button>
                </div>
            </div>

            {/* Quick Stats Toolbar */}
            <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex-1 min-w-[300px] relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-accent transition-colors" />
                    <input
                        type="text"
                        placeholder="Search universities by name or country..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-brand-accent/30 focus:ring-0 rounded-xl text-sm font-medium transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 pr-2">
                    <Button variant="outline" className="rounded-xl border-gray-200 text-gray-600 font-bold flex gap-2">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </Button>
                </div>
            </div>

            {/* Schools Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-brand-primary text-white">
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">University Info</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Location</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Academic Scope</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredSchools.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center opacity-50">
                                            <Building2 className="w-12 h-12 text-gray-300 mb-3" />
                                            <p className="font-black text-gray-400 text-sm uppercase tracking-[0.2em]">No Universities Found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredSchools.map((school) => (
                                    <tr key={school.id} className="hover:bg-gray-50/50 transition-colors duration-200 group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-gray-50 border-2 border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:border-brand-accent/30 transition-colors">
                                                    {school.logo ? (
                                                        <Image
                                                            src={school.logo}
                                                            alt={school.name}
                                                            width={56}
                                                            height={56}
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <Building2 className="w-6 h-6 text-gray-300" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-black text-brand-primary truncate break-words group-hover:text-brand-accent transition-colors">
                                                        {school.name}
                                                    </h3>
                                                    {school.website ? (
                                                        <a href={school.website} target="_blank" className="text-xs font-bold text-gray-400 flex items-center gap-1 hover:text-brand-primary mt-1 transition-colors">
                                                            <ExternalLink className="w-3 h-3" />
                                                            <span>Official Website</span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-[9px] text-gray-300 uppercase font-black tracking-widest mt-1">No website listed</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
                                                    <MapPin className="w-4 h-4 text-brand-accent" />
                                                    <span>{school.country.name}</span>
                                                </div>
                                                <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">{school.country.code}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <GraduationCap className="w-4 h-4 text-brand-primary" />
                                                    <span className="text-sm font-black text-brand-primary">{school.programs.length} Programs</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {school.departments.slice(0, 2).map((dept) => (
                                                        <span key={dept.id} className="px-2 py-0.5 bg-gray-100 text-[10px] font-black text-gray-500 rounded-md uppercase tracking-tight">
                                                            {dept.name}
                                                        </span>
                                                    ))}
                                                    {school.departments.length > 2 && (
                                                        <span className="text-[10px] font-bold text-brand-accent px-1">+{school.departments.length - 2} more</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <StatusBadge status={school.status} />
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                {/* Details Page */}
                                                <Button asChild size="icon" variant="ghost" className="rounded-xl text-brand-primary hover:bg-brand-primary hover:text-brand-accent transition-all">
                                                    <Link href={`/dashboard/admin/schools/${school.id}`} title="View Details">
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                </Button>

                                                {/* Approve Action */}
                                                {school.status !== 'APPROVED' && (
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className="rounded-xl text-green-500 hover:bg-green-50 transition-all"
                                                        onClick={() => handleStatusChange(school.id, 'APPROVED')}
                                                        disabled={loadingIds.includes(school.id)}
                                                    >
                                                        {loadingIds.includes(school.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                    </Button>
                                                )}

                                                {/* Reject Action */}
                                                {school.status === 'PENDING' && (
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className="rounded-xl text-amber-500 hover:bg-amber-50 transition-all"
                                                        onClick={() => handleStatusChange(school.id, 'REJECTED')}
                                                        disabled={loadingIds.includes(school.id)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                )}

                                                {/* Delete Action */}
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    className="rounded-xl text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                                    onClick={() => handleDelete(school.id, school.name)}
                                                    disabled={loadingIds.includes(school.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Visual only for now since we used initialSchools) */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Showing {filteredSchools.length} of {total} Institutions
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="rounded-xl text-xs font-black uppercase tracking-[0.1em]"
                            disabled
                        >
                            Previous
                        </Button>
                        <Button
                            className="bg-brand-primary text-brand-accent hover:bg-brand-primary-hover rounded-xl text-xs font-black uppercase tracking-[0.1em]"
                            disabled
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            {/* Register University Modal */}
            <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-brand-primary p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Building2 className="w-24 h-24" />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tight">Onboard University</DialogTitle>
                            <DialogDescription className="text-white/60 font-medium">
                                Register a new institution and send admin credentials automatically.
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <form onSubmit={handleRegister} className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="universityName" className="text-xs font-black uppercase tracking-widest text-gray-400">University Name</Label>
                                <Input 
                                    id="universityName" 
                                    name="universityName" 
                                    placeholder="e.g. Oxford University" 
                                    required 
                                    className="rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="countryId" className="text-xs font-black uppercase tracking-widest text-gray-400">Country Location</Label>
                                <Select name="countryId" required>
                                    <SelectTrigger className="rounded-xl border-gray-100 bg-gray-50 focus:bg-white">
                                        <SelectValue placeholder="Select a country" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {countries.map((country) => (
                                            <SelectItem key={country.id} value={country.id}>
                                                {country.name} ({country.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="pt-4 border-t border-gray-50">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-accent mb-4">Admin Account Details</p>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="adminName" className="text-xs font-bold text-gray-500">Admin Full Name</Label>
                                        <Input 
                                            id="adminName" 
                                            name="adminName" 
                                            placeholder="e.g. Dr. Jane Smith" 
                                            required 
                                            className="rounded-xl border-gray-100 bg-gray-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="adminEmail" className="text-xs font-bold text-gray-500">Work Email Address</Label>
                                        <Input 
                                            id="adminEmail" 
                                            name="adminEmail" 
                                            type="email" 
                                            placeholder="admin@oxford.edu" 
                                            required 
                                            className="rounded-xl border-gray-100 bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={() => setIsRegisterModalOpen(false)}
                                className="rounded-xl font-bold"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isRegistering}
                                className="bg-brand-primary text-white hover:bg-brand-primary-hover rounded-xl px-8 font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-primary/20"
                            >
                                {isRegistering ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Registering...
                                    </>
                                ) : (
                                    'Register & Send Email'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function StatusBadge({ status }: { status: UniversityStatus }) {
    const styles = {
        APPROVED: "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
        PENDING: "bg-amber-50 text-amber-600 border-amber-100",
        REJECTED: "bg-red-50 text-red-600 border-red-100",
        DRAFT: "bg-gray-100 text-gray-500 border-gray-200",
    };

    return (
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${styles[status]}`}>
            {status}
        </span>
    );
}
