'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import ProgramCard from './ProgramCard';
import { Search, Filter, X, ChevronDown, Building2, Clock, Calendar, GraduationCap } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

type Program = {
    id: string;
    name: string;
    university: {
        id: string;
        name: string;
    };
    school?: {
        id: string;
        name: string;
    } | null;
    duration?: string | null;
    level?: string | null;
    intake?: string | null;
    baseTuition?: number | null;
    scholarshipPercentage?: number | null;
};

type University = {
    id: string;
    name: string;
    country?: {
        name: string;
    } | null;
    programs: any[];
    schools?: {
        id: string;
        name: string;
    }[];
};

interface ProgramsListProps {
    programs: Program[];
    universities: University[];
}

export default function ProgramsList({ programs, universities }: ProgramsListProps) {
    const searchParams = useSearchParams();

    // Initialize state from URL params
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUniversity, setSelectedUniversity] = useState<string>(searchParams?.get('university') || 'all');
    const [selectedSchool, setSelectedSchool] = useState<string>(searchParams?.get('school') || 'all');
    const [selectedCountry, setSelectedCountry] = useState<string>('all');
    const [showFilters, setShowFilters] = useState(false);

    // Handle updates when searchParams change
    useEffect(() => {
        const schoolParam = searchParams?.get('school');
        const universityParam = searchParams?.get('university');

        if (schoolParam) {
            setSelectedSchool(schoolParam);
            const uniForSchool = universities.find(u => u.schools?.some(s => s.id === schoolParam));
            if (uniForSchool) {
                setSelectedUniversity(uniForSchool.id);
            }
        }

        if (universityParam) {
            setSelectedUniversity(universityParam);
        }
    }, [searchParams, universities]);

    // Get unique countries
    const countries = useMemo(() => {
        const uniqueCountries = new Set(
            universities
                .map(u => u.country?.name)
                .filter((name): name is string => Boolean(name))
        );
        return Array.from(uniqueCountries).sort();
    }, [universities]);

    // Get schools for selected university
    const availableSchools = useMemo(() => {
        if (selectedUniversity === 'all') return [];
        const uni = universities.find(u => u.id === selectedUniversity);
        return uni?.schools || [];
    }, [universities, selectedUniversity]);

    // Filter programs based on search and filters
    const filteredPrograms = useMemo(() => {
        return programs.filter(program => {
            // Search filter
            const matchesSearch = searchQuery === '' ||
                program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                program.university.name.toLowerCase().includes(searchQuery.toLowerCase());

            // University filter
            const matchesUniversity = selectedUniversity === 'all' ||
                program.university.id === selectedUniversity;

            // School filter
            const matchesSchool = selectedSchool === 'all' ||
                program.school?.id === selectedSchool;

            // Country filter
            const matchesCountry = selectedCountry === 'all' ||
                universities.find(u => u.id === program.university.id)?.country?.name === selectedCountry;

            return matchesSearch && matchesUniversity && matchesSchool && matchesCountry;
        });
    }, [programs, searchQuery, selectedUniversity, selectedSchool, selectedCountry, universities]);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedUniversity('all');
        setSelectedSchool('all');
        setSelectedCountry('all');
    };

    const hasActiveFilters = searchQuery !== '' || selectedUniversity !== 'all' || selectedSchool !== 'all' || selectedCountry !== 'all';

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search programs or universities..."
                    className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-sm sm:text-base transition-all"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-400" />
                    </button>
                )}
            </div>

            {/* Filter Toggle and Active Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all ${showFilters
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                {hasActiveFilters && (
                    <>
                        <div className="text-sm text-gray-600">
                            {filteredPrograms.length} of {programs.length} programs
                        </div>
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors"
                        >
                            <X className="w-3 h-3" />
                            <span>Clear filters</span>
                        </button>
                    </>
                )}
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-white rounded-xl border-2 border-gray-200 p-4 sm:p-6 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {/* University Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                University
                            </label>
                            <select
                                value={selectedUniversity}
                                onChange={(e) => {
                                    setSelectedUniversity(e.target.value);
                                    setSelectedSchool('all'); // Reset school when university changes
                                }}
                                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-sm transition-all"
                            >
                                <option value="all">All Universities</option>
                                {universities.map(uni => (
                                    <option key={uni.id} value={uni.id}>
                                        {uni.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* School/College Filter */}
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${selectedUniversity === 'all' ? 'text-gray-400' : 'text-gray-900'}`}>
                                School / College
                            </label>
                            <select
                                value={selectedSchool}
                                onChange={(e) => setSelectedSchool(e.target.value)}
                                disabled={selectedUniversity === 'all'}
                                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-sm transition-all disabled:bg-gray-50 disabled:text-gray-400 grayscale-0 disabled:grayscale transition-all duration-300"
                            >
                                <option value="all">
                                    {selectedUniversity === 'all' ? 'Select a university first' : 'All Schools'}
                                </option>
                                {availableSchools.map(school => (
                                    <option key={school.id} value={school.id}>
                                        {school.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Country Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Country
                            </label>
                            <select
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-sm transition-all"
                            >
                                <option value="all">All Countries</option>
                                {countries.map(country => (
                                    <option key={country} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Results */}
            {filteredPrograms.length === 0 ? (
                <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 animate-in fade-in duration-700">
                    <div className="w-20 h-20 bg-white rounded-[2rem] shadow-sm flex items-center justify-center mx-auto mb-6">
                        <Search className="w-8 h-8 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-black text-brand-primary mb-2 tracking-tight">No programs found</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest max-w-[280px] mx-auto leading-relaxed">
                        {hasActiveFilters
                            ? 'Adjust your filters or try a different search term to expand your horizons.'
                            : 'Our curriculum is currently being calibrated. Please check back shortly.'}
                    </p>
                    {hasActiveFilters && (
                        <Button
                            onClick={clearFilters}
                            className="mt-8 rounded-xl bg-brand-primary text-white font-black uppercase text-[10px] tracking-widest px-8"
                        >
                            Reset Registry
                        </Button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Header for Desktop */}
                    <div className="hidden lg:grid grid-cols-12 gap-6 px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white/50 rounded-2xl border border-slate-100/50 backdrop-blur-sm">
                        <div className="col-span-5">Program & Institution</div>
                        <div className="col-span-3">Strategic Specs</div>
                        <div className="col-span-2">Admission Level</div>
                        <div className="col-span-2 text-right">Acquisition</div>
                    </div>

                    {/* List Items */}
                    <div className="space-y-3">
                        {filteredPrograms.map((program) => (
                            <div 
                                key={program.id} 
                                className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-8 lg:px-10 py-8 lg:py-6 items-center bg-white rounded-[2.5rem] border border-transparent shadow-xl shadow-brand-primary/5 hover:shadow-2xl hover:shadow-brand-primary/10 hover:border-brand-accent/30 transition-all duration-500 group relative overflow-hidden"
                            >
                                {/* Premium side accent */}
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-linear-to-b from-brand-primary to-brand-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />

                                {/* Program & University Info */}
                                <div className="lg:col-span-5 flex items-center gap-6">
                                    <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-primary/10 group-hover:bg-brand-primary/5 group-hover:text-brand-primary transition-all duration-500 shadow-inner">
                                        <GraduationCap className="w-8 h-8 transform group-hover:rotate-12 transition-transform" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight group-hover:text-brand-primary transition-colors leading-none mb-2 uppercase break-words">
                                            {program.name}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-brand-accent uppercase tracking-widest bg-brand-accent/5 px-2 py-0.5 rounded border border-brand-accent/10">
                                                <Building2 className="w-3 h-3" />
                                                {program.university.name}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Strategic Specs */}
                                <div className="lg:col-span-3">
                                    <div className="grid grid-cols-2 lg:flex lg:flex-col gap-4 lg:gap-1.5">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:text-brand-primary transition-colors">
                                                <Clock className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-xs lg:text-sm font-black text-slate-700 uppercase tracking-tight">{program.duration || 'Flexible'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:text-brand-primary transition-colors">
                                                <Calendar className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-[10px] lg:text-[11px] font-bold text-slate-400 uppercase tracking-widest">{program.intake || 'Multiple'} Intake</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Level badge */}
                                <div className="lg:col-span-2">
                                    <span className="inline-flex px-4 py-1.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-slate-200 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all">
                                        {program.level || 'Degree'}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="lg:col-span-2 flex items-center justify-end gap-3 mt-4 lg:mt-0">
                                    <Link
                                        href={`/dashboard/programs/${program.id}`}
                                        className="hidden xl:flex h-11 px-5 text-[10px] font-black text-slate-400 hover:text-brand-primary uppercase tracking-widest transition-colors items-center"
                                    >
                                        Details
                                    </Link>
                                    <Link
                                        href={`/dashboard/apply?programId=${program.id}`}
                                        className="h-14 lg:h-12 px-10 flex-1 lg:flex-none bg-brand-primary hover:bg-brand-primary-hover text-brand-accent text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center group-hover:scale-105 active:scale-95"
                                    >
                                        Enroll Now
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
