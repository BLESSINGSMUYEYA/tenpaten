'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const floatingImages = [
  { src: '/images/hero/student1.png', top: '15%', left: '5%', size: 'w-24 h-24 lg:w-32 lg:h-32' },
  { src: '/images/hero/student2.png', top: '25%', left: '20%', size: 'w-16 h-16 lg:w-20 lg:h-20' },
  { src: '/images/hero/student3.png', top: '40%', left: '10%', size: 'w-20 h-20 lg:w-24 lg:h-24' },
  { src: '/images/hero/hero1.png', top: '15%', right: '5%', size: 'w-28 h-28 lg:w-36 lg:h-36' },
  { src: '/images/hero/hero2.png', top: '35%', right: '15%', size: 'w-20 h-20 lg:w-24 lg:h-24' },
  { src: '/images/hero/hero3.png', top: '50%', right: '8%', size: 'w-16 h-16 lg:w-20 lg:h-20' },
];

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
        <section className="relative pt-44 pb-32 lg:pt-64 lg:pb-48 overflow-hidden flex flex-col justify-center items-center text-center">
            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-linear-to-br from-indigo-100/50 via-purple-50/30 to-transparent blur-[120px] rounded-full opacity-60" />
            </div>

            {/* Floating Avatars matching the image style */}
            <div className="absolute inset-0 pointer-events-none hidden lg:block">
              {floatingImages.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                  className={`absolute rounded-full border-4 border-white shadow-2xl overflow-hidden ${img.size}`}
                  style={{ top: img.top, left: img.left, right: img.right }}
                >
                  <Image src={img.src} alt="Student" fill className="object-cover" />
                </motion.div>
              ))}
            </div>

            <div className="w-full max-w-4xl mx-auto px-4 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-3xl md:text-4xl lg:text-[4rem] font-black text-[#1a1b41] mb-8 tracking-tighter uppercase leading-[0.95] text-balance">
                    Redefine Your <br />
                    <span className="text-brand-accent">Education</span> <br />
                    Experience
                  </h1>

                  <p className="text-lg md:text-xl text-[#1a1b41]/60 font-medium leading-relaxed mb-12 max-w-2xl mx-auto text-balance">
                    Connect with top-tier universities instantly. Let our advanced platform discover the perfect visual, product, and academic matches for your career.
                  </p>
                </motion.div>

                {/* Centered Search Bar matching the image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="max-w-2xl mx-auto"
                >
                  <form onSubmit={handleSearch} className="relative group">
                    <div className="flex flex-col sm:flex-row items-center bg-white rounded-[2rem] p-2 lg:p-3 shadow-[0_30px_60px_rgba(26,27,65,0.12)] border border-gray-100 group-focus-within:border-brand-accent/50 transition-all duration-500">
                      <div className="flex-1 flex items-center px-6 py-2">
                        <Search className="w-5 h-5 text-gray-400 mr-4 shrink-0" />
                        <input
                          type="text"
                          placeholder="Search programs, universities or countries..."
                          className="w-full bg-transparent text-[#1a1b41] placeholder:text-gray-400 py-3 outline-none text-base font-bold tracking-tight"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-brand-primary text-white px-8 py-4 lg:px-10 rounded-2xl lg:rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-brand-accent transition-all shadow-xl shadow-brand-primary/20 active:scale-95"
                      >
                        <Sparkles className="w-4 h-4" />
                        Search Programs
                      </button>
                    </div>
                  </form>

                  {/* Supporting Text */}
                  <div className="mt-6 flex flex-wrap justify-center items-center gap-6 text-[10px] font-black uppercase tracking-widest text-[#1a1b41]/40">
                    <span>500+ Universities</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>Global Recognition</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>Fast Track Admissions</span>
                  </div>
                </motion.div>
            </div>
        </section>
    );
}
