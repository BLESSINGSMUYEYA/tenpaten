'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Globe } from 'lucide-react';
import { TenpatenLogo } from '@/components/branding/TenpatenLogo';

import { LandingHero } from '@/components/landing/LandingHero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Marquee } from '@/components/landing/Marquee';
import { UniversitySection } from '@/components/landing/UniversitySection';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { TestimonialSection } from '@/components/landing/TestimonialSection';

export default function Home() {
  const [mobileNav, setMobileNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen selection:bg-[#d5a22d]/30 font-sans bg-white relative">
      {/* Background Grid & Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#1a1b41 1px, transparent 1px), linear-gradient(90deg, #1a1b41 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#36335e]/10 via-purple-100/20 to-transparent blur-[120px] rounded-full" />
      </div>

      {/* Floating Pill Navigation */}
      <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl transition-all duration-500 ${scrolled ? 'top-4 scale-95' : 'top-6'}`}>
        <div className="bg-[#1a1b41] rounded-full px-6 py-3 lg:px-8 lg:py-4 flex items-center justify-between shadow-[0_20px_50px_rgba(26,27,65,0.3)] border border-white/10 backdrop-blur-md">
          <TenpatenLogo variant="white" className="scale-90 lg:scale-100" />

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {['Pricing', 'FAQs', 'Blog', 'Contact Us'].map((item) => (
              <Link 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-[10px] uppercase tracking-[0.2em] font-black text-white/70 hover:text-white transition-all"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 lg:gap-4">
            <Link
              href="/login"
              className="hidden sm:inline-flex px-6 py-2.5 bg-white text-[#1a1b41] rounded-full text-[10px] uppercase tracking-[0.2em] font-black hover:bg-[#d5a22d] transition-all active:scale-95"
            >
              Sign In
            </Link>

            <button
              onClick={() => setMobileNav(!mobileNav)}
              className="md:hidden p-2 rounded-full text-white hover:bg-white/10 transition-all"
            >
              {mobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileNav && (
          <div className="md:hidden mt-4 bg-[#1a1b41] rounded-3xl p-6 border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-4">
            <div className="space-y-4">
              {['Pricing', 'FAQs', 'Blog', 'Contact Us'].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setMobileNav(false)}
                  className="block text-white/70 text-sm font-bold uppercase tracking-widest hover:text-[#d5a22d]"
                >
                  {item}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10">
                <Link
                  href="/login"
                  className="block w-full text-center py-4 bg-white text-[#1a1b41] rounded-2xl font-black uppercase tracking-widest text-xs"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="relative z-10">
        <LandingHero />
        <HowItWorks />
        <Marquee />
        <UniversitySection />
        <FeaturesGrid />
        <TestimonialSection />
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-12 sm:gap-16 lg:gap-24 mb-20">
            <div className="col-span-1 md:col-span-2 space-y-8 text-center sm:text-left">
              <TenpatenLogo variant="navy" className="mx-auto sm:mx-0" />
              <p className="text-[#1a1b41]/60 max-w-sm leading-relaxed font-medium text-lg mx-auto sm:mx-0">
                Connecting talented students with world-class educational opportunities globally.
              </p>
            </div>

            <div className="space-y-6 text-center sm:text-left">
              <h4 className="text-[#1a1b41] font-black uppercase tracking-widest text-sm mb-6">Platform</h4>
              <ul className="space-y-4 text-[#1a1b41]/60 font-bold">
                <li><Link href="#" className="hover:text-[#d5a22d] transition-colors">How it Works</Link></li>
                <li><Link href="/register?type=student" className="hover:text-[#d5a22d] transition-colors">For Students</Link></li>
                <li><Link href="/contact" className="hover:text-[#d5a22d] transition-colors">For Partners</Link></li>
              </ul>
            </div>

            <div className="space-y-6 text-center sm:text-left">
              <h4 className="text-[#1a1b41] font-black uppercase tracking-widest text-sm mb-6">Legal</h4>
              <ul className="space-y-4 text-[#1a1b41]/60 font-bold">
                <li><Link href="/privacy" className="hover:text-[#d5a22d] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#d5a22d] transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-gray-100 text-center">
            <p className="text-[#1a1b41]/40 text-sm font-black uppercase tracking-[0.3em]">
              &copy; {new Date().getFullYear()} Tenpaten Apply. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
