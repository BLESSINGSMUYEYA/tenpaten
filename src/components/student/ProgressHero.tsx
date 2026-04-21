'use client';

import Link from 'next/link';
import { ArrowRight, Trophy, Target, TrendingUp } from 'lucide-react';
import AchievementBadge from './AchievementBadge';

type ProgressHeroProps = {
    progress: {
        currentMilestone: string;
        pointsToNext: number;
        nextMilestone: string;
        completionPercentage: number;
        badges: Array<{
            icon: any;
            label: string;
            color: 'blue' | 'purple' | 'green' | 'yellow' | 'indigo' | 'pink' | 'orange';
        }>;
    };
};

export default function ProgressHero({ progress }: ProgressHeroProps) {
    const hasProgress = progress.completionPercentage > 0;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 p-6 sm:p-8 lg:p-10 shadow-xl">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
                    <div className="flex-1">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                            {hasProgress
                                ? "You're closer than you think!"
                                : "Start Your Journey Today!"}
                        </h2>
                        {hasProgress ? (
                            <p className="text-base sm:text-lg text-white/90">
                                Just <span className="font-bold">{progress.pointsToNext} {progress.pointsToNext === 1 ? 'step' : 'steps'}</span> away from {progress.nextMilestone}!
                                <br className="hidden sm:block" />
                                <span className="text-sm text-white/80">
                                    Complete one more application or maintain your streak to boost your progress.
                                </span>
                            </p>
                        ) : (
                            <p className="text-base sm:text-lg text-white/90">
                                Begin your educational journey by submitting your first application.
                                <br className="hidden sm:block" />
                                <span className="text-sm text-white/80">
                                    Every great achievement starts with a single step!
                                </span>
                            </p>
                        )}
                    </div>

                    {/* CTA Button */}
                    <Link
                        href="/dashboard/apply"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-600 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
                    >
                        <span>Continue Applying</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                {/* Progress Bar */}
                {hasProgress && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-white/90">
                                {progress.currentMilestone}
                            </span>
                            <span className="text-sm font-bold text-white">
                                {progress.completionPercentage}%
                            </span>
                        </div>
                        <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                            <div
                                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-500 shadow-lg"
                                style={{ width: `${progress.completionPercentage}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Achievement Badges */}
                {progress.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {progress.badges.map((badge, index) => (
                            <AchievementBadge
                                key={index}
                                icon={badge.icon}
                                label={badge.label}
                                color={badge.color}
                                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                            />
                        ))}
                    </div>
                )}

                {/* Stats Row - Mobile Responsive */}
                {hasProgress && (
                    <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/20">
                        <div className="text-center">
                            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 rounded-full bg-white/20 backdrop-blur-sm">
                                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                                {progress.badges.length}
                            </div>
                            <div className="text-xs text-white/80">
                                Badges
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 rounded-full bg-white/20 backdrop-blur-sm">
                                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-green-300" />
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                                {progress.completionPercentage}%
                            </div>
                            <div className="text-xs text-white/80">
                                Complete
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 rounded-full bg-white/20 backdrop-blur-sm">
                                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300" />
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                                {progress.pointsToNext}
                            </div>
                            <div className="text-xs text-white/80">
                                To Next
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
