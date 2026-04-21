import { CheckCircle2, GraduationCap, TrendingUp } from 'lucide-react';
import { TenpatenLogo } from '../branding/TenpatenLogo';
import { ReactNode } from 'react';

interface Feature {
    icon: ReactNode;
    title: string;
    description: string;
}

interface AuthSplitLayoutProps {
    children: ReactNode;
    heroTitle?: ReactNode;
    heroDescription?: ReactNode;
    features?: Feature[];
}

const defaultFeatures: Feature[] = [
    {
        icon: <GraduationCap className="w-6 h-6 text-blue-200" />,
        title: "Partner with Top Universities",
        description: "Access a global network of educational institutions."
    },
    {
        icon: <CheckCircle2 className="w-6 h-6 text-blue-200" />,
        title: "Streamlined Application Process",
        description: "Submit and track student applications in real-time."
    },
    {
        icon: <TrendingUp className="w-6 h-6 text-blue-200" />,
        title: "Grow Your Business",
        description: "Manage commissions and scale your educational consultancy."
    }
];

export default function AuthSplitLayout({
    children,
    heroTitle = (
        <>
            Connect Students with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100">Global Opportunities</span>
        </>
    ),
    heroDescription = "The all-in-one affiliate application platform for international education. Streamline your recruitment, manage applications, and grow your network.",
    features = defaultFeatures
}: AuthSplitLayoutProps) {
    return (
        <main className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Column - Introduction */}
            <div className="flex-1 bg-indigo-600 text-white p-8 lg:p-16 flex flex-col justify-center relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-20">
                    <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-purple-500 rounded-full blur-3xl" />
                    <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-blue-400 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 max-w-xl mx-auto lg:mx-0">
                    <div className="mb-8 scale-110 origin-left">
                        <TenpatenLogo variant="white" />
                    </div>

                    <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                        {heroTitle}
                    </h1>

                    <p className="text-lg lg:text-xl text-indigo-100 mb-10 leading-relaxed">
                        {heroDescription}
                    </p>

                    <div className="space-y-4">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="bg-white/10 p-2 rounded-full">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                                    <p className="text-sm text-indigo-200">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column - Content */}
            <div className="flex-1 relative">
                {children}
            </div>
        </main>
    );
}
