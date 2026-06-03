import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { redirect } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Sparkles, GraduationCap, MapPin, Users, Globe, ClipboardList, Zap, Trophy, BrainCircuit, Search, ArrowRight } from 'lucide-react';
import { calculateMeritScore, AcademicInfo } from '@/lib/utils/scoring';
import Link from 'next/link';
import { getActiveSchoolId } from '@/lib/getActiveSchool';

export default async function StudentDiscoveryPage() {
    const session = await auth();
    const userRole = (session?.user as any)?.role;
    let universityId = (session?.user as any)?.managedUniversityId;

    if (userRole !== 'SCHOOL_ADMIN' && userRole !== 'SCHOOL_SUPER_AGENT') {
        redirect('/dashboard');
    }

    if (userRole === 'SCHOOL_SUPER_AGENT') {
        universityId = await getActiveSchoolId();
    } else if (!universityId && session?.user?.id) {
        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { managedUniversityId: true }
        });
        universityId = dbUser?.managedUniversityId;
    }

    if (!universityId) {
        redirect('/dashboard');
    }

    // Get university details for invitation logic
    const university = await prisma.university.findUnique({
        where: { id: universityId },
        select: { name: true, programs: { select: { id: true, name: true } } }
    });

    // Scouting logic: Find students who haven't applied to this school yet
    const discoverableStudents = await prisma.user.findMany({
            where: {
                role: 'PROSPECT',
                // Profile must be partially complete
                academicInfo: { not: Prisma.JsonNull },
                // Not already applied to this school
                applications: {
                    none: {
                        program: {
                            universityId: universityId
                        }
                    }
                }
            } as any, // Cast to any to bypass complex Prisma JSON types for now
            include: {
                residenceCountry: true
            },
        orderBy: { createdAt: 'desc' },
        take: 20
    });

    // Score and sort
    const scoredStudents = discoverableStudents.map(student => ({
        ...student,
        merit: calculateMeritScore(student.academicInfo as unknown as AcademicInfo)
    })).sort((a, b) => b.merit.score - a.merit.score);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Powerful Header */}
            <div className="relative overflow-hidden bg-linear-to-br from-brand-primary via-brand-primary-hover to-[#1e1c35] rounded-[2.5rem] p-10 text-white shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <BrainCircuit className="w-64 h-64 text-white" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="space-y-6 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-accent/20 text-brand-accent text-xs font-black uppercase tracking-[0.2em] border border-brand-accent/30 backdrop-blur-md">
                            <Zap className="w-3.5 h-3.5" />
                            Talent Radar Active
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                            Discover Your Future <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-accent to-[#f5d07a]">Global Talent</span>
                        </h1>
                        <p className="text-indigo-100/70 text-lg font-medium leading-relaxed italic">
                            Our AI-enhanced discovery tool analyzes thousands of student profiles to find the perfect academic match for {university?.name}.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                             <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-sm">
                                <span className="text-brand-accent text-2xl font-black">{scoredStudents.length}</span>
                                <span className="text-xs font-bold text-gray-400 leading-tight uppercase tracking-widest">Matched<br/>Students</span>
                             </div>
                             <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-sm">
                                <span className="text-brand-accent text-2xl font-black">{scoredStudents.filter(s => s.merit.score >= 80).length}</span>
                                <span className="text-xs font-bold text-gray-400 leading-tight uppercase tracking-widest">Elite<br/>Profiles</span>
                             </div>
                        </div>
                    </div>
                    <div className="hidden lg:block w-72 h-72 relative">
                        <div className="absolute inset-0 bg-brand-accent opacity-10 rounded-full blur-3xl animate-pulse" />
                        <div className="relative z-10 w-full h-full rounded-full border-2 border-dashed border-brand-accent/30 flex items-center justify-center animate-[spin_30s_linear_infinite]">
                             <div className="w-4 h-4 bg-brand-accent rounded-full shadow-[0_0_20px_#d5a22d]" />
                             {[...Array(6)].map((_, i) => (
                                 <div key={i} className="absolute w-2 h-2 bg-indigo-400/40 rounded-full" style={{ transform: `rotate(${i * 60}deg) translate(140px)` }} />
                             ))}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Trophy className="w-16 h-16 text-brand-accent drop-shadow-[0_0_15px_rgba(213,162,45,0.5)]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Powerful Spotlight Card */}
            {scoredStudents[0] && scoredStudents[0].merit.score >= 90 && (
                 <div className="bg-white rounded-[2rem] p-8 border-2 border-brand-accent shadow-[0_20px_50px_rgba(213,162,45,0.1)] flex flex-col md:flex-row gap-8 items-center group">
                    <div className="w-24 h-24 rounded-3xl bg-brand-accent/10 flex items-center justify-center text-brand-accent border border-brand-accent/20 shrink-0 transform transition-transform group-hover:scale-110">
                        <Sparkles className="w-12 h-12" />
                    </div>
                    <div className="flex-1 space-y-2 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <span className="bg-brand-accent text-white px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest">Exceptional Candidate</span>
                            <span className="text-brand-accent font-black text-xs uppercase tracking-widest">{scoredStudents[0].merit.score}% Profile Match</span>
                        </div>
                        <h3 className="text-3xl font-black text-brand-primary tracking-tight">{scoredStudents[0].fullName}</h3>
                        <p className="text-gray-500 font-medium italic">Highest qualification: <span className="text-brand-primary not-italic font-bold uppercase tracking-tight">{(scoredStudents[0].academicInfo as any)?.highestQualification?.replace('_', ' ')}</span></p>
                    </div>
                    <div className="flex flex-col gap-3 w-full md:w-auto">
                        <Link href={`#invite-${scoredStudents[0].id}`} className="w-full">
                            <Button className="w-full bg-brand-primary text-brand-accent hover:bg-brand-primary-hover rounded-2xl px-10 py-7 h-auto font-black text-lg transition-all active:scale-95 shadow-xl shadow-brand-primary/20">
                                Send VIP Invitation
                            </Button>
                        </Link>
                    </div>
                 </div>
            )}

            {/* Discovery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {scoredStudents.map((student) => (
                    <Card key={student.id} className="group relative overflow-hidden bg-white hover:bg-gray-50/50 rounded-[2rem] border border-gray-100 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                        <div className="h-32 bg-linear-to-br from-indigo-50/50 to-purple-50/50 relative overflow-hidden">
                             <div className="absolute bottom-0 right-0 p-4 opacity-5 pointer-events-none">
                                <GraduationCap className="w-24 h-24" />
                             </div>
                             <div className="absolute -bottom-10 left-8">
                                <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center text-brand-primary border-4 border-white transform transition-transform group-hover:scale-110">
                                    <User className="w-10 h-10" />
                                </div>
                             </div>
                             {student.merit.score >= 80 && (
                                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                                    High Potential
                                </div>
                             )}
                        </div>
                        <CardContent className="pt-14 p-8 space-y-6">
                            <div>
                                <h4 className="text-xl font-black text-brand-primary tracking-tight truncate group-hover:text-brand-accent transition-colors">{student.fullName}</h4>
                                <div className="flex items-center gap-1.5 text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
                                    <MapPin className="w-3 h-3 text-brand-accent" />
                                    {student.residenceCountry?.name || 'International Student'}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/50 border border-gray-100 p-4 rounded-[1.25rem] text-center shadow-sm">
                                    <div className="text-xl font-black" style={{ color: student.merit.color }}>{student.merit.score}%</div>
                                    <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">Match Score</div>
                                </div>
                                <div className="bg-white/50 border border-gray-100 p-4 rounded-[1.25rem] text-center shadow-sm">
                                    <div className="text-indigo-600 font-black text-xl truncate">{(student.academicInfo as any)?.testScore || 'N/A'}</div>
                                    <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">Academic Rank</div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-400 font-bold uppercase tracking-wider">Qualification</span>
                                    <span className="text-brand-primary font-black uppercase">{(student.academicInfo as any)?.highestQualification || 'Completed'}</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${student.merit.score}%` }} />
                                </div>
                            </div>

                            <div className="pt-4">
                                <Link href={`#invite-${student.id}`} className="w-full">
                                    <Button variant="outline" className="w-full rounded-2xl h-14 border-2 border-gray-100 font-black hover:bg-brand-primary hover:text-brand-accent hover:border-brand-primary transition-all group/btn flex justify-between items-center px-6">
                                        Invite to Apply
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {scoredStudents.length === 0 && (
                <div className="py-20 text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 border-2 border-gray-100 text-gray-300">
                        <Search className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-brand-primary">No Unmatched Talents Found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto italic">All eligible students have already applied or we're waiting for new profiles to be completed.</p>
                </div>
            )}
        </div>
    );
}
