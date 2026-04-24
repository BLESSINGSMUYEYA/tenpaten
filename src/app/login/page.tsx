'use client';

import { Suspense, useState } from 'react';
import LoginForm from '@/components/login-form';
import { RoleGateway, RoleType } from '@/components/auth/RoleGateway';

function LoginContent() {
    const [selectedRole, setSelectedRole] = useState<RoleType>('student');

    return (
        <RoleGateway
            mode="login"
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
        >
            <LoginForm />
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
