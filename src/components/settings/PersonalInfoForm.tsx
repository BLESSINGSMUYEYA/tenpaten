'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Phone, CreditCard, Globe, Loader2, User, Stethoscope, Briefcase } from 'lucide-react';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { COUNTRIES } from '@/lib/constants';

import { updatePersonalInfo } from '@/lib/actions/profiles';
import { toast } from 'sonner';

interface PersonalInfoFormProps {
    user: any;
    onNext?: () => void;
    countries?: any[];
}

export default function PersonalInfoForm({ user, onNext, countries = [] }: PersonalInfoFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [action, setAction] = useState<'save' | 'next'>('save');

    const personalInfo = user.personalInfo || {};
    const [formData, setFormData] = useState({
        dateOfBirth: personalInfo.dateOfBirth || '',
        nationality: personalInfo.nationality || '',
        passportNumber: personalInfo.passportNumber || '',
        passportIssueDate: personalInfo.passportIssueDate || '',
        passportExpiryDate: personalInfo.passportExpiryDate || '',
        phone: personalInfo.phone || '',
        address: personalInfo.address || '',
        city: personalInfo.city || '',
        country: personalInfo.country || '',
        residenceCountryId: user.residenceCountryId || '',
        postalCode: personalInfo.postalCode || '',
        gender: personalInfo.gender || '',
        maritalStatus: personalInfo.maritalStatus || '',
        placeOfBirth: personalInfo.placeOfBirth || '',
        nativeLanguage: personalInfo.nativeLanguage || '',
        visaStatus: personalInfo.visaStatus || '',
        medicalConditions: personalInfo.medicalConditions || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await updatePersonalInfo(formData);

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
                {/* ... header ... */}
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Personal Information</h3>
                <p className="text-sm text-gray-600">
                    This information will be used to auto-fill your applications
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ... form fields ... */}
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Date of Birth
                            </div>
                        </Label>
                        <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            className="h-11 border-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nationality" className="text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                Nationality
                                <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                            </div>
                        </Label>
                        <SearchableSelect
                            value={formData.nationality}
                            onChange={(val) => setFormData({ ...formData, nationality: val })}
                            options={COUNTRIES}
                            placeholder="Select nationality"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="gender" className="text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Gender
                            </div>
                        </Label>
                        <select
                            id="gender"
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="flex h-11 w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other / Prefer not to say</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="maritalStatus" className="text-sm font-medium">
                           Marital Status
                        </Label>
                        <select
                            id="maritalStatus"
                            value={formData.maritalStatus}
                            onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                            className="flex h-11 w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="">Select Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="placeOfBirth" className="text-sm font-medium">Place of Birth (City, Country)</Label>
                        <Input
                            id="placeOfBirth"
                            value={formData.placeOfBirth}
                            onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                            placeholder="e.g. London, UK"
                            className="h-11 border-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nativeLanguage" className="text-sm font-medium">Native Language</Label>
                        <Input
                            id="nativeLanguage"
                            value={formData.nativeLanguage}
                            onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                            placeholder="e.g. English, Arabic, Hindi"
                            className="h-11 border-2"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                Phone Number
                            </div>
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+1 234 567 8900"
                            className="h-11 border-2"
                        />
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Passport & Visa Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="passportNumber" className="text-sm font-medium">Passport Number</Label>
                            <Input
                                id="passportNumber"
                                value={formData.passportNumber}
                                onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                                placeholder="Enter passport number"
                                className="h-11 border-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="passportIssueDate" className="text-sm font-medium">Date of Issue</Label>
                            <Input
                                id="passportIssueDate"
                                type="date"
                                value={formData.passportIssueDate}
                                onChange={(e) => setFormData({ ...formData, passportIssueDate: e.target.value })}
                                className="h-11 border-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="passportExpiryDate" className="text-sm font-medium">Expiry Date</Label>
                            <Input
                                id="passportExpiryDate"
                                type="date"
                                value={formData.passportExpiryDate}
                                onChange={(e) => setFormData({ ...formData, passportExpiryDate: e.target.value })}
                                className="h-11 border-2"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-3">
                            <Label htmlFor="visaStatus" className="text-sm font-medium">Do you currently hold any Student Visas?</Label>
                            <Input
                                id="visaStatus"
                                value={formData.visaStatus}
                                onChange={(e) => setFormData({ ...formData, visaStatus: e.target.value })}
                                placeholder="E.g. Valid US F1 Visa, UK Tier 4, None"
                                className="h-11 border-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Address Information */}
                <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Address
                    </h4>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-sm font-medium">
                                Street Address
                            </Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="123 Main Street, Apt 4B"
                                className="h-11 border-2"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city" className="text-sm font-medium">
                                    City
                                </Label>
                                <Input
                                    id="city"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    placeholder="New York"
                                    className="h-11 border-2"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="country" className="text-sm font-medium">
                                    Country of Residence
                                </Label>
                                <SearchableSelect
                                    value={formData.residenceCountryId}
                                    onChange={(val) => setFormData({ ...formData, residenceCountryId: val })}
                                    options={countries.map(c => ({ value: c.id, label: c.name }))}
                                    placeholder="Select country"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="postalCode" className="text-sm font-medium">
                                    Postal Code
                                </Label>
                                <Input
                                    id="postalCode"
                                    value={formData.postalCode}
                                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                    placeholder="10001"
                                    className="h-11 border-2"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Stethoscope className="w-4 h-4" />
                        Health & Special Requirements
                    </h4>
                    <div className="space-y-2">
                        <Label htmlFor="medicalConditions" className="text-sm font-medium">
                            Do you have any medical conditions, disabilities, or special needs?
                        </Label>
                        <Input
                            id="medicalConditions"
                            value={formData.medicalConditions}
                            onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                            placeholder="Please specify any accommodations you might need (or write 'None')"
                            className="h-11 border-2"
                        />
                        <p className="text-xs text-gray-400">This helps universities prepare appropriate support and accommodations for your studies.</p>
                    </div>
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
                <p className="text-xs text-gray-500 flex items-center">
                    This information will auto-fill in your future applications
                </p>
            </form>
        </div>
    );
}
