'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ReferralTrackerContent() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const referralCode = searchParams.get('ref');
        const source = searchParams.get('src');

        if (referralCode) {
            // Set cookie for 30 days
            const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
            
            // Store referral code
            document.cookie = `tenpaten_ref=${referralCode}; expires=${expires}; path=/; SameSite=Lax`;
            
            // Store source if available
            if (source) {
                document.cookie = `tenpaten_ref_src=${source}; expires=${expires}; path=/; SameSite=Lax`;
            }

            // Also backup to localStorage for redundancy (sometimes cookies are blocked)
            localStorage.setItem('tenpaten_ref', referralCode);
            if (source) {
                localStorage.setItem('tenpaten_ref_src', source);
            }

            console.log('Referral tracked:', { referralCode, source });
        }
    }, [searchParams]);

    return null;
}

export default function ReferralTracker() {
    return (
        <Suspense fallback={null}>
            <ReferralTrackerContent />
        </Suspense>
    );
}
