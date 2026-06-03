'use client';

import { useState, useEffect } from 'react';
import { assignSchoolToSuperAgent, unassignSchoolFromSuperAgent, getSuperAgentAssignedSchools } from '@/lib/actions/admin-super-agents';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Building2, Plus, Trash2, Loader2, GraduationCap } from 'lucide-react';

interface University {
    id: string;
    name: string;
    logo?: string | null;
}

interface SuperAgentSchoolManagerProps {
    superAgentId: string;
    allUniversities: University[];
}

export default function SuperAgentSchoolManager({ superAgentId, allUniversities }: SuperAgentSchoolManagerProps) {
    const [assignedSchools, setAssignedSchools] = useState<University[]>([]);
    const [selectedUniId, setSelectedUniId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const fetchAssigned = async () => {
        try {
            setFetching(true);
            const schools = await getSuperAgentAssignedSchools(superAgentId);
            setAssignedSchools(schools);
        } catch (error) {
            console.error('Failed to fetch assignments:', error);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchAssigned();
    }, [superAgentId]);

    const handleAssign = async () => {
        if (!selectedUniId) return;
        setLoading(true);
        try {
            const res = await assignSchoolToSuperAgent(superAgentId, selectedUniId);
            if (res.success) {
                toast.success('University assigned successfully');
                setSelectedUniId('');
                fetchAssigned();
            } else {
                toast.error(res.error || 'Failed to assign');
            }
        } catch (error) {
            toast.error('Assignment failed');
        } finally {
            setLoading(false);
        }
    };

    const handleUnassign = async (uniId: string) => {
        if (!confirm('Are you sure you want to unassign this school?')) return;
        setLoading(true);
        try {
            const res = await unassignSchoolFromSuperAgent(superAgentId, uniId);
            if (res.success) {
                toast.success('University unassigned successfully');
                fetchAssigned();
            } else {
                toast.error(res.error || 'Failed to unassign');
            }
        } catch (error) {
            toast.error('Unassignment failed');
        } finally {
            setLoading(false);
        }
    };

    const unassignedUniversities = allUniversities.filter(
        uni => !assignedSchools.some(assigned => assigned.id === uni.id)
    );

    return (
        <Card className="border-none shadow-2xl shadow-brand-primary/10 rounded-[2.5rem] overflow-hidden bg-white mt-8">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                <CardTitle className="text-xl font-black flex items-center gap-3 text-brand-primary">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
                        <Building2 className="w-5 h-5" />
                    </div>
                    Managed School Assignments
                </CardTitle>
                <CardDescription className="font-bold text-gray-400 mt-1 uppercase tracking-tight text-[10px]">
                    Assign partner schools that this Super Agent is allowed to operate on behalf of.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
                {/* Assign School Form */}
                <div className="flex flex-col sm:flex-row items-end gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <div className="grow space-y-2">
                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Partner School</Label>
                        <Select value={selectedUniId} onValueChange={setSelectedUniId}>
                            <SelectTrigger className="h-14 bg-white border-gray-100 rounded-2xl focus:ring-indigo-500/20 focus:border-indigo-500/30 font-bold text-brand-primary">
                                <SelectValue placeholder="Choose a university to assign" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                                <SelectGroup>
                                    {unassignedUniversities.map((uni) => (
                                        <SelectItem key={uni.id} value={uni.id} className="py-3 px-4 font-bold text-brand-primary">
                                            {uni.name}
                                        </SelectItem>
                                    ))}
                                    {unassignedUniversities.length === 0 && (
                                        <div className="py-3 px-4 text-xs font-bold text-slate-400 italic text-center">
                                            All universities already assigned
                                        </div>
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        onClick={handleAssign}
                        disabled={loading || !selectedUniId}
                        className="h-14 px-8 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg active:scale-95 flex gap-2"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                        ) : (
                            <Plus className="w-4 h-4 text-brand-accent" />
                        )}
                        Assign
                    </Button>
                </div>

                {/* Assigned Schools List */}
                <div className="space-y-4">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Currently Assigned Universities</Label>
                    
                    {fetching ? (
                        <div className="flex items-center justify-center py-10 animate-pulse text-indigo-500/50">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    ) : assignedSchools.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3">
                            {assignedSchools.map((uni) => (
                                <div key={uni.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                                    <div className="flex items-center gap-3">
                                        {uni.logo ? (
                                            <img src={uni.logo} alt={uni.name} className="w-8 h-8 rounded-lg object-contain bg-slate-50 p-0.5 border border-slate-100" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold border border-indigo-100">
                                                <GraduationCap className="w-4 h-4" />
                                            </div>
                                        )}
                                        <span className="font-black text-sm text-brand-primary group-hover:text-indigo-600 transition-colors">{uni.name}</span>
                                    </div>
                                    <Button
                                        onClick={() => handleUnassign(uni.id)}
                                        disabled={loading}
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 text-rose-500 hover:bg-rose-50 rounded-xl"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 border border-dashed border-slate-200 rounded-3xl text-center text-slate-400 italic text-sm">
                            No institutions assigned to this agent yet.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
