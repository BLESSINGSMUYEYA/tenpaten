'use client';

const chips = [
    'Direct Admissions',
    'Scholarship Finder',
    'Secure Messaging',
    'Verified Institutions',
    'No Paperwork',
    'Track Your Application',
    'Browse All Programmes',
    'Apply From Anywhere',
    'Malawi-Wide Reach',
    'Smart Guidance',
];

// Duplicate for seamless loop
const allChips = [...chips, ...chips];

export function StatsBar() {
    return (
        <div className="bg-[#0f1030] border-y border-white/8 py-5 overflow-hidden relative select-none">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#0f1030] to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#0f1030] to-transparent pointer-events-none" />

            <div
                className="flex gap-4 w-max will-change-transform"
                style={{ animation: 'marquee-chips 30s linear infinite' }}
            >
                {allChips.map((chip, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/10 bg-white/4 whitespace-nowrap shrink-0"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d5a22d] shrink-0" />
                        <span className="text-white/50 text-[10px] font-black uppercase tracking-[0.25em]">
                            {chip}
                        </span>
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes marquee-chips {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
}
