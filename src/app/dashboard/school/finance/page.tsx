import FinancePageClient from "./FinancePageClient";

export const metadata = {
    title: 'Financial Ledger - School Dashboard',
    description: 'Manage your institutional revenue and platform fees.',
};

export default function SchoolFinancePage() {
    return <FinancePageClient />;
}
