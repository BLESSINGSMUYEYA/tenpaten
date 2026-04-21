import {
    LayoutDashboard,
    FileText,
    Sparkles,
    Building2,
    Settings,
    GraduationCap,
    MessageCircle,
    UserPlus,
    School,
    BookOpen,
    Users,
    Globe,
    ClipboardList,
    Zap,
    Trophy,
    Wallet,
    Percent
} from 'lucide-react';

export interface NavItem {
    name: string;
    href: string;
    icon: any; // Lucide icon component type
    badge?: string;
    external?: boolean;
}

export const navigationConfig = {
    super_admin: [
        { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
        { name: 'Users', href: '/dashboard/admin/users', icon: UserPlus },
        { name: 'Schools', href: '/dashboard/admin/schools', icon: School },
        { name: 'Applications', href: '/dashboard/admin/applications', icon: FileText },
        { name: 'Countries', href: '/dashboard/admin/countries', icon: Globe },
        { name: 'Affiliates', href: '/dashboard/admin/affiliates', icon: Users },
        { name: 'Finance', href: '/dashboard/admin/finance', icon: Wallet },
        { name: 'Questionnaire', href: '/dashboard/admin/questionnaire', icon: ClipboardList },
    ],
    school_admin: [
        { name: 'Dashboard', href: '/dashboard/school', icon: LayoutDashboard },
        { name: 'Talent Radar', href: '/dashboard/school/discover', icon: Zap },
        { name: 'Applications', href: '/dashboard/school/applications', icon: FileText },
        { name: 'Academics', href: '/dashboard/school/programs', icon: GraduationCap },
        { name: 'Requirements', href: '/dashboard/school/requirements', icon: Sparkles },
        { name: 'Scholarships', href: '/dashboard/school/scholarships', icon: Percent },
        { name: 'Finance', href: '/dashboard/school/finance', icon: Wallet },
        { name: 'Messages', href: '/dashboard/messages', icon: MessageCircle },
    ],
    school_admin_account: [
        { name: 'University Profile', href: '/dashboard/school/profile', icon: Building2 },
        { name: 'Account Settings', href: '/dashboard/school/settings', icon: Settings },
    ],
    student: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Browse Universities', href: '/dashboard/colleges', icon: Building2 },
        { name: 'My Applications', href: '/dashboard/applications', icon: FileText },
        { name: 'Resources', href: '/dashboard/resources', icon: BookOpen },
        { name: 'Messages', href: '/dashboard/messages', icon: MessageCircle },
    ],
    country_director: [
        { name: 'Dashboard', href: '/dashboard/country-director', icon: LayoutDashboard },
        { name: 'My Universities', href: '/dashboard/country-director/universities', icon: Building2 },
        { name: 'Applications', href: '/dashboard/country-director/applications', icon: FileText },
        { name: 'Affiliates', href: '/dashboard/country-director/affiliates', icon: Users },
        { name: 'Regional Finance', href: '/dashboard/country-director/finance', icon: Wallet },
        { name: 'Messages', href: '/dashboard/messages', icon: MessageCircle },
    ],
    affiliate: [
        { name: 'Dashboard', href: '/dashboard/affiliate', icon: LayoutDashboard },
        { name: 'My Links', href: '/dashboard/affiliate/links', icon: Globe },
        { name: 'Referrals', href: '/dashboard/affiliate/referrals', icon: Users },
        { name: 'Earnings', href: '/dashboard/affiliate/earnings', icon: FileText }, // Placeholder icon
        { name: 'Settings', href: '/dashboard/affiliate/settings', icon: Settings },
    ],
};
