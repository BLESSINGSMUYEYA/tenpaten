'use client';

import React from 'react';
import ApplicationCard from './ApplicationCard';
import { ApplicationStatus } from '@/components/common/StatusPipeline';

type Application = {
    id: string;
    programId: string;
    status: ApplicationStatus | string; // Loosen type for safe mapping but provide union for intellisense
    createdAt: Date;
    updatedAt: Date;
    program: {
        name: string;
        university: {
            name: string;
        };
    };
};

interface ApplicationsListProps {
    applications: Application[];
}

export default function ApplicationsList({ applications }: ApplicationsListProps) {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-xl font-black text-[#1d1b41] tracking-tight">
                        My Applications
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <span className="text-[#1d1b41]">{applications.length}</span> active pursuits found
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.map((app, i) => (
                    <div 
                        key={app.id} 
                        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <ApplicationCard application={app as any} showProgress={true} />
                    </div>
                ))}
            </div>
        </div>
    );
}
