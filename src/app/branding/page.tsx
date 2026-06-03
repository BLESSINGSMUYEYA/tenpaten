import React from 'react';
import { TenpatenIcon, TenpatenLogo } from '@/components/branding/TenpatenLogo';

export default function BrandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 p-10 font-sans space-y-12">
            <div className="max-w-4xl mx-auto space-y-4">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Brand Identity</h1>
                <p className="text-slate-500 text-lg">
                    Core verification of the transparency, scalability, and color adaptability of the new vector logo system.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Light Mode Card */}
                <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-8 min-h-[300px]">
                    <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-auto">Light Background</h3>

                    <div className="flex flex-col items-center gap-4">
                        <TenpatenLogo variant="color" />
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-4">Full Logo</p>
                    </div>

                    <div className="mt-auto flex flex-col items-center gap-4 border-t border-slate-100 pt-6 w-full">
                        <div className="flex gap-8">
                            <div className="text-center space-y-2">
                                <TenpatenIcon variant="color" className="h-16 w-16" />
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Icon Only</p>
                            </div>
                            <div className="text-center space-y-2">
                                <TenpatenIcon variant="monochrome" className="h-16 w-16 text-slate-900" />
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Mono</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Brand Color Card */}
                <div className="bg-linear-to-br from-indigo-600 to-purple-700 rounded-2xl p-10 shadow-xl flex flex-col items-center justify-center gap-8 min-h-[300px]">
                    <h3 className="text-indigo-200 text-sm font-semibold uppercase tracking-wider mb-auto">Brand Primary</h3>

                    <div className="scale-150">
                        <TenpatenLogo variant="white" />
                    </div>

                    <div className="mt-auto flex gap-4">
                        <TenpatenIcon variant="white" className="h-10 w-10" />
                        <TenpatenIcon variant="monochrome" className="h-10 w-10 text-indigo-200" />
                    </div>
                </div>

                {/* Dark Mode Card */}
                <div className="bg-slate-900 rounded-2xl p-10 shadow-2xl flex flex-col items-center justify-center gap-8 min-h-[300px]">
                    <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-auto">Dark Mode</h3>

                    <div className="scale-150">
                        <TenpatenLogo variant="white" />
                    </div>

                    <div className="mt-auto flex gap-4">
                        <TenpatenIcon variant="color" className="h-10 w-10" />
                        <TenpatenIcon variant="monochrome" className="h-10 w-10 text-slate-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}
