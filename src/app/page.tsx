'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { TenpatenLogo } from '@/components/branding/TenpatenLogo';

import { LandingHero } from '@/components/landing/LandingHero';
import { StatsBar } from '@/components/landing/StatsBar';
import { FeatureRows } from '@/components/landing/FeatureRows';
import { TestimonialSection } from '@/components/landing/TestimonialSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { FinalCTABanner } from '@/components/landing/FinalCTABanner';

const navLinks = [
  { href: '/for-students', label: 'For Students' },
  { href: '/for-institutions', label: 'For Institutions' },
  { href: '/scholarships', label: 'Scholarships' },
];

export default function Home() {
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <main className="min-h-screen selection:bg-[#d5a22d]/30 font-sans">
      {/* ── Navigation Bar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 overflow-hidden text-white shadow-2xl transition-all duration-500 border-b border-white/10">
        {/* Background */}
        <div className="absolute inset-0 -z-10 bg-[#1a1b41]/95 backdrop-blur-xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 lg:h-24 flex items-center justify-between relative z-10">
          <TenpatenLogo variant="white" />

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] uppercase tracking-[0.25em] font-black text-white/60 hover:text-[#d5a22d] transition-all relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#d5a22d] transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right CTA */}
          <div className="flex items-center gap-4">
            {/* Platform live badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d5a22d] animate-pulse" />
              <span className="text-white/50 text-[9px] font-black uppercase tracking-[0.25em]">Live</span>
            </div>

            <Link
              href="/login"
              className="hidden sm:inline-flex px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] font-black text-white hover:text-[#d5a22d] transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/register?type=student"
              className="hidden sm:inline-flex px-8 py-3 bg-[#d5a22d] text-[#1a1b41] rounded-xl text-[11px] uppercase tracking-[0.2em] font-black hover:bg-white hover:shadow-xl hover:shadow-[#d5a22d]/20 transition-all active:scale-95"
            >
              Get Started
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileNav(!mobileNav)}
              className="md:hidden p-2.5 rounded-xl text-white hover:bg-white/10 transition-all border border-white/10"
              aria-label="Toggle menu"
            >
              {mobileNav ? <X className="w-5 h-5 text-[#d5a22d]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileNav && (
          <div className="md:hidden bg-[#1a1b41] border-t border-white/5 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 rounded-b-[2.5rem] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 py-10">
              <div className="space-y-2">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNav(false)}
                    className="flex items-center px-6 py-4 rounded-2xl bg-white/5 hover:bg-[#d5a22d] hover:text-[#1a1b41] transition-all duration-300 text-sm font-black uppercase tracking-widest text-white/70"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="pt-8 mt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                <Link
                  href="/login"
                  className="flex items-center justify-center px-4 py-4 rounded-xl text-[10px] font-black text-white bg-white/5 hover:bg-white/10 transition-colors uppercase tracking-widest"
                >
                  Sign In
                </Link>
                <Link
                  href="/register?type=student"
                  className="flex items-center justify-center px-4 py-4 rounded-xl text-[10px] font-black text-[#1a1b41] bg-[#d5a22d] hover:bg-white transition-all shadow-lg shadow-[#d5a22d]/10 uppercase tracking-widest"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ── Page Sections ── */}
      <LandingHero />
      <StatsBar />
      <FeatureRows />
      <TestimonialSection />
      <FAQSection />
      <FinalCTABanner />

      {/* ── Footer ── */}
      <footer className="bg-[#0f1030] py-24 lg:py-32 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#d5a22d_1px,transparent_1px)] [background-size:48px_48px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-16 mb-24">
            {/* Brand */}
            <div className="col-span-2 space-y-8">
              <TenpatenLogo variant="white" className="scale-110 origin-left" />
              <p className="text-white/40 max-w-sm leading-relaxed font-medium text-base">
                A proudly Malawian technology company committed to ensuring every student — from rural communities to urban centres like Lilongwe and Blantyre — has access to higher education opportunities.
              </p>
              <div className="flex items-center gap-3">
                {['T', 'L', 'I', 'F'].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-[#d5a22d] hover:bg-[#d5a22d]/10 hover:border-[#d5a22d]/30 transition-all duration-300 text-[10px] font-black"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>

            {/* For Students */}
            <div className="space-y-6">
              <h4 className="text-white font-black uppercase tracking-widest text-xs">For Students</h4>
              <ul className="space-y-4 text-white/35 text-sm font-bold">
                <li><Link href="/register?type=student" className="hover:text-[#d5a22d] transition-colors">Apply to University</Link></li>
                <li><Link href="#features" className="hover:text-[#d5a22d] transition-colors">How it Works</Link></li>
                <li><Link href="/login" className="hover:text-[#d5a22d] transition-colors">Student Login</Link></li>
                <li><Link href="/scholarships" className="hover:text-[#d5a22d] transition-colors">Find Scholarships</Link></li>
              </ul>
            </div>

            {/* For Institutions */}
            <div className="space-y-6">
              <h4 className="text-white font-black uppercase tracking-widest text-xs">For Institutions</h4>
              <ul className="space-y-4 text-white/35 text-sm font-bold">
                <li><Link href="/school" className="hover:text-[#d5a22d] transition-colors">Partnership Overview</Link></li>
                <li><Link href="mailto:sales@tenpaten.com" className="hover:text-[#d5a22d] transition-colors">Contact Sales</Link></li>
                <li><Link href="/school" className="hover:text-[#d5a22d] transition-colors">Managed Onboarding</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-6">
              <h4 className="text-white font-black uppercase tracking-widest text-xs">Legal &amp; Support</h4>
              <ul className="space-y-4 text-white/35 text-sm font-bold">
                <li><Link href="/privacy" className="hover:text-[#d5a22d] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#d5a22d] transition-colors">Terms of Service</Link></li>
                <li><Link href="/help" className="hover:text-[#d5a22d] transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-[#d5a22d] transition-colors">Get in Touch</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
              &copy; {new Date().getFullYear()} Tenpaten Apply. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="w-2 h-2 rounded-full bg-[#d5a22d] animate-pulse" />
              <span className="text-white/30 text-[10px] font-black uppercase tracking-widest">System Status: Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
