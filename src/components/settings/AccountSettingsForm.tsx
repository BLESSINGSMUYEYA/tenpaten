'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, Camera, Loader2 } from 'lucide-react';

interface AccountSettingsFormProps {
    user: any;
}

export default function AccountSettingsForm({ user }: AccountSettingsFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [fullName, setFullName] = useState(user.fullName || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const formData = new FormData();
            formData.append('fullName', fullName);

            const response = await fetch('/api/settings/update-profile', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Profile updated successfully!');
                router.refresh();
            } else {
                setMessage(data.error || 'Failed to update profile');
            }
        } catch (error) {
            setMessage('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage('New passwords do not match');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const formData = new FormData();
            formData.append('currentPassword', currentPassword);
            formData.append('newPassword', newPassword);
            formData.append('confirmPassword', confirmPassword);

            const response = await fetch('/api/settings/change-password', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password changed successfully!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setMessage(data.error || 'Failed to change password');
            }
        } catch (error) {
            setMessage('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Profile Information */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Profile Information</h3>
                    <p className="text-sm text-gray-600">Update your account details</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-[#d5a22d]" />
                                    Full Name
                                </div>
                            </Label>
                            <Input
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="h-11 border-gray-200 focus-visible:ring-[#d5a22d] focus-visible:border-[#d5a22d]"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </div>
                            </Label>
                            <Input
                                id="email"
                                value={user.email}
                                disabled
                                className="h-11 border-2 bg-gray-50"
                            />
                            <p className="text-xs text-gray-500">Email cannot be changed</p>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto bg-[#d5a22d] hover:bg-[#b89531] text-white shadow-md transition-all active:scale-95"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </form>
            </div>

            <div className="border-t border-gray-200" />

            {/* Change Password */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Change Password</h3>
                    <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="currentPassword" className="text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-[#d5a22d]" />
                                    Current Password
                                </div>
                            </Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="h-11 border-gray-200 focus-visible:ring-[#d5a22d] focus-visible:border-[#d5a22d]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-sm font-medium">
                                New Password
                            </Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="h-11 border-gray-200 focus-visible:ring-[#d5a22d] focus-visible:border-[#d5a22d]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                Confirm New Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="h-11 border-gray-200 focus-visible:ring-[#d5a22d] focus-visible:border-[#d5a22d]"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                        className="w-full sm:w-auto bg-[#d5a22d] hover:bg-[#b89531] text-white shadow-md transition-all active:scale-95"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Changing...
                            </>
                        ) : (
                            'Change Password'
                        )}
                    </Button>
                </form>
            </div>

            {/* Message Display */}
            {message && (
                <div className={`p-4 rounded-lg text-sm ${message.includes('success')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {message}
                </div>
            )}
        </div>
    );
}
