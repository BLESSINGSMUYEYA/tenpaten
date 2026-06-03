'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { createUniversity } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

import { Building2, Globe, DollarSign, TextQuote, Loader2, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function CreateUniversityForm() {
    const initialState = '';
    const [state, dispatch] = useActionState(createUniversity, initialState);
    const router = useRouter();

    useEffect(() => {
        if (state === 'success') {
            router.push('/dashboard/country-director/universities');
            router.refresh();
        }
    }, [state, router]);

    return (
        <form action={dispatch} className="max-w-2xl mx-auto w-full">
            <Card className="border-none shadow-2xl shadow-brand-primary/10 overflow-hidden rounded-[2.5rem] bg-white">
                <CardHeader className="bg-brand-primary text-white p-10">
                    <CardTitle className="text-3xl font-black flex items-center gap-4 tracking-tight">
                        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md">
                            <Building2 className="w-8 h-8 text-brand-accent" />
                        </div>
                        Add New University
                    </CardTitle>
                    <p className="text-white/60 mt-4 font-medium">Registers a new institution in your managed country.</p>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-brand-primary" />
                                University Name *
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="E.g. Tenpaten International University"
                                required
                                className="h-14 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent rounded-2xl transition-all font-bold text-brand-primary placeholder:text-slate-300"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="description" className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <TextQuote className="w-4 h-4 text-brand-primary" />
                                Brief Description
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Tell us a bit about this institution..."
                                className="min-h-[120px] border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent rounded-2xl transition-all font-bold text-brand-primary placeholder:text-slate-300 resize-none p-5"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label htmlFor="website" className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-brand-primary" />
                                    Official Website
                                </Label>
                                <Input
                                    id="website"
                                    name="website"
                                    type="url"
                                    placeholder="https://www.university.edu"
                                    className="h-14 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent rounded-2xl transition-all font-bold text-brand-primary placeholder:text-slate-300"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="tuition" className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-brand-primary" />
                                    Average Tuition
                                </Label>
                                <Input
                                    id="tuition"
                                    name="tuition"
                                    placeholder="e.g. $5,000 - $10,000"
                                    className="h-14 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent rounded-2xl transition-all font-bold text-brand-primary placeholder:text-slate-300"
                                />
                            </div>
                        </div>
                    </div>

                    {state && state !== 'success' && (
                        <div className="p-5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2">
                            {state}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="p-10 pt-0 flex justify-end">
                    <SubmitButton />
                </CardFooter>
            </Card>
        </form>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            className="px-10 h-14 bg-brand-primary hover:bg-brand-primary-hover text-white font-black rounded-2xl shadow-xl shadow-brand-primary/20 transition-all transform hover:scale-105 active:scale-95 leading-none"
            aria-disabled={pending}
            disabled={pending}
        >
            {pending ? (
                <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin text-brand-accent" />
                    Registering...
                </>
            ) : (
                <>
                    <Save className="w-6 h-6 mr-3 text-brand-accent" />
                    Create University
                </>
            )}
        </Button>
    );
}
