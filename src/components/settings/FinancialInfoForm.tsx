'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleDollarSign, User, Phone, CheckCircle, Loader2 } from 'lucide-react';
import { updateFinancialInfo } from '@/lib/actions/profiles';
import { toast } from 'sonner';

interface FinancialInfoFormProps {
    user: any;
    onNext?: () => void;
}

export default function FinancialInfoForm({ user, onNext }: FinancialInfoFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [action, setAction] = useState<'save' | 'next'>('save');

    const financialInfo = user.financialInfo || {};
    const [formData, setFormData] = useState({
        fundingSource: financialInfo.fundingSource || '',
        sponsorName: financialInfo.sponsorName || '',
        sponsorRelationship: financialInfo.sponsorRelationship || '',
        sponsorContact: financialInfo.sponsorContact || '',
        requestFinancialAid: financialInfo.requestFinancialAid || false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await updateFinancialInfo(formData);
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
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Financial Information</h3>
                <p className="text-sm text-gray-600">
                    Tell us how you plan to fund your studies. This helps universities guide you to relevant scholarships.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fundingSource" className="text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <CircleDollarSign className="w-4 h-4" />
                                Primary Source of Funding
                            </div>
                        </Label>
                        <select
                            id="fundingSource"
                            value={formData.fundingSource}
                            onChange={(e) => setFormData({ ...formData, fundingSource: e.target.value })}
                            className="flex h-11 w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Select funding source</option>
                            <option value="self">Self-Funded</option>
                            <option value="parents">Parents / Family</option>
                            <option value="government">Government Sponsor</option>
                            <option value="scholarship">University Scholarship</option>
                            <option value="loan">Educational Loan</option>
                            <option value="employer">Employer Sponsored</option>
                        </select>
                    </div>

                    {(formData.fundingSource === 'parents' || formData.fundingSource === 'government' || formData.fundingSource === 'employer') && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-4">
                            <div className="space-y-2 col-span-full">
                                <h4 className="font-semibold text-gray-800 text-sm">Sponsor Details</h4>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sponsorName">Name of Sponsor</Label>
                                <Input
                                    id="sponsorName"
                                    value={formData.sponsorName}
                                    onChange={(e) => setFormData({ ...formData, sponsorName: e.target.value })}
                                    placeholder="Enter full name"
                                    className="h-10 border-gray-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sponsorRelationship">Relationship</Label>
                                <Input
                                    id="sponsorRelationship"
                                    value={formData.sponsorRelationship}
                                    onChange={(e) => setFormData({ ...formData, sponsorRelationship: e.target.value })}
                                    placeholder="e.g. Father, Employer"
                                    className="h-10 border-gray-200"
                                />
                            </div>
                            <div className="space-y-2 col-span-1 sm:col-span-2 md:col-span-1">
                                <Label htmlFor="sponsorContact">Contact Details</Label>
                                <Input
                                    id="sponsorContact"
                                    value={formData.sponsorContact}
                                    onChange={(e) => setFormData({ ...formData, sponsorContact: e.target.value })}
                                    placeholder="Email or Phone"
                                    className="h-10 border-gray-200"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center mt-0.5">
                            <input
                                type="checkbox"
                                checked={formData.requestFinancialAid}
                                onChange={(e) => setFormData({ ...formData, requestFinancialAid: e.target.checked })}
                                className="w-5 h-5 rounded border-2 border-gray-300 text-brand-accent focus:ring-brand-accent transition-colors peer"
                            />
                        </div>
                        <div>
                            <span className="text-sm font-semibold text-gray-900 group-hover:text-black">
                                I wish to be considered for Financial Aid / Scholarships
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                                By checking this box, universities that offer scholarships will automatically consider your profile.
                            </p>
                        </div>
                    </label>
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
                            className="w-full sm:w-auto bg-linear-to-r from-brand-accent to-[#b89531] hover:from-[#b89531] hover:to-[#a07f2a] text-white"
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
