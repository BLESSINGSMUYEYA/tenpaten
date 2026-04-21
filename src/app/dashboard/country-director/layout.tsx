import { checkRole } from '@/lib/rbac';

export default async function CountryDirectorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await checkRole(['COUNTRY_DIRECTOR']);

    return <>{children}</>;
}
