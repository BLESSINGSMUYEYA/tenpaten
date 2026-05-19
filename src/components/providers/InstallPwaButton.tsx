"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export default function InstallPwaButton() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if we are already in standalone mode
    if (
      typeof window !== "undefined" &&
      (window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone)
    ) {
      setIsInstalled(true);
    }

    // Check if the event is already stored on the window
    if (typeof window !== "undefined" && (window as any).deferredPrompt) {
      setInstallPrompt((window as any).deferredPrompt);
    }

    const handleInstallAvailable = () => {
      setInstallPrompt((window as any).deferredPrompt);
    };

    window.addEventListener("pwa-install-available", handleInstallAvailable);

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      (window as any).deferredPrompt = null;
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("pwa-install-available", handleInstallAvailable);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();

    const { outcome } = await installPrompt.userChoice;
    console.log(`[PWA] User response to the install prompt: ${outcome}`);

    (window as any).deferredPrompt = null;
    setInstallPrompt(null);
  };

  // If already installed or prompt is not available, don't show the button
  if (isInstalled || !installPrompt) {
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d5a22d] text-[#1a1b41] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:shadow-xl hover:shadow-[#d5a22d]/20 transition-all active:scale-95 duration-300 cursor-pointer"
    >
      <Download className="w-3.5 h-3.5" />
      Install App
    </button>
  );
}
