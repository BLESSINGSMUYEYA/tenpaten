'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Users } from 'lucide-react';
import { TenpatenLogo } from '@/components/branding/TenpatenLogo';

import { LandingHero } from '@/components/landing/LandingHero';
import { UniversityShowcase } from '@/components/landing/UniversityShowcase';
import { RoleSelection } from '@/components/landing/RoleSelection';
import { UniversitySection } from '@/components/landing/UniversitySection';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { TestimonialSection } from '@/components/landing/TestimonialSection';

export default function Home() {
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <main className="min-h-screen selection:bg-[#d5a22d]/30 font-sans">
      {/* Navigation Bar with subtle texture */}
      <nav className="fixed top-0 left-0 right-0 z-50 overflow-hidden text-white shadow-2xl transition-all duration-500 border-b border-white/10">
        {/* Background Layer for Nav */}
        <div className="absolute inset-0 -z-10 bg-[#1a1b41]/90 backdrop-blur-xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 lg:h-24 flex items-center justify-between relative z-10">
          <TenpatenLogo variant="white" />

          <div className="hidden md:flex items-center gap-10">
            <Link href="#features" className="text-[11px] uppercase tracking-[0.25em] font-black text-white/70 hover:text-[#d5a22d] transition-all relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#d5a22d] transition-all group-hover:w-full"></span>
            </Link>
            <Link href="#roles" className="text-[11px] uppercase tracking-[0.25em] font-black text-white/70 hover:text-[#d5a22d] transition-all relative group">
              Roles
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#d5a22d] transition-all group-hover:w-full"></span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:inline-flex px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] font-black text-white hover:text-[#d5a22d] transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/register?type=student"
              className="hidden sm:inline-flex px-8 py-3 bg-[#d5a22d] text-[#36335e] rounded-xl text-[11px] uppercase tracking-[0.2em] font-black hover:bg-white hover:shadow-xl hover:shadow-[#d5a22d]/20 transition-all active:scale-95"
            >
              Get Started
            </Link>
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
              <div className="space-y-4">
                <Link
                  href="#features"
                  onClick={() => setMobileNav(false)}
                  className="group flex items-center gap-4 px-6 py-5 rounded-2xl bg-white/5 hover:bg-[#d5a22d] hover:text-[#36335e] transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#d5a22d] group-hover:bg-white/20 group-hover:text-[#36335e] transition-all">
                    <Menu className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest text-[#d5a22d] group-hover:text-[#36335e]">Features</p>
                    <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Platform Tools</p>
                  </div>
                </Link>

                <Link
                  href="#roles"
                  onClick={() => setMobileNav(false)}
                  className="group flex items-center gap-4 px-6 py-5 rounded-2xl bg-white/5 hover:bg-[#d5a22d] hover:text-[#36335e] transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#d5a22d] group-hover:bg-white/20 group-hover:text-[#36335e] transition-all">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest text-[#d5a22d] group-hover:text-[#36335e]">Roles</p>
                    <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Tailored Experience</p>
                  </div>
                </Link>
              </div>

              <div className="pt-8 mt-8 border-t border-white/5">
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/login"
                    className="flex items-center justify-center px-4 py-4 rounded-xl text-[10px] font-black text-white bg-white/5 hover:bg-white/10 transition-colors uppercase tracking-widest"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register?type=student"
                    className="flex items-center justify-center px-4 py-4 rounded-xl text-[10px] font-black text-[#36335e] bg-[#d5a22d] hover:bg-white transition-all shadow-lg shadow-[#d5a22d]/10 uppercase tracking-widest"
                  >
                    Join Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      <LandingHero />
      <UniversityShowcase />
      <RoleSelection />
      <UniversitySection />
      <FeaturesGrid />
      <TestimonialSection />

      {/* Footer */}
      <footer className="bg-[#1a1b41] py-24 lg:py-32 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#d5a22d_1px,transparent_1px)] [background-size:48px_48px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-16 mb-24">
            <div className="col-span-2 space-y-8">
              <TenpatenLogo variant="white" className="scale-110 origin-left" />
              <p className="text-white/50 max-w-sm leading-relaxed font-medium text-base">
                The world's most trusted ecosystem for international student recruitment. 
                We simplify complex admissions processes for students and global institutions.
              </p>
              <div className="flex items-center gap-4">
                {['Twitter', 'LinkedIn', 'Instagram', 'Facebook'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#d5a22d] hover:bg-[#d5a22d]/10 transition-all duration-300 text-[10px] font-black uppercase tracking-tighter">
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-white font-black uppercase tracking-widest text-xs">For Students</h4>
              <ul className="space-y-4 text-white/40 text-sm font-bold">
                <li><Link href="/register?type=student" className="hover:text-[#d5a22d] transition-colors">Apply to University</Link></li>
                <li><Link href="#features" className="hover:text-[#d5a22d] transition-colors">How it Works</Link></li>
                <li><Link href="/login" className="hover:text-[#d5a22d] transition-colors">Student Login</Link></li>
                <li><Link href="/scholarships" className="hover:text-[#d5a22d] transition-colors">Find Scholarships</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-white font-black uppercase tracking-widest text-xs">For Institutions</h4>
              <ul className="space-y-4 text-white/40 text-sm font-bold">
                <li><Link href="/school" className="hover:text-[#d5a22d] transition-colors">Partnership Overview</Link></li>
                <li><Link href="mailto:sales@tenpaten.com" className="hover:text-[#d5a22d] transition-colors">Contact Sales</Link></li>
                <li><Link href="/school" className="hover:text-[#d5a22d] transition-colors">Managed Onboarding</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-white font-black uppercase tracking-widest text-xs">Legal & Support</h4>
              <ul className="space-y-4 text-white/40 text-sm font-bold">
                <li><Link href="/privacy" className="hover:text-[#d5a22d] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#d5a22d] transition-colors">Terms of Service</Link></li>
                <li><Link href="/help" className="hover:text-[#d5a22d] transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-[#d5a22d] transition-colors">Get in Touch</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
              &copy; {new Date().getFullYear()} Tenpaten Apply. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="w-2 h-2 rounded-full bg-[#d5a22d] animate-pulse" />
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">System Status: Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
