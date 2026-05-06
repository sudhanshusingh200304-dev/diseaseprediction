import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, X, Monitor } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "pwa-install-dismissed";

type Platform = "windows" | "mac" | "android" | "ios" | "linux" | "other";

const detectPlatform = (): Platform => {
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return "windows";
  if (/Android/i.test(ua)) return "android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Mac OS X/i.test(ua)) return "mac";
  if (/Linux/i.test(ua)) return "linux";
  return "other";
};

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.matchMedia("(display-mode: window-controls-overlay)").matches ||
  // iOS Safari
  (navigator as unknown as { standalone?: boolean }).standalone === true;

const isInIframe = (() => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
})();

const PWAInstallPrompt = () => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [platform, setPlatform] = useState<Platform>("other");

  useEffect(() => {
    if (isInIframe) return;
    if (isStandalone()) return;
    if (sessionStorage.getItem(DISMISS_KEY)) return;

    const p = detectPlatform();
    setPlatform(p);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    const installed = () => {
      setVisible(false);
      setShowHint(false);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installed);

    // Fallback: on desktop (Windows/Mac/Linux) Edge/Chrome usually fires
    // beforeinstallprompt within a couple seconds. If it doesn't (Firefox,
    // Safari, or app already installed), surface a manual hint so users still
    // see how to install on Windows.
    const timer = window.setTimeout(() => {
      if (!isStandalone() && !sessionStorage.getItem(DISMISS_KEY)) {
        setShowHint(true);
      }
    }, 3500);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installed);
      window.clearTimeout(timer);
    };
  }, []);

  const onDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
    setShowHint(false);
  };

  // Native install path (Edge/Chrome on Windows, Android, etc.)
  if (visible && deferred) {
    const onInstall = async () => {
      await deferred.prompt();
      await deferred.userChoice;
      setVisible(false);
      setDeferred(null);
    };
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-card border border-border rounded-lg shadow-hover p-4 flex items-center gap-3 animate-slide-up">
        <div className="p-2 rounded-md gradient-primary">
          <Download className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">Install HealthPredict</p>
          <p className="text-xs text-muted-foreground">
            {platform === "windows"
              ? "Install as a Windows app for quick access."
              : "Get quick access & offline support."}
          </p>
        </div>
        <Button size="sm" onClick={onInstall}>Install</Button>
        <button onClick={onDismiss} aria-label="Dismiss" className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Manual hint (Firefox / Safari / browsers without beforeinstallprompt)
  if (showHint) {
    const hint =
      platform === "windows"
        ? "In Edge/Chrome, click the install icon in the address bar, or open the menu → Apps → Install this site."
        : platform === "mac"
        ? "In Chrome/Edge, open the menu → Cast, save and share → Install. In Safari, use Share → Add to Dock."
        : platform === "ios"
        ? "Tap Share → Add to Home Screen to install."
        : platform === "android"
        ? "Open the browser menu and tap Install app or Add to Home screen."
        : "Open your browser menu and choose Install app / Add to Home screen.";
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-card border border-border rounded-lg shadow-hover p-4 flex items-start gap-3 animate-slide-up">
        <div className="p-2 rounded-md gradient-primary">
          <Monitor className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">Install HealthPredict</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
        <button onClick={onDismiss} aria-label="Dismiss" className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return null;
};

export default PWAInstallPrompt;
