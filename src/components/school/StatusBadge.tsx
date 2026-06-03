import { ApplicationStatus } from '@prisma/client';

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; className: string }> = {
    DRAFT:            { label: 'Draft',            className: 'bg-gray-100 text-gray-500 border-gray-200' },
    PAYMENT_PENDING:  { label: 'Payment Pending',  className: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    SUBMITTED:        { label: 'Submitted',         className: 'bg-blue-50 text-blue-600 border-blue-100' },
    COUNTRY_REVIEW:   { label: 'Country Review',   className: 'bg-amber-50 text-amber-600 border-amber-100' },
    UNIVERSITY_REVIEW:{ label: 'Under Review',     className: 'bg-purple-50 text-purple-600 border-purple-100' },
    OFFER_ISSUED:     { label: 'Offer Issued',      className: 'bg-brand-accent/10 text-brand-accent border-brand-accent/20' },
    OFFER_ACCEPTED:   { label: 'Offer Accepted',   className: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    ENROLLED:         { label: 'Enrolled',          className: 'bg-brand-primary text-brand-accent border-brand-primary' },
    REJECTED:         { label: 'Not Accepted',      className: 'bg-red-50 text-red-600 border-red-100' },
};

interface StatusBadgeProps {
    status: ApplicationStatus | string;
    size?: 'sm' | 'md';
    showOverride?: boolean;
}

export function StatusBadge({ status, size = 'md', showOverride = false }: StatusBadgeProps) {
    const config = STATUS_CONFIG[status as ApplicationStatus] ?? {
        label: status.replace(/_/g, ' '),
        className: 'bg-gray-100 text-gray-500 border-gray-200',
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border font-black uppercase tracking-[0.15em] ${config.className} ${size === 'sm' ? 'px-2.5 py-1 text-[9px]' : 'px-4 py-1.5 text-[10px]'}`}
        >
            {showOverride && (
                <span title="Manual Override" className="text-current opacity-70">⚠</span>
            )}
            {config.label}
        </span>
    );
}
