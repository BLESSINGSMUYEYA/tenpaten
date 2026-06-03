'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { MANEB_SUBJECTS } from '@/lib/constants';
import { GraduationCap, Building2, TrendingUp, Award, Loader2 } from 'lucide-react';

import { updateAcademicInfo } from '@/lib/actions/profiles';
import { toast } from 'sonner';

interface AcademicInfoFormProps {
    user: any;
    onNext?: () => void;
}

export default function AcademicInfoForm({ user, onNext }: AcademicInfoFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [action, setAction] = useState<'save' | 'next'>('save');

    const academicInfo = user.academicInfo || {};
    const [formData, setFormData] = useState({
        highestQualification: academicInfo.highestQualification || '',
        institution: academicInfo.institution || '',
        fieldOfStudy: academicInfo.fieldOfStudy || '',
        graduationYear: academicInfo.graduationYear || '',
        gpa: academicInfo.gpa || '',
        testType: academicInfo.testType || '',
        testScore: academicInfo.testScore || '',
        testDate: academicInfo.testDate || '',
        examinationBoard: academicInfo.examinationBoard || '',
        bestSubjects: academicInfo.bestSubjects || [{ subject: 'English', points: '' }, { subject: '', points: '' }, { subject: '', points: '' }, { subject: '', points: '' }, { subject: '', points: '' }, { subject: '', points: '' }],
        ieltsScore: academicInfo.ieltsScore || '',
        toeflScore: academicInfo.toeflScore || '',
        pteScore: academicInfo.pteScore || '',
        disciplinaryHistory: academicInfo.disciplinaryHistory || '',
        desiredIntake: academicInfo.desiredIntake || '',
        studyMode: academicInfo.studyMode || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await updateAcademicInfo(formData);

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
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Academic Background</h3>
                <p className="text-sm text-gray-600">
                    Your educational history will be used in applications
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ... form fields ... */}
                {/* Education Details */}
                <div className="space-y-4">
                    <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Education
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="highestQualification" className="text-sm font-medium">
                                Highest Qualification
                            </Label>
                            <Select
                                value={formData.highestQualification}
                                onValueChange={(value) => setFormData({ ...formData, highestQualification: value })}
                            >
                                <SelectTrigger className="h-11 border-2">
                                    <SelectValue placeholder="Select qualification" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="high_school">Secondary School</SelectItem>
                                    <SelectItem value="diploma">Diploma</SelectItem>
                                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                                    <SelectItem value="masters">Master's Degree</SelectItem>
                                    <SelectItem value="phd">PhD</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="institution" className="text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    Institution Name
                                </div>
                            </Label>
                            <Input
                                id="institution"
                                value={formData.institution}
                                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                placeholder="e.g., Harvard University"
                                className="h-11 border-2"
                            />
                        </div>

                        {formData.highestQualification !== 'high_school' && (
                            <div className="space-y-2">
                                <Label htmlFor="fieldOfStudy" className="text-sm font-medium">
                                    Field of Study
                                </Label>
                                <Input
                                    id="fieldOfStudy"
                                    value={formData.fieldOfStudy}
                                    onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                                    placeholder="e.g., Computer Science"
                                    className="h-11 border-2"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="graduationYear" className="text-sm font-medium">
                                Graduation Year
                            </Label>
                            <Input
                                id="graduationYear"
                                type="number"
                                value={formData.graduationYear}
                                onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                                placeholder="2024"
                                min="1950"
                                max="2030"
                                className="h-11 border-2"
                            />
                        </div>

                        {formData.highestQualification !== 'high_school' && (
                            <div className="space-y-2">
                                <Label htmlFor="gpa" className="text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        GPA / Percentage
                                    </div>
                                </Label>
                                <Input
                                    id="gpa"
                                    value={formData.gpa}
                                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                                    placeholder="3.8 or 85%"
                                    className="h-11 border-2"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* High School Specific Details */}
                {formData.highestQualification === 'high_school' && (
                    <div className="border-t border-gray-200 pt-6 space-y-6">
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Examination Board <span className="text-red-500">*</span></Label>
                            <Select
                                value={formData.examinationBoard}
                                onValueChange={(value) => setFormData({ ...formData, examinationBoard: value })}
                            >
                                <SelectTrigger className="h-11 border-2">
                                    <SelectValue placeholder="Select examination board" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MSCE">MSCE (Malawi School Certificate of Education)</SelectItem>
                                    <SelectItem value="IGSCE">IGSCE (International General Certificate of Secondary Education)</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-base font-semibold">Best Six Subjects <span className="text-red-500">*</span></Label>
                                <span className="text-xs text-gray-500 font-medium">Please list your 6 strongest subjects</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-xl border-2 border-dashed border-gray-200">
                                {formData.bestSubjects.map((subject: any, index: number) => (
                                    <div key={index} className="flex gap-2">
                                        <div className="flex-1">
                                            <SearchableSelect
                                                options={MANEB_SUBJECTS}
                                                value={subject.subject ? MANEB_SUBJECTS.find(s => s.label === subject.subject)?.value || subject.subject : ''}
                                                onChange={(val) => {
                                                    const newSubjects = [...formData.bestSubjects];
                                                    const subjectLabel = MANEB_SUBJECTS.find(s => s.value === val)?.label || val;
                                                    newSubjects[index] = { ...newSubjects[index], subject: subjectLabel };
                                                    setFormData({ ...formData, bestSubjects: newSubjects });
                                                }}
                                                placeholder={`Subject ${index + 1}`}
                                                className="h-10 border-gray-300"
                                            />
                                        </div>
                                        <div className="w-24">
                                            <Input
                                                placeholder="Points"
                                                value={subject.points}
                                                onChange={(e) => {
                                                    const newSubjects = [...formData.bestSubjects];
                                                    newSubjects[index] = { ...newSubjects[index], points: e.target.value };
                                                    setFormData({ ...formData, bestSubjects: newSubjects });
                                                }}
                                                className="h-10 border-gray-300"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Test Scores */}
                {formData.examinationBoard !== 'MSCE' && (
                    <div className="border-t border-gray-200 pt-6 space-y-4">
                        <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            Standardized & English Tests
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="testType" className="text-sm font-medium">
                                    Test Type
                                </Label>
                                <Select
                                    value={formData.testType}
                                    onValueChange={(value) => setFormData({ ...formData, testType: value })}
                                >
                                    <SelectTrigger className="h-11 border-2">
                                        <SelectValue placeholder="Select test" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        <SelectItem value="toefl">TOEFL</SelectItem>
                                        <SelectItem value="ielts">IELTS</SelectItem>
                                        <SelectItem value="pte">PTE Academic</SelectItem>
                                        <SelectItem value="gre">GRE</SelectItem>
                                        <SelectItem value="gmat">GMAT</SelectItem>
                                        <SelectItem value="sat">SAT</SelectItem>
                                        <SelectItem value="act">ACT</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.testType !== 'none' && formData.testType !== '' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="testScore" className="text-sm font-medium">
                                            {formData.testType.toUpperCase()} Overall Score
                                        </Label>
                                        <Input
                                            id="testScore"
                                            value={formData.testScore}
                                            onChange={(e) => setFormData({ ...formData, testScore: e.target.value })}
                                            placeholder="e.g., 110, 7.5"
                                            className="h-11 border-2"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="testDate" className="text-sm font-medium">
                                            Test Date
                                        </Label>
                                        <Input
                                            id="testDate"
                                            type="date"
                                            value={formData.testDate}
                                            onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
                                            className="h-11 border-2"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Granular scores for English tests */}
                        {['ielts', 'toefl', 'pte'].includes(formData.testType) && (
                            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                                <div className="space-y-2 col-span-full">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Detailed Scores (Optional but Recommended)</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Listening</Label>
                                    <Input
                                        value={formData.testType === 'ielts' ? formData.ieltsScore : formData.testType === 'toefl' ? formData.toeflScore : formData.pteScore}
                                        onChange={(e) => {
                                            const field = formData.testType === 'ielts' ? 'ieltsScore' : formData.testType === 'toefl' ? 'toeflScore' : 'pteScore';
                                            setFormData({ ...formData, [field]: e.target.value });
                                        }}
                                        placeholder="Score"
                                        className="h-9"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 col-span-full italic">Note: Granular field names like 'ieltsScore' are used in our database to store your breakdown.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Enrollment Preferences */}
                <div className="border-t border-gray-200 pt-6 space-y-4">
                    <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Enrollment Preferences
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="desiredIntake" className="text-sm font-medium">Desired Intake / Semester</Label>
                            <Select
                                value={formData.desiredIntake}
                                onValueChange={(value) => setFormData({ ...formData, desiredIntake: value })}
                            >
                                <SelectTrigger className="h-11 border-2">
                                    <SelectValue placeholder="Select intake" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fall_2025">Fall 2025 (Sept/Oct)</SelectItem>
                                    <SelectItem value="winter_2026">Winter 2026 (Jan/Feb)</SelectItem>
                                    <SelectItem value="spring_2026">Spring 2026 (April/May)</SelectItem>
                                    <SelectItem value="fall_2026">Fall 2026 (Sept/Oct)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="studyMode" className="text-sm font-medium">Study Mode</Label>
                            <Select
                                value={formData.studyMode}
                                onValueChange={(value) => setFormData({ ...formData, studyMode: value })}
                            >
                                <SelectTrigger className="h-11 border-2">
                                    <SelectValue placeholder="Select mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="full_time">Full-time (On campus)</SelectItem>
                                    <SelectItem value="part_time">Part-time</SelectItem>
                                    <SelectItem value="online">Online / Distance Learning</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6 space-y-4">
                    <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Disciplinary Record
                    </h4>
                    <div className="space-y-2">
                        <Label htmlFor="disciplinaryHistory" className="text-sm font-medium">Have you ever been suspended, expelled, or placed on probation?</Label>
                        <select
                            id="disciplinaryHistory"
                            value={formData.disciplinaryHistory || 'no'}
                            onChange={(e) => setFormData({ ...formData, disciplinaryHistory: e.target.value })}
                            className="flex h-11 w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="no">No, I have no disciplinary history.</option>
                            <option value="yes">Yes, I have a disciplinary record.</option>
                        </select>
                        <p className="text-xs text-gray-400 italic">Universities require this transparency. Answering 'Yes' won't automatically disqualify you but may require an explanation.</p>
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
                <p className="text-xs text-gray-500 flex items-center">
                    This information will auto-fill in your future applications
                </p>
            </form>
        </div>
    );
}
