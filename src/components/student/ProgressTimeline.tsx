'use client';

import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { ApplicationStatus } from '@prisma/client';

interface ProgressTimelineProps {
    currentStatus: ApplicationStatus;
    statusHistory?: Array<{
        status: ApplicationStatus;
        createdAt: Date;
        note?: string;
    }>;
}

const statusSteps = [
    { status: 'DRAFT' as ApplicationStatus, label: 'Draft', description: 'Application started' },
    { status: 'SUBMITTED' as ApplicationStatus, label: 'Submitted', description: 'Under review' },
    { status: 'COUNTRY_REVIEW' as ApplicationStatus, label: 'Country Review', description: 'Director reviewing' },
    { status: 'UNIVERSITY_REVIEW' as ApplicationStatus, label: 'University Review', description: 'University reviewing' },
    { status: 'OFFER_ISSUED' as ApplicationStatus, label: 'Offer Issued', description: 'Decision made' },
    { status: 'OFFER_ACCEPTED' as ApplicationStatus, label: 'Accepted', description: 'Offer accepted' },
    { status: 'ENROLLED' as ApplicationStatus, label: 'Enrolled', description: 'Successfully enrolled' },
];

export default function ProgressTimeline({ currentStatus, statusHistory }: ProgressTimelineProps) {
    const currentStepIndex = statusSteps.findIndex(step => step.status === currentStatus);
    const isRejected = currentStatus === 'REJECTED';

    if (isRejected) {
        return (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-red-900">Application Rejected</h4>
                        <p className="text-xs text-red-700">This application was not successful</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {statusSteps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isPending = index > currentStepIndex;

                return (
                    <div key={step.status} className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 pt-0.5">
                            {isCompleted ? (
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                </div>
                            ) : isCurrent ? (
                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center animate-pulse">
                                    <Clock className="w-4 h-4 text-indigo-600" />
                                </div>
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Circle className="w-4 h-4 text-gray-400" />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pb-4">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className={`text-sm font-semibold ${isCompleted ? 'text-green-900' :
                                        isCurrent ? 'text-indigo-900' :
                                            'text-gray-500'
                                    }`}>
                                    {step.label}
                                </h4>
                                {isCurrent && (
                                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
                                        Current
                                    </span>
                                )}
                            </div>
                            <p className={`text-xs ${isCompleted ? 'text-green-700' :
                                    isCurrent ? 'text-indigo-700' :
                                        'text-gray-500'
                                }`}>
                                {step.description}
                            </p>
                        </div>

                        {/* Connector line */}
                        {index < statusSteps.length - 1 && (
                            <div className={`absolute left-[11px] top-8 w-0.5 h-12 ${isCompleted ? 'bg-green-300' : 'bg-gray-200'
                                }`} style={{ marginTop: '0.125rem' }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
