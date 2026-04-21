'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Heart, Phone, ShieldCheck, Loader2 } from 'lucide-react';

import { updateFamilyInfo } from '@/lib/actions/profiles';
import { toast } from 'sonner';

interface FamilyInfoFormProps {
    user: any;
    onNext?: () => void;
}

export default function FamilyInfoForm({ user, onNext }: FamilyInfoFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [action, setAction] = useState<'save' | 'next'>('save');

    const familyInfo = user.familyInfo || {};
    const [formData, setFormData] = useState({
        fatherName: familyInfo.fatherName || '',
        fatherOccupation: familyInfo.fatherOccupation || '',
        fatherMobile: familyInfo.fatherMobile || '',
        motherName: familyInfo.motherName || '',
        motherOccupation: familyInfo.motherOccupation || '',
        motherMobile: familyInfo.motherMobile || '',
        emergencyContactName: familyInfo.emergencyContactName || '',
        emergencyContactRelation: familyInfo.emergencyContactRelation || '',
        emergencyContactPhone: familyInfo.emergencyContactPhone || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await updateFamilyInfo(formData);

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
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Family Information</h3>
                <p className="text-sm text-gray-600">
                    Details about your parents and emergency contacts
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Parents' Details */}
                <div className="space-y-4">
                    <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Parents' Details
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fatherName" className="text-sm font-medium">Father's Full Name</Label>
                            <Input
                                id="fatherName"
                                value={formData.fatherName}
                                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                                placeholder="Enter father's name"
                                className="h-11 border-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fatherOccupation" className="text-sm font-medium">Father's Occupation</Label>
                            <Input
                                id="fatherOccupation"
                                value={formData.fatherOccupation}
                                onChange={(e) => setFormData({ ...formData, fatherOccupation: e.target.value })}
                                placeholder="e.g., Engineer"
                                className="h-11 border-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fatherMobile" className="text-sm font-medium">Father's Mobile Number</Label>
                            <Input
                                id="fatherMobile"
                                type="tel"
                                value={formData.fatherMobile}
                                onChange={(e) => setFormData({ ...formData, fatherMobile: e.target.value })}
                                placeholder="e.g., +1234567890"
                                className="h-11 border-2"
                            />
                        </div>

                        <div className="hidden md:block"></div> {/* Spacer to align grid properly if needed, or just let it flow */}

                        <div className="space-y-2">
                            <Label htmlFor="motherName" className="text-sm font-medium">Mother's Full Name</Label>
                            <Input
                                id="motherName"
                                value={formData.motherName}
                                onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                                placeholder="Enter mother's name"
                                className="h-11 border-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="motherOccupation" className="text-sm font-medium">Mother's Occupation</Label>
                            <Input
                                id="motherOccupation"
                                value={formData.motherOccupation}
                                onChange={(e) => setFormData({ ...formData, motherOccupation: e.target.value })}
                                placeholder="e.g., Doctor"
                                className="h-11 border-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="motherMobile" className="text-sm font-medium">Mother's Mobile Number</Label>
                            <Input
                                id="motherMobile"
                                type="tel"
                                value={formData.motherMobile}
                                onChange={(e) => setFormData({ ...formData, motherMobile: e.target.value })}
                                placeholder="e.g., +1234567890"
                                className="h-11 border-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className="border-t border-gray-200 pt-6 space-y-4">
                    <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        Emergency Contact
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="emergencyContactName" className="text-sm font-medium">Contact Name</Label>
                            <Input
                                id="emergencyContactName"
                                value={formData.emergencyContactName}
                                onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                                className="h-11 border-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emergencyContactRelation" className="text-sm font-medium">
                                Relation
                                <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                            </Label>
                            <Input
                                id="emergencyContactRelation"
                                value={formData.emergencyContactRelation}
                                onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                                placeholder="e.g., Brother, Aunt"
                                className="h-11 border-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emergencyContactPhone" className="text-sm font-medium">Phone Number</Label>
                            <Input
                                id="emergencyContactPhone"
                                type="tel"
                                value={formData.emergencyContactPhone}
                                onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                                className="h-11 border-2"
                            />
                        </div>
                    </div>
                </div>


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
