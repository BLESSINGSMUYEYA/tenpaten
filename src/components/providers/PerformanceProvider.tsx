'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface PerformanceContextType {
    isLiteMode: boolean;
    setLiteMode: (value: boolean) => void;
    toggleLiteMode: () => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
    const [isLiteMode, setIsLiteMode] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('tenpaten-lite-mode');
        if (saved === 'true') {
            setIsLiteMode(true);
        } else if (!saved) {
            // Optional: Auto-enable if connection is slow?
            // (navigator as any).connection?.saveData could be checked here
            if (typeof navigator !== 'undefined' && (navigator as any).connection?.saveData) {
                setIsLiteMode(true);
            }
        }
    }, []);

    const setLiteMode = (value: boolean) => {
        setIsLiteMode(value);
        localStorage.setItem('tenpaten-lite-mode', String(value));
        
        // Also set a cookie for server-side awareness if needed
        document.cookie = `lite-mode=${value}; path=/; max-age=31536000`;
    };

    const toggleLiteMode = () => setLiteMode(!isLiteMode);

    return (
        <PerformanceContext.Provider value={{ isLiteMode, setLiteMode, toggleLiteMode }}>
            {children}
        </PerformanceContext.Provider>
    );
}

export function usePerformance() {
    const context = useContext(PerformanceContext);
    
    // Fallback to a safe default if the provider is missing (e.g., in some auth layouts or during edge-case hydration)
    if (context === undefined) {
        return {
            isLiteMode: false,
            setLiteMode: () => {},
            toggleLiteMode: () => {},
        };
    }
    return context;
}
