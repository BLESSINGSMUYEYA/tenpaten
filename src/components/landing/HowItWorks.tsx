'use client';

import { motion } from 'framer-motion';
import { Search, PenLine, Globe2 } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Create Your Profile',
    desc: 'Complete your digital dossier and questionnaire to tell us about your academic dreams.',
    icon: Search,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50/50'
  },
  {
    number: '02',
    title: 'Smart Apply',
    desc: 'Discover programs that match your profile and apply to multiple universities with one click.',
    icon: PenLine,
    color: 'from-[#d5a22d] to-[#b88a24]',
    bgColor: 'bg-[#d5a22d]/5'
  },
  {
    number: '03',
    title: 'Track in Real-Time',
    desc: 'Monitor your application status live and receive instant notifications for offers and enrollment.',
    icon: Globe2,
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50/50'
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[#d5a22d] text-[10px] font-black tracking-[0.3em] mb-6 uppercase">
            How It Works
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-[#1a1b41] mb-6 tracking-tighter uppercase leading-[0.9]">
            Step by Step <span className="text-[#d5a22d]">Guide</span>
          </h2>
          <p className="text-[#1a1b41]/60 text-lg font-medium max-w-2xl mx-auto">
            A simple, streamlined process to take you from discovery to enrollment at your dream university.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute top-0 left-0 -mt-4 -ml-4 z-20">
                <div className="bg-[#1a1b41] text-white px-4 py-2 rounded-xl text-xs font-black tracking-widest shadow-xl flex flex-col items-center leading-none">
                  <span className="text-[10px] opacity-50 mb-1">STEP</span>
                  <span>{step.number}</span>
                </div>
              </div>

              <div className="h-full bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(26,27,65,0.05)] border border-gray-100 group-hover:border-[#d5a22d]/30 transition-all duration-500 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 ${step.bgColor} rounded-full -mr-16 -mt-16 blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700`} />
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-8 shadow-lg shadow-black/5 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-[#1a1b41] mb-4 uppercase tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-[#1a1b41]/60 font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-50 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#d5a22d]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1a1b41]/40">Verified Process</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
