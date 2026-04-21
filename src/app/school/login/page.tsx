import LoginForm from '@/components/login-form';
import { AuthCard } from '@/components/auth/AuthCard';

const universityDecorations = [
    { id: 1, src: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=300", class: "top-[12%] -left-32", animation: "animate-[bounce_4s_infinite] delay-100" }, // Modern Campus
    { id: 2, src: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&q=80&w=300", class: "top-[5%] -right-24", animation: "animate-[bounce_5s_infinite] delay-300" }, // University Building
    { id: 3, src: "https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&q=80&w=300", class: "bottom-[20%] -left-40", animation: "animate-[pulse_6s_infinite] delay-500" }, // Campus Arch
    { id: 4, src: "https://images.unsplash.com/photo-1525921429573-06dc73810080?auto=format&fit=crop&q=80&w=300", class: "bottom-[5%] -right-28", animation: "animate-[bounce_4.5s_infinite] delay-700" }, // Student Courtyard
    { id: 5, src: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=300", class: "top-[45%] -right-48", animation: "animate-[pulse_7s_infinite]" }, // Tech Building
];

export default function SchoolLoginPage() {
    return (
        <AuthCard
            title="School Partner Login"
            description="Enter your credentials to access the dashboard"
            footerText="Not a school admin?"
            footerLinkText="Go back"
            footerLinkHref="/login"
            decorations={universityDecorations}
        >
            <LoginForm />
        </AuthCard>
    );
}
