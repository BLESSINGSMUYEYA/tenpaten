'use client';

import { motion } from 'framer-motion';

const items = [
  'GLOBAL UNIVERSITY PARTNERSHIPS',
  'SMART PROGRAM MATCHING',
  'INSTANT VISA GUIDANCE',
  'SCHOLARSHIP ASSISTANCE',
  'VERIFIED ADMISSIONS'
];

export function Marquee() {
  return (
    <section className="py-6 bg-[#1a1b41] overflow-hidden relative border-y border-white/5">
      <div className="flex whitespace-nowrap">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: '-50%' }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="flex items-center gap-12 lg:gap-24 pr-12 lg:pr-24"
        >
          {/* First set */}
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-12 lg:gap-24">
              <span className="text-[10px] lg:text-xs font-black uppercase tracking-[0.4em] text-white/40 italic">
                {item}
              </span>
              <div className="w-2 h-2 rounded-full bg-brand-accent/40" />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {items.map((item, i) => (
            <div key={`dup-${i}`} className="flex items-center gap-12 lg:gap-24">
              <span className="text-[10px] lg:text-xs font-black uppercase tracking-[0.4em] text-white/40 italic">
                {item}
              </span>
              <div className="w-2 h-2 rounded-full bg-brand-accent/40" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
