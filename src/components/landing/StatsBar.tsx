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
        <div className="bg-[#0f1030] border-y border-white/5 py-8 overflow-hidden relative select-none">
            {/* Background pattern */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#d5a22d 1px, transparent 1px)', backgroundSize: '48px 48px' }}
            />

            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-[#0f1030] to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-[#0f1030] to-transparent pointer-events-none" />

            <div
                className="flex gap-6 w-max will-change-transform"
                style={{ animation: 'marquee-chips 40s linear infinite' }}
            >
                {allChips.map((chip, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 px-6 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl whitespace-nowrap shrink-0 group hover:border-[#d5a22d]/30 transition-colors"
                    >
                        <div className="w-2 h-2 rounded-full bg-[#d5a22d] shadow-[0_0_10px_rgba(213,162,45,0.5)] shrink-0" />
                        <span className="text-white/60 text-[11px] font-black uppercase tracking-[0.3em] group-hover:text-white transition-colors">
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
