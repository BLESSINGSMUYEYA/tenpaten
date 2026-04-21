'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, Building2, Calendar, Plus, Trash2, Loader2 } from 'lucide-react';
import { updateWorkExperience } from '@/lib/actions/profiles';
import { toast } from 'sonner';

interface WorkExperienceFormProps {
    user: any;
    onNext?: () => void;
}

export default function WorkExperienceForm({ user, onNext }: WorkExperienceFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [action, setAction] = useState<'save' | 'next'>('save');

    const workData = user.workExperience || {};
    const [formData, setFormData] = useState({
        experiences: workData.experiences || [],
        totalYearsExperience: workData.totalYearsExperience || '',
    });

    const addExperience = () => {
        setFormData({
            ...formData,
            experiences: [
                ...formData.experiences,
                { company: '', jobTitle: '', startDate: '', endDate: '', responsibilities: '' }
            ]
        });
    };

    const removeExperience = (index: number) => {
        const newExps = [...formData.experiences];
        newExps.splice(index, 1);
        setFormData({ ...formData, experiences: newExps });
    };

    const updateExperience = (index: number, field: string, value: string) => {
        const newExps = [...formData.experiences];
        newExps[index] = { ...newExps[index], [field]: value };
        setFormData({ ...formData, experiences: newExps });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await updateWorkExperience(formData);
            if (result.success) {
                toast.success(result.message);
                router.refresh();
                if (action === 'next' && onNext) {
                    onNext();
                }
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Work Experience</h3>
                <p className="text-sm text-gray-600">
                    Provide details of your professional background. This is especially important for MBA and Postgraduate applications.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-3 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                    <Label htmlFor="totalYearsExperience" className="text-sm font-semibold flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-slate-500" />
                        Total Years of Full-Time Experience
                    </Label>
                    <select
                        id="totalYearsExperience"
                        value={formData.totalYearsExperience}
                        onChange={(e) => setFormData({ ...formData, totalYearsExperience: e.target.value })}
                        className="flex h-11 w-full max-w-xs rounded-md border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="">Select duration</option>
                        <option value="none">None (Fresh Graduate)</option>
                        <option value="<1">Less than 1 year</option>
                        <option value="1-3">1 to 3 years</option>
                        <option value="3-5">3 to 5 years</option>
                        <option value="5-10">5 to 10 years</option>
                        <option value="10+">More than 10 years</option>
                    </select>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-gray-900">Employment History</h4>
                        <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={addExperience}
                            className="bg-white text-gray-700 border border-gray-200"
                        >
                            <Plus className="w-4 h-4 mr-1" /> Add Role
                        </Button>
                    </div>

                    {formData.experiences.length === 0 ? (
                        <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-sm text-gray-500 mb-3">No work experience added yet.</p>
                            <Button type="button" onClick={addExperience} className="bg-white border text-gray-700 hover:bg-gray-100">
                                Add First Role
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {formData.experiences.map((exp: any, index: number) => (
                                <div key={index} className="p-4 sm:p-5 border border-gray-200 rounded-xl bg-white shadow-sm relative group">
                                    <button
                                        type="button"
                                        onClick={() => removeExperience(index)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold uppercase text-gray-500">Job Title</Label>
                                            <Input
                                                required
                                                value={exp.jobTitle}
                                                onChange={(e) => updateExperience(index, 'jobTitle', e.target.value)}
                                                placeholder="e.g. Software Engineer"
                                                className="border-gray-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold uppercase text-gray-500">Company</Label>
                                            <Input
                                                required
                                                value={exp.company}
                                                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                                placeholder="e.g. Google"
                                                className="border-gray-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold uppercase text-gray-500">Start Date</Label>
                                            <Input
                                                required
                                                type="month"
                                                value={exp.startDate}
                                                onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                                                className="border-gray-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold uppercase text-gray-500">End Date</Label>
                                            <Input
                                                type="month"
                                                value={exp.endDate}
                                                onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                                                className="border-gray-200"
                                                placeholder="Leave empty if present"
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-1 md:col-span-2">
                                            <Label className="text-xs font-semibold uppercase text-gray-500">Key Responsibilities</Label>
                                            <textarea
                                                value={exp.responsibilities}
                                                onChange={(e) => updateExperience(index, 'responsibilities', e.target.value)}
                                                rows={3}
                                                className="flex w-full rounded-md border-2 border-gray-200 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-gray-400"
                                                placeholder="Briefly describe your role and achievements..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        onClick={() => setAction('save')}
                        className="w-full sm:w-auto bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    >
                        {isLoading && action === 'save' ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save'
                        )}
                    </Button>

                    {onNext && (
                        <Button
                            type="submit"
                            disabled={isLoading}
                            onClick={() => setAction('next')}
                            className="w-full sm:w-auto bg-gradient-to-r from-[#d5a22d] to-[#b89531] hover:from-[#b89531] hover:to-[#a07f2a] text-white"
                        >
                            {isLoading && action === 'next' ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Next'
                            )}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}
