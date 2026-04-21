'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Trophy, Bike, Loader2, Heart } from 'lucide-react';

import { updateActivitiesInfo } from '@/lib/actions/profiles';
import { toast } from 'sonner';

interface ActivitiesInfoFormProps {
    user: any;
    onNext?: () => void;
}

export default function ActivitiesInfoForm({ user, onNext }: ActivitiesInfoFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [action, setAction] = useState<'save' | 'next'>('save');

    const activitiesInfo = user.activitiesInfo || {};
    const [formData, setFormData] = useState({
        extracurriculars: activitiesInfo.extracurriculars || '',
        achievements: activitiesInfo.achievements || '',
        volunteerWork: activitiesInfo.volunteerWork || '',
        hobbies: activitiesInfo.hobbies || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await updateActivitiesInfo(formData);

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
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Activities & Achievements</h3>
                <p className="text-sm text-gray-600">
                    Tell us about your life outside of academics
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="extracurriculars" className="text-sm font-medium flex items-center gap-2">
                            <Bike className="w-4 h-4" />
                            Extracurricular Activities
                        </Label>
                        <Textarea
                            id="extracurriculars"
                            value={formData.extracurriculars}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, extracurriculars: e.target.value })}
                            placeholder="e.g., Sports, Music, Debate Club..."
                            className="min-h-[100px] border-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="achievements" className="text-sm font-medium flex items-center gap-2">
                            <Trophy className="w-4 h-4" />
                            Key Achievements & Awards
                        </Label>
                        <Textarea
                            id="achievements"
                            value={formData.achievements}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, achievements: e.target.value })}
                            placeholder="e.g., First place in Science Fair, Sports Captain..."
                            className="min-h-[100px] border-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="volunteerWork" className="text-sm font-medium flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            Volunteer & Community Work
                        </Label>
                        <Textarea
                            id="volunteerWork"
                            value={formData.volunteerWork}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, volunteerWork: e.target.value })}
                            placeholder="Describe any volunteer roles you've held..."
                            className="min-h-[100px] border-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="hobbies" className="text-sm font-medium flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Hobbies & Interests
                        </Label>
                        <Input
                            id="hobbies"
                            value={formData.hobbies}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, hobbies: e.target.value })}
                            placeholder="e.g., Reading, traveling, coding"
                            className="h-11 border-2"
                        />
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
