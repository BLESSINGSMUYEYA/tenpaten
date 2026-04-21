'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { usePerformance } from '@/components/providers/PerformanceProvider';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * PageTransition Component
 * 
 * Provides a high-fidelity, "Single Page App" feel for dashboard navigation.
 * Uses Framer Motion for snappy, professional animations.
 * 
 * Behavior:
 * - Desktop (>= 1024px): Subtle horizontal "Slide & Fade".
 * - Mobile (< 1024px): Subtle vertical "Lift & Fade".
 * - Timing: Targeted at 0.3s for a productive, responsive feel.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const { isLiteMode } = usePerformance();

  // Responsive check for animation variants
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isLiteMode) {
    return <div key={pathname}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: {
            opacity: 0,
            y: isMobile ? 15 : 0,
            x: isMobile ? 0 : 15,
            filter: 'blur(4px)',
          },
          animate: {
            opacity: 1,
            y: 0,
            x: 0,
            filter: 'blur(0px)',
            transition: {
              duration: 0.3,
              // Custom cubic-bezier for a "Premium" snappy, elastic feel
              ease: [0.22, 1, 0.36, 1],
            },
          },
          exit: {
            opacity: 0,
            y: isMobile ? -15 : 0,
            x: isMobile ? 0 : -15,
            filter: 'blur(4px)',
            transition: {
              duration: 0.2,
              ease: "easeInOut",
            },
          },
        }}
        className="w-full h-full will-change-[transform,opacity]"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
