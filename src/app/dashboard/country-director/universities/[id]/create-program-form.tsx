'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { createProgram } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" aria-disabled={pending} disabled={pending}>
            {pending ? 'Saving...' : 'Add Program'}
        </Button>
    );
}

export default function CreateProgramForm({ universityId }: { universityId: string }) {
    const initialState = '';
    const [state, dispatch] = useActionState(createProgram, initialState);
    const router = useRouter();

    useEffect(() => {
        if (state === 'success') {
            router.refresh();
            // We just refresh the page to show the new program in the list, 
            // no redirect needed if we are on the details page.
            // Or maybe implement a toast? For now, refresh is fine.
        }
    }, [state, router]);

    return (
        <form action={dispatch} className="mt-4">
            <input type="hidden" name="universityId" value={universityId} />
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Add New Program</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2 items-end">
                        <div className="grow space-y-2">
                            <Label htmlFor="programName" className="sr-only">Program Name</Label>
                            <Input id="programName" name="name" placeholder="Program Name (e.g. B.Sc in CS)" required />
                        </div>
                        <SubmitButton />
                    </div>
                    {state && state !== 'success' && (
                        <div className="text-red-500 text-sm">{state}</div>
                    )}
                </CardContent>
            </Card>
        </form>
    );
}
