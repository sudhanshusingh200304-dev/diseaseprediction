import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallAppButton = () => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-ignore
      window.navigator.standalone === true;
    if (isStandalone) setInstalled(true);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setDeferred(null);
    });
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleClick = async () => {
    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === 'accepted') toast.success('App installed!');
      setDeferred(null);
      return;
    }

    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua);
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    const isFirefox = /Firefox/i.test(ua);

    if (isIOS && isSafari) {
      toast.info('Tap the Share icon, then "Add to Home Screen" to install.', { duration: 6000 });
    } else if (isFirefox) {
      toast.info('Firefox: open the page menu and choose "Install" or use a Chromium browser.', { duration: 6000 });
    } else {
      toast.info('Open your browser menu and choose "Install app" or look for the install icon in the address bar.', { duration: 6000 });
    }
  };

  if (installed) return null;

  return (
    <Button onClick={handleClick} variant="outline" size="sm" className="gap-2">
      <Download className="w-4 h-4" />
      Install App
    </Button>
  );
};

export default InstallAppButton;
