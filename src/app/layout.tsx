import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import { PerformanceProvider } from "@/components/providers/PerformanceProvider";
import { Toaster } from "sonner";
import PusherWrapper from "@/components/providers/PusherWrapper";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Tenpaten Apply | Global Education Platform",
    template: "%s | Tenpaten Apply"
  },
  description: "Tenpaten Apply is the premier all-in-one platform connecting international students with world-class universities and empowering education partners. Streamline applications and discover globally accredited programs.",
  keywords: ["education", "international students", "study abroad", "university application", "education affiliate", "student recruitment"],
  authors: [{ name: "Tenpaten Global Team" }],
  creator: "Tenpaten Global",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tenpaten.com",
    title: "Tenpaten Apply | Global Education Platform",
    description: "Connect with world-class universities or empower your education recruitment business with Tenpaten Apply's all-in-one platform.",
    siteName: "Tenpaten Apply"
  },
  twitter: {
    card: "summary_large_image",
    title: "Tenpaten Apply | Global Education Platform",
    description: "Connect with world-class universities or empower your education recruitment business.",
    creator: "@tenpaten"
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} antialiased`}
      >
        <NextAuthProvider>
          <PerformanceProvider>
            {children}
            <PusherWrapper />
            <Toaster richColors position="top-center" />
          </PerformanceProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
