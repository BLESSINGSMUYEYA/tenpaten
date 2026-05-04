

export default async function SchoolLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            {children}
        </div>
    );
}
