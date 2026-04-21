'use client';

import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import Image from 'next/image';

interface UniversityGalleryProps {
    images: string[];
}

export function UniversityGallery({ images }: UniversityGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    const nextImage = () => {
        if (selectedImage !== null) {
            setSelectedImage((selectedImage + 1) % images.length);
        }
    };

    const prevImage = () => {
        if (selectedImage !== null) {
            setSelectedImage((selectedImage - 1 + images.length) % images.length);
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="flex flex-col gap-2 mb-10">
                <h2 className="text-xl font-black text-[#36335e] tracking-tight flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#36335e]/5 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-[#36335e]" />
                    </div>
                    University <span className="text-[#d5a22d]">Gallery</span>
                </h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] ml-14">Explore Campus Life</p>
            </div>

            {images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((img, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => setSelectedImage(idx)}
                            className={`rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm group relative cursor-pointer
                                ${idx % 4 === 0 ? 'md:col-span-2 aspect-[21/9]' : 'aspect-square'}
                            `}
                        >
                            <Image
                                src={img}
                                alt={`Gallery ${idx + 1}`}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-[#1a1b41]/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                                <div className="w-12 h-12 rounded-full bg-white text-[#1a1b41] flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-all duration-500">
                                    <Maximize2 className="w-5 h-5" />
                                </div>
                                <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl">
                                        <p className="text-white text-[10px] font-black uppercase tracking-widest text-center">Campus View {idx + 1}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 shadow-sm">
                    <div className="inline-flex p-5 bg-[#1a1b41]/5 rounded-[2rem] mb-6">
                        <ImageIcon className="w-10 h-10 text-[#d5a22d]" />
                    </div>
                    <h3 className="text-lg font-black text-[#36335e] mb-3 tracking-tight">No photos yet</h3>
                    <p className="text-[10px] font-black text-slate-400 max-w-[280px] mx-auto uppercase tracking-widest">
                        This university hasn't uploaded any gallery photos yet.
                    </p>
                </div>
            )}

            {/* Lightbox Modal */}
            {selectedImage !== null && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-[#1a1b41]/95 backdrop-blur-xl" onClick={() => setSelectedImage(null)} />
                    
                    <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="relative w-full max-w-6xl aspect-video rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 border border-white/10">
                        <Image
                            src={images[selectedImage]}
                            alt="Full View"
                            fill
                            className="object-contain"
                        />
                        
                        {/* Navigation */}
                        <div className="absolute inset-x-0 bottom-0 p-8 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent">
                            <div className="flex items-center gap-4">
                                <span className="text-[#d5a22d] font-black text-xs uppercase tracking-widest">Photo {selectedImage + 1} of {images.length}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center hover:bg-[#d5a22d] hover:text-[#1a1b41] transition-all"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center hover:bg-[#d5a22d] hover:text-[#1a1b41] transition-all"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
