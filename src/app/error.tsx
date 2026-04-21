'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Unhandled application error:', error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="max-w-md w-full bg-card border-2 border-border shadow-lg rounded-2xl p-6 sm:p-8 text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                        Something went wrong!
                    </h2>
                    <p className="text-sm text-muted-foreground font-medium">
                        We apologize for the inconvenience. Our team has been notified of this issue.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 border-t border-border">
                    <Button
                        onClick={() => reset()}
                        variant="default"
                        className="gap-2 font-bold w-full sm:w-auto"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Try Again
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="font-bold w-full sm:w-auto"
                    >
                        <Link href="/">
                            Return Home
                        </Link>
                    </Button>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-6 text-left bg-muted p-4 rounded-lg overflow-auto border border-border">
                        <p className="font-bold text-xs text-destructive mb-2">Developer Error Details:</p>
                        <code className="text-[10px] text-muted-foreground break-words">{error.message}</code>
                    </div>
                )}
            </div>
        </div>
    );
}
