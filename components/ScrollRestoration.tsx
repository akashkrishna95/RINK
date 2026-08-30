'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollRestoration() {
  const pathname = usePathname();
  const isRestoringRef = useRef<boolean>(false);

  useEffect(() => {
    // Only attempt scroll-into-view if there is an explicit hash in the URL (e.g. #about-rink)
    const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';

    if (!hash) {
      // If navigating to a plain page without hash (like Home /), clear any cached section and scroll to top
      isRestoringRef.current = false;
      try {
        sessionStorage.removeItem(`activeSection_${pathname}`);
      } catch {}
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }

    // If explicit hash exists, smoothly scroll to that specific element once
    isRestoringRef.current = true;
    let attempts = 0;
    const maxAttempts = 10;

    const stop = () => {
      isRestoringRef.current = false;
    };

    const attemptScrollToHash = () => {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        stop();
        return true;
      }
      attempts++;
      if (attempts >= maxAttempts) {
        stop();
        return true;
      }
      return false;
    };

    if (!attemptScrollToHash()) {
      const interval = setInterval(() => {
        if (attemptScrollToHash()) {
          clearInterval(interval);
        }
      }, 100);

      const handleUserInteraction = () => {
        clearInterval(interval);
        stop();
      };

      window.addEventListener('wheel', handleUserInteraction, { passive: true });
      window.addEventListener('touchstart', handleUserInteraction, { passive: true });
      window.addEventListener('keydown', handleUserInteraction, { passive: true });

      return () => {
        clearInterval(interval);
        window.removeEventListener('wheel', handleUserInteraction);
        window.removeEventListener('touchstart', handleUserInteraction);
        window.removeEventListener('keydown', handleUserInteraction);
      };
    }
  }, [pathname]);

  return null;
}
