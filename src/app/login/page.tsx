'use client';

import { Suspense, useState } from 'react';
import LoginForm from '@/components/login-form';
import { RoleGateway, RoleType } from '@/components/auth/RoleGateway';

import { useSearchParams } from 'next/navigation';

function LoginContent() {
    const [selectedRole, setSelectedRole] = useState<RoleType>('student');
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '';

    return (
        <RoleGateway
            mode="login"
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
        >
            <LoginForm callbackUrl={callbackUrl} />
        </RoleGateway>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginContent />
        </Suspense>
    );
}
