import { checkRole } from '@/lib/rbac';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await checkRole(['SUPER_ADMIN']);

    return <>{children}</>;
}
