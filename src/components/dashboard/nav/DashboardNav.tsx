'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Settings, LogOut, ChevronDown, Bell, Users, Building2, Search } from 'lucide-react';
import { signOut } from 'next-auth/react';
import NotificationBell from '@/components/common/NotificationBell';
import { navigationConfig } from '@/config/navigation';
import { TenpatenLogo } from '@/components/branding/TenpatenLogo';
import { Role } from '@prisma/client';
import { getHomeUrl } from '@/lib/navigation';
import PerformanceToggle from './PerformanceToggle';

export default function DashboardNav({ user, isEnrolled = false, hasAffiliateAccess = false }: { user?: any; isEnrolled?: boolean; hasAffiliateAccess?: boolean }) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const role = user?.role as Role;

    // Map role to navigationConfig keys
    const roleKeyMap: Record<string, keyof typeof navigationConfig> = {
        'SUPER_ADMIN': 'super_admin',
        'SCHOOL_ADMIN': 'school_admin',
        'PROSPECT': 'student',
        'COUNTRY_DIRECTOR': 'country_director',
        'AFFILIATE': 'affiliate',
    };

    const roleLabelMap: Record<string, string> = {
        'SUPER_ADMIN': 'Super Admin',
        'SCHOOL_ADMIN': 'School Admin',
        'PROSPECT': 'Student',
        'COUNTRY_DIRECTOR': 'Country Director',
        'AFFILIATE': 'Affiliate',
    };
    const roleLabel = role ? (roleLabelMap[role] || role) : 'User';

    const configKey = role && roleKeyMap[role] ? roleKeyMap[role] : null;
    const baseLinks = configKey ? [...navigationConfig[configKey]] : [];
    const messagesIndex = baseLinks.findIndex(l => l.name === 'Messages');
    
    const dynamicLinks = [
        ...(role === 'PROSPECT' && isEnrolled ? [{ name: 'Affiliate Program', href: '/dashboard/affiliate', icon: Users }] : []),
        ...(hasAffiliateAccess && role !== 'AFFILIATE' ? [{ name: 'Affiliate Dashboard', href: '/dashboard/affiliate', icon: Users }] : []),
    ];

    const navLinks = messagesIndex !== -1 
        ? [...baseLinks.slice(0, messagesIndex), ...dynamicLinks, ...baseLinks.slice(messagesIndex)]
        : [...baseLinks, ...dynamicLinks];

    const homeUrl = getHomeUrl(role);

    const isActive = (path: string) => {
        // Special case for dashboard home URLs to prevent over-matching on sub-pages
        const isHomeUrl = ['/dashboard', '/dashboard/school', '/dashboard/admin', '/dashboard/country-director', '/dashboard/affiliate'].includes(path);
        if (isHomeUrl) return pathname === path;
        return pathname === path || pathname.startsWith(path + '/');
    };

    return (
        <>
            {/* Desktop Header — White with gold top accent, clearly distinct from Midnight Navy sidebar */}
            <nav className="hidden lg:block bg-white border-b border-gray-100 border-t-2 border-t-brand-accent sticky top-0 z-40 shadow-sm">
                <div className="px-8">
                    <div className="flex items-center justify-between h-14">
                        {/* Global Search Bar */}
                        <div className="w-full max-w-sm">
                            <form action="/dashboard/colleges" method="GET" className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-slate-400 group-focus-within:text-brand-accent transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="query"
                                    placeholder="Search programs or colleges..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-100 rounded-xl bg-gray-50/50 text-[13px] font-medium placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand-accent/30 focus:border-brand-accent transition-all"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
                                    <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[10px] font-medium text-slate-400 select-none">
                                        ↵
                                    </kbd>
                                </div>
                            </form>
                        </div>

                        <div className="flex items-center gap-3">
                            <NotificationBell />
                            <ProfileDropdown user={user} isOpen={profileOpen} setIsOpen={setProfileOpen} />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Header - Logo + Menu Toggle */}
            <nav className="lg:hidden bg-white border-b border-gray-100 border-t-2 border-t-brand-accent sticky top-0 z-40 shadow-sm">
                <div className="px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        <Link href={homeUrl} className="transition-transform active:scale-95">
                            <TenpatenLogo className="scale-90 origin-left" variant="navy" disableLink />
                        </Link>

                        <div className="flex items-center gap-2">
                            <NotificationBell />
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay & Drawer */}
                <div 
                    className={`fixed inset-0 z-[100] lg:hidden transition-all duration-300 ${mobileMenuOpen ? 'visible' : 'invisible'}`}
                >
                    {/* Backdrop */}
                    <div 
                        className={`absolute inset-0 bg-brand-primary/40 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    
                    {/* Drawer Content */}
                    <div 
                        className={`absolute right-0 top-0 h-full w-[85%] max-w-xs bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    >
                        {/* Drawer Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <TenpatenLogo className="scale-75 origin-left" variant="navy" />
                            <button 
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 rounded-xl bg-white border border-gray-100 shadow-sm active:scale-90 transition-transform"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* User Profile Section */}
                        <div className="px-6 py-8 border-b border-gray-100 bg-linear-to-br from-brand-primary/5 to-white">
                            <div className="flex items-center gap-4">
                                <div className="relative w-14 h-14 rounded-2xl bg-linear-to-br from-brand-primary to-[#4a477d] flex items-center justify-center shadow-lg border-2 border-white shrink-0">
                                    <span className="text-white font-black text-xl">
                                        {(user?.name?.[0] || 'U').toUpperCase()}
                                    </span>
                                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-accent rounded-full border-2 border-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-base font-black text-brand-primary truncate leading-tight tracking-tight capitalize">
                                        {user?.name?.split(' ')[0] || 'User'}
                                    </p>
                                    <p className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em] mt-0.5">{roleLabel}</p>
                                    <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar">
                            <PerformanceToggle />
                            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Navigation</p>
                            {navLinks.map((link) => {
                                const active = isActive(link.href);
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all border-l-2 ${active
                                            ? 'bg-[#1d1b41] text-white shadow-lg shadow-[#1d1b41]/20 border-brand-accent'
                                            : 'text-slate-600 hover:bg-gray-50 hover:text-[#1d1b41] border-transparent'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-brand-accent/20' : 'bg-gray-100'}`}>
                                             <Icon className={`w-4 h-4 ${active ? 'text-brand-accent' : 'text-slate-400'}`} />
                                        </div>
                                        {link.name}
                                        {(link as any).badge && (
                                            <span className="ml-2 px-1.5 py-0.5 rounded text-[8px] font-black bg-brand-accent text-brand-primary uppercase tracking-widest shrink-0">
                                                {(link as any).badge}
                                            </span>
                                        )}
                                        {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Footer Section */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-3">
                            <Link
                                href={role === 'PROSPECT' ? '/dashboard/student-settings' : role === 'SCHOOL_ADMIN' ? '/dashboard/school/settings' : '/dashboard/student-settings'}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-white hover:text-brand-primary transition-all shadow-sm border border-transparent hover:border-gray-100"
                            >
                                <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                                    <Settings className="w-4 h-4 text-slate-400" />
                                </div>
                                Settings
                            </Link>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-black text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                            >
                                <div className="w-8 h-8 rounded-xl bg-red-100/50 flex items-center justify-center">
                                    <LogOut className="w-4 h-4 text-red-500" />
                                </div>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

function ProfileDropdown({ user, isOpen, setIsOpen }: { user: any, isOpen: boolean, setIsOpen: (val: boolean) => void }) {
    const role = user?.role as Role;
    const firstName = user?.name?.split(' ')[0] || 'User';
    const initials = user?.name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() || 'U';
    const roleLabelMap: Record<string, string> = {
        'SUPER_ADMIN': 'Super Admin',
        'SCHOOL_ADMIN': 'School Admin',
        'PROSPECT': 'Student',
        'COUNTRY_DIRECTOR': 'Country Director',
        'AFFILIATE': 'Affiliate',
    };
    const roleLabel = role ? (roleLabelMap[role] || role) : 'User';

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-brand-primary/5 transition-all group"
            >
                {/* Avatar */}
                <div className="relative w-9 h-9 rounded-xl bg-linear-to-br from-brand-primary to-[#4a477d] flex items-center justify-center shadow-sm border border-brand-primary/20">
                    <span className="text-white font-black text-[11px] tracking-tight">{initials}</span>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-brand-accent rounded-full border-2 border-white" />
                </div>
                {/* First Name */}
                <span className="hidden xl:block text-sm font-bold text-brand-primary group-hover:text-brand-accent transition-colors">{firstName}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl shadow-brand-primary/10 border border-gray-100 overflow-hidden z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Profile Header */}
                        <div className="bg-linear-to-br from-brand-primary to-[#4a477d] px-4 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                                    <span className="text-white font-black text-sm">{initials}</span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-black text-white truncate capitalize">{user?.name || 'User'}</p>
                                    <p className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em]">{roleLabel}</p>
                                </div>
                            </div>
                        </div>
                        <div className="py-1.5">
                            {role === 'SCHOOL_ADMIN' && (
                                <Link
                                    href="/dashboard/school/profile"
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-brand-primary/5 hover:text-brand-primary transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Building2 className="w-4 h-4" />
                                    University Profile
                                </Link>
                            )}
                            <Link
                                href={role === 'PROSPECT' ? '/dashboard/student-settings' : role === 'SCHOOL_ADMIN' ? '/dashboard/school/settings' : '/dashboard/student-settings'}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-brand-primary/5 hover:text-brand-primary transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Settings className="w-4 h-4" />
                                Account Settings
                            </Link>
                            <div className="mx-4 my-1 h-px bg-gray-100" />
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
