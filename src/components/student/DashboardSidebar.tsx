import { CheckCircle2, Circle, ArrowRight, Bell, Calendar, HelpCircle, FileText } from "lucide-react";
import Link from "next/link";
import { getProfileCompletion, getUpcomingDeadlines } from "@/lib/data";

export async function ProfileCompletion() {
    const data = await getProfileCompletion();
    const allFields = data.allFields || [];
    
    return (
        <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black text-brand-primary uppercase tracking-[0.2em] opacity-60">Profile Strength</h3>
                <div className="text-base font-black text-brand-accent bg-brand-accent/10 px-3 py-1.5 rounded-lg border border-brand-accent/20 transition-all hover:scale-110 active:scale-95 shadow-sm">
                    {data.completionPercentage}%
                </div>
            </div>
            
            <div className="mb-6">
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-linear-to-r from-brand-primary to-brand-accent transition-all duration-1000" 
                        style={{ width: `${data.completionPercentage}%` }} 
                    />
                </div>
            </div>
            
            <div className="space-y-4">
                {allFields.slice(0, 4).map((field, i) => (
                    <div key={i} className="flex items-center justify-between py-1 px-1">
                        <div className="flex items-center gap-3 text-sm text-brand-primary font-medium tracking-tight">
                            {field.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                                <Circle className="w-4 h-4 text-gray-200" />
                            )}
                            {field.name}
                        </div>
                        {!field.completed && (
                             <Link href={field.link} className="text-brand-primary font-black uppercase tracking-widest text-[10px] hover:text-brand-accent transition-colors bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 shadow-sm active:scale-95">
                                Add
                            </Link>
                        )}
                    </div>
                ))}
            </div>
            
            <Link 
                href="/dashboard/student-settings" 
                className="mt-6 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-slate-50 text-brand-primary text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all shadow-sm border border-slate-100"
            >
                Complete Profile
                <ArrowRight className="w-3.5 h-3.5" />
            </Link>
        </div>
    );
}

export async function UpcomingDeadlines() {
    const deadlines = await getUpcomingDeadlines();
    
    return (
        <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Upcoming Tasks</h3>
            
            {deadlines.length === 0 ? (
                <div className="text-center py-6">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-5 h-5 text-gray-300" />
                    </div>
                    <p className="text-xs text-slate-400 font-medium tracking-tight">No urgent tasks</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {deadlines.slice(0, 3).map((task) => (
                        <div key={task.id} className="group flex gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                                <span className="text-xs font-black">{task.daysUntil}d</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[11px] font-black text-brand-primary truncate mb-0.5 tracking-tight">{task.title}</h4>
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.1em]">
                                    {task.type === 'decision' ? 'Action Required' : 'Status Update'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <button className="mt-6 w-full text-center text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-brand-primary transition-colors">
                View Calendar
            </button>
        </div>
    );
}

export function SidebarSkeletons() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-64 bg-gray-50 rounded-3xl" />
            <div className="h-64 bg-gray-50 rounded-3xl" />
        </div>
    );
}
