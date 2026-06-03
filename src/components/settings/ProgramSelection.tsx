'use client';

import { useState, useMemo, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, GraduationCap, Wallet, BookOpen } from 'lucide-react';

interface ProgramSelectionProps {
    universities: any[];
    selectedProgramId: string;
    onProgramChange: (programId: string) => void;
    onNext?: () => void;
}

export default function ProgramSelection({ universities, selectedProgramId, onProgramChange, onNext }: ProgramSelectionProps) {
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const [selectedProgramName, setSelectedProgramName] = useState<string>('');
    const [selectedUniversityId, setSelectedUniversityId] = useState<string>('');

    // Flatten all programs and find unique levels
    const uniqueLevels = useMemo(() => {
        const levels = new Set<string>();
        universities.forEach(uni => {
            uni.programs.forEach((prog: any) => {
                if (prog.level) levels.add(prog.level);
            });
        });
        return Array.from(levels).sort();
    }, [universities]);

    // Flatten all programs and find unique names filtered by level
    const uniqueProgramNames = useMemo(() => {
        const names = new Set<string>();
        universities.forEach(uni => {
            uni.programs.forEach((prog: any) => {
                if (!selectedLevel || prog.level === selectedLevel) {
                    names.add(prog.name);
                }
            });
        });
        return Array.from(names).sort();
    }, [universities, selectedLevel]);

    // Available universities for the selected program name and level
    const availableUniversities = useMemo(() => {
        if (!selectedProgramName) return [];

        const unis: any[] = [];
        universities.forEach(uni => {
            const hasProg = uni.programs.find((p: any) => 
                p.name === selectedProgramName &&
                (!selectedLevel || p.level === selectedLevel)
            );
            if (hasProg) {
                unis.push({
                    id: uni.id,
                    name: uni.name,
                    programId: hasProg.id,
                    baseTuition: hasProg.baseTuition,
                    scholarshipPercentage: (uni.globalScholarshipActive && !hasProg.excludeFromGlobalScholarship) ? uni.globalScholarshipPercentage : (hasProg.scholarshipPercentage || null)
                });
            }
        });
        return unis.sort((a, b) => a.name.localeCompare(b.name));
    }, [selectedProgramName, selectedLevel, universities]);

    // Handle program name change
    const handleProgramNameChange = (name: string) => {
        setSelectedProgramName(name);
        setSelectedUniversityId('');
        onProgramChange(''); // Reset the final ID
    };

    // Handle level change
    const handleLevelChange = (level: string) => {
        setSelectedLevel(level);
        setSelectedProgramName('');
        setSelectedUniversityId('');
        onProgramChange('');
    };

    // Handle university change
    const handleUniversityChange = (uniId: string) => {
        setSelectedUniversityId(uniId);
        const uni = availableUniversities.find(u => u.id === uniId);
        if (uni) {
            onProgramChange(uni.programId);
        }
    };

    // Handle initial state and updates from props
    useEffect(() => {
        if (selectedProgramId && universities.length > 0) {
            for (const uni of universities) {
                const prog = uni.programs.find((p: any) => p.id === selectedProgramId);
                if (prog) {
                    if (prog.level) setSelectedLevel(prev => prev !== prog.level ? prog.level : prev);
                    setSelectedProgramName((prevName) => (prevName !== prog.name ? prog.name : prevName));
                    setSelectedUniversityId((prevId) => (prevId !== uni.id ? uni.id : prevId));
                    break;
                }
            }
        }
    }, [selectedProgramId, universities]);

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 text-[#1a1b41]">Choose Your Path</h3>
                    <p className="text-sm text-gray-600">Select the program you wish to study and find the right university for you.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {/* Level Selection First */}
                    <div className="space-y-3">
                        <Label htmlFor="level" className="text-sm font-bold text-gray-700">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-brand-accent" />
                                1. Select Level
                            </div>
                        </Label>
                        <Select
                            value={selectedLevel}
                            onValueChange={handleLevelChange}
                        >
                            <SelectTrigger className="h-12 border-2 hover:border-brand-accent transition-colors bg-white">
                                <SelectValue placeholder="Degree Level" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                                {uniqueLevels.map((level) => (
                                    <SelectItem key={level} value={level} className="py-3">
                                        {level}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Program Selection Second */}
                    <div className="space-y-3">
                        <Label htmlFor="programName" className={`text-sm font-bold transition-colors ${!selectedLevel && uniqueLevels.length > 0 ? 'text-gray-400' : 'text-gray-700'}`}>
                            <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-brand-accent" />
                                2. Select Program
                            </div>
                        </Label>
                        <Select
                            disabled={!selectedLevel && uniqueLevels.length > 0}
                            value={selectedProgramName}
                            onValueChange={handleProgramNameChange}
                        >
                            <SelectTrigger className={`h-12 border-2 transition-colors bg-white ${!selectedLevel && uniqueLevels.length > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-brand-accent'}`}>
                                <SelectValue placeholder={selectedLevel || uniqueLevels.length === 0 ? "What do you want to study?" : "Select a level first"} />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                                {uniqueProgramNames.map((name) => (
                                    <SelectItem key={name} value={name} className="py-3">
                                        {name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* University Selection Third */}
                    <div className="space-y-3">
                        <Label htmlFor="universityId" className={`text-sm font-bold transition-colors ${!selectedProgramName ? 'text-gray-400' : 'text-gray-700'}`}>
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-brand-accent" />
                                3. Select University
                            </div>
                        </Label>
                        <Select
                            disabled={!selectedProgramName}
                            value={selectedUniversityId}
                            onValueChange={handleUniversityChange}
                        >
                            <SelectTrigger className={`h-12 border-2 transition-colors bg-white ${!selectedProgramName ? 'opacity-50 cursor-not-allowed' : 'hover:border-brand-accent'}`}>
                                <SelectValue placeholder={selectedProgramName ? "Which university?" : "Select a program first"} />
                            </SelectTrigger>
                            <SelectContent>
                                {availableUniversities.map((uni) => (
                                    <SelectItem key={uni.id} value={uni.id} className="py-3">
                                        {uni.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {selectedProgramId && (
                    <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-5 h-5 text-brand-accent" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-brand-accent uppercase tracking-widest">Selection Confirmed</p>
                                <p className="text-sm font-medium text-[#1a1b41]">
                                    You are applying for <span className="font-bold underline">{selectedProgramName}</span> at <span className="font-bold underline">{availableUniversities.find(u => u.id === selectedUniversityId)?.name}</span>
                                </p>
                                {(() => {
                                    const uni = availableUniversities.find(u => u.id === selectedUniversityId);
                                    if (!uni?.baseTuition) return null;
                                    const percentage = uni.scholarshipPercentage || 0;
                                    const discounted = percentage > 0 ? uni.baseTuition * (1 - percentage / 100) : uni.baseTuition;
                                    return (
                                        <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
                                            <Wallet className="w-3 h-3" />
                                            Tuition: {discounted.toLocaleString()}
                                            {percentage > 0 && <span className="text-[10px] text-gray-400 line-through ml-1">{uni.baseTuition.toLocaleString()}</span>}
                                        </p>
                                    );
                                })()}
                            </div>
                        </div>
                        {onNext && (
                            <button
                                onClick={onNext}
                                className="w-full sm:w-auto px-6 py-2 bg-brand-accent text-white rounded-lg font-semibold shadow-md hover:bg-[#b89531] transition-colors"
                            >
                                Next Step
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
