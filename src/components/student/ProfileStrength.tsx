'use client';

import { Target, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface ProfileField {
    name: string;
    completed: boolean;
    link?: string;
}

interface ProfileStrengthProps {
    completionPercentage: number;
    missingFields: ProfileField[];
}

export default function ProfileStrength({ completionPercentage, missingFields }: ProfileStrengthProps) {
    const getColorClass = (percentage: number) => {
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getStrokeColor = (percentage: number) => {
        if (percentage >= 80) return '#16a34a'; // green-600
        if (percentage >= 50) return '#ca8a04'; // yellow-600
        return '#dc2626'; // red-600
    };

    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

    return (
        <div className="rounded-xl bg-linear-to-br from-indigo-50 to-purple-50 border border-indigo-200 p-6 shadow-sm">
            <div className="flex items-start gap-4">
                {/* Circular Progress */}
                <div className="flex-shrink-0 relative">
                    <svg className="w-24 h-24 transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="48"
                            cy="48"
                            r={radius}
                            stroke="#e5e7eb"
                            strokeWidth="6"
                            fill="none"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="48"
                            cy="48"
                            r={radius}
                            stroke={getStrokeColor(completionPercentage)}
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className={`text-2xl font-bold ${getColorClass(completionPercentage)}`}>
                                {completionPercentage}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Profile Strength</h3>
                    </div>

                    {completionPercentage >= 80 ? (
                        <div className="flex items-start gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-3 border border-green-200">
                            <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p>
                                Excellent! Your profile is strong and ready for applications.
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-gray-600 mb-3">
                                Complete your profile to improve your chances of acceptance.
                            </p>

                            {missingFields.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-2">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span>Missing Information:</span>
                                    </div>
                                    <div className="space-y-1.5">
                                        {missingFields.slice(0, 3).map((field, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between gap-2 text-xs bg-white rounded-lg px-3 py-2 border border-gray-200"
                                            >
                                                <span className="text-gray-700">{field.name}</span>
                                                {field.link && (
                                                    <Link
                                                        href={field.link}
                                                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                                                    >
                                                        Add →
                                                    </Link>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {missingFields.length > 3 && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            +{missingFields.length - 3} more field{missingFields.length - 3 !== 1 ? 's' : ''}
                                        </p>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
