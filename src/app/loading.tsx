import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
            <div className="relative flex items-center justify-center">
                <div className="absolute w-20 h-20 border-4 border-primary/20 rounded-full animate-ping" />
                <div className="bg-card p-4 rounded-full shadow-lg border border-border">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
            </div>
            <h2 className="mt-6 text-xl font-bold text-foreground animate-pulse">
                Loading Tenpaten...
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
                Preparing your tailored educational experience.
            </p>
        </div>
    );
}
