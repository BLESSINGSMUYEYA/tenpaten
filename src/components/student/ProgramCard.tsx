'use client';

import Link from 'next/link';
import { Building2, GraduationCap, ArrowRight, MapPin, Wallet, Clock, Calendar } from 'lucide-react';

type ProgramCardProps = {
    program: {
        id: string;
        name: string;
        baseTuition?: number | null;
        scholarshipPercentage?: number | null;
        duration?: string | null;
        level?: string | null;
        intake?: string | null;
        requirements?: string | null;
        university: {
            id: string;
            name: string;
            country?: {
                currencySymbol: string;
            };
        };
        school?: {
            id: string;
            name: string;
        } | null;
    };
};

export default function ProgramCard({ program }: ProgramCardProps) {
    const currencySym = program.university.country?.currencySymbol || '$';

    return (
        <div className="group relative overflow-hidden rounded-xl bg-white border-2 border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="p-5 sm:p-6">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-7 h-7 text-indigo-600" />
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors min-h-[3.5rem]">
                    {program.name}
                </h3>

                <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="w-4 h-4 flex-shrink-0 text-indigo-400" />
                        <span className="truncate font-medium">{program.university.name}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100">
                        {program.level && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                                <span className="truncate">{program.level}</span>
                            </div>
                        )}
                        {program.duration && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                <span className="truncate">{program.duration}</span>
                            </div>
                        )}
                        {program.intake && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                <span className="truncate">{program.intake}</span>
                            </div>
                        )}
                        {program.baseTuition ? (
                            program.scholarshipPercentage && program.scholarshipPercentage > 0 ? (
                                <div className="col-span-2 flex items-center gap-3 text-xs font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                                    <Wallet className="w-4 h-4 text-emerald-500" />
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 line-through text-[10px]">{currencySym}{program.baseTuition.toLocaleString()}</span>
                                        <span className="text-emerald-700 text-sm">
                                            {currencySym}{(program.baseTuition * (1 - program.scholarshipPercentage / 100)).toLocaleString()}
                                        </span>
                                    </div>
                                    <span className="ml-auto bg-emerald-500 text-white px-2 py-1 rounded-full text-[10px] animate-pulse">
                                        {program.scholarshipPercentage}% OFF
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                    <Wallet className="w-3.5 h-3.5 text-gray-500" />
                                    <span className="truncate">{currencySym}{program.baseTuition.toLocaleString()}</span>
                                </div>
                            )
                        ) : (
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 italic">
                                <Wallet className="w-3.5 h-3.5 text-gray-300" />
                                <span className="truncate">Pricing Unavailable</span>
                            </div>
                        )}
                    </div>

                    {program.school && (
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-wider font-semibold pt-1">
                            <span className="truncate">{program.school.name}</span>
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2">
                    <Link
                        href={`/dashboard/programs/${program.id}`}
                        className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg border-2 border-indigo-100 text-indigo-600 font-bold text-sm hover:bg-indigo-50 transition-all"
                    >
                        View Details
                    </Link>
                    <Link
                        href={`/dashboard/apply?programId=${program.id}`}
                        className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                    >
                        <span>Apply Now</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Decorative gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none" />
        </div>
    );
}
