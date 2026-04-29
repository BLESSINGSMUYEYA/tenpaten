'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function LandingHero() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const encodedQuery = encodeURIComponent(searchQuery);
            const callbackUrl = encodeURIComponent(`/dashboard/colleges?q=${encodedQuery}`);
            router.push(`/register?type=student&callbackUrl=${callbackUrl}`);
        }
    };

    return (
        <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col justify-center min-h-screen selection:bg-[#d5a22d]/30">
            {/* Split Background: Dark left 1/3, Image right 2/3 */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Full dark base */}
                <div className="absolute inset-0 bg-[#1a1836]" />

                {/* Image panel — right 2/3 */}
                <motion.div
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                    className="absolute top-0 right-0 bottom-0 w-2/3"
                >
                    <Image
                        src="/images/hero/hero1.png"
                        alt="University campus"
                        fill
                        priority
                        className="object-cover object-center select-none"
                    />
                    {/* Blend gradient: left edge of image fades into dark */}
                    <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[#1a1836] to-transparent z-10" />
                    {/* Top vignette */}
                    <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[#1a1836]/50 to-transparent z-10" />
                    {/* Bottom vignette */}
                    <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#1a1836]/50 to-transparent z-10" />
                </motion.div>
            </div>

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex-1 flex flex-col justify-center">
                <div className="max-w-2xl text-left">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-white mb-6 tracking-tight leading-[1.1]"
                    >
                        Find your <br />
                        <span className="relative inline-block mt-2">
                            <span className="relative z-10">dream university.</span>
                            {/* Hand-drawn style SVG ellipse */}
                            <svg className="absolute w-[110%] h-[140%] -top-[20%] -left-[5%] z-0 pointer-events-none" viewBox="0 0 200 60" preserveAspectRatio="none">
                                <motion.path 
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                                    d="M20,30 C20,10 180,10 180,30 C180,50 20,50 20,30" 
                                    fill="none" 
                                    stroke="#d5a22d" 
                                    strokeWidth="3" 
                                    strokeDasharray="400"
                                    className="drop-shadow-[0_0_8px_rgba(213,162,45,0.6)]"
                                />
                            </svg>
                        </span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium leading-relaxed mb-10 max-w-xl"
                    >
                        Instantly match with top universities globally to find the program that was made for you, with one simplified application process.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="w-full max-w-xl mb-8"
                    >
                        {/* Search Bar matching the image */}
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 w-full">
                            <div className="relative flex-1 flex items-center bg-white rounded-2xl p-2 shadow-xl focus-within:ring-2 focus-within:ring-[#d5a22d] transition-all">
                                <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search universities..."
                                    className="w-full bg-transparent text-gray-800 placeholder:text-gray-400 px-3 py-3 outline-none text-base font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="p-2 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                                   <Search className="w-4 h-4 text-gray-500" />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="bg-[#d5a22d] text-[#1a1836] px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#ebd08c] transition-colors shadow-lg active:scale-95 shrink-0"
                            >
                                Search <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </motion.div>
                    
                    {/* Tags / Badges */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-wrap items-center gap-3 text-sm font-semibold text-white/80"
                    >
                        {['Scholarships', 'Engineering', 'Fast Track', 'Medicine'].map(tag => (
                            <button
                                key={tag}
                                onClick={() => {
                                    setSearchQuery(tag);
                                    // Optional: instantly search on tag click
                                    // const encodedQuery = encodeURIComponent(tag);
                                    // router.push(`/register?type=student&callbackUrl=/dashboard/colleges?q=${encodedQuery}`);
                                }}
                                className="px-5 py-2 rounded-full border border-white/30 hover:bg-white/10 hover:border-white transition-all"
                                type="button"
                            >
                                {tag}
                            </button>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Logo Ticker at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden bg-black/20 backdrop-blur-sm border-t border-white/10 py-6 z-20">
                <div className="flex w-max whitespace-nowrap animate-[marquee_20s_linear_infinite] items-center text-white/50 text-base md:text-lg font-black uppercase tracking-widest gap-24 px-12">
                     <span className="font-serif italic font-normal">Scholarships Available</span>
                     <span>FAST TRACK ADMISSIONS</span>
                     <span className="tracking-tighter font-extrabold">GLOBAL REACH</span>
                     <span>VERIFIED PROGRAMS</span>
                     <span>SECURE PROCESS</span>
                     {/* Duplicate for seamless loop */}
                     <span className="font-serif italic font-normal">Scholarships Available</span>
                     <span>FAST TRACK ADMISSIONS</span>
                     <span className="tracking-tighter font-extrabold">GLOBAL REACH</span>
                     <span>VERIFIED PROGRAMS</span>
                     <span>SECURE PROCESS</span>
                     {/* Additional duplicates to ensure w-max spans the screen */}
                     <span className="font-serif italic font-normal">Scholarships Available</span>
                     <span>FAST TRACK ADMISSIONS</span>
                     <span className="tracking-tighter font-extrabold">GLOBAL REACH</span>
                     <span>VERIFIED PROGRAMS</span>
                     <span>SECURE PROCESS</span>
                     <span className="font-serif italic font-normal">Scholarships Available</span>
                     <span>FAST TRACK ADMISSIONS</span>
                     <span className="tracking-tighter font-extrabold">GLOBAL REACH</span>
                     <span>VERIFIED PROGRAMS</span>
                     <span>SECURE PROCESS</span>
                </div>
            </div>


            {/* Add global CSS for the marquee animation inline or it needs to be in tailwind config */}
            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </section>
    );
}
