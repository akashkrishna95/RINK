'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollRestoration() {
  const pathname = usePathname();
  const activeSectionRef = useRef<string>('');
  const isRestoringRef = useRef<boolean>(false);

  // Helper to calculate which section has the largest visible area in the viewport
  const getActiveSection = (): string => {
    const sections = document.querySelectorAll('[data-section]');
    let activeSectionId = '';
    let maxVisibleHeight = 0;
    const viewportHeight = window.innerHeight;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(viewportHeight, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);

      if (visibleHeight > maxVisibleHeight) {
        maxVisibleHeight = visibleHeight;
        activeSectionId = section.id;
      }
    });

    return activeSectionId;
  };

  // 1. Restore scroll position on page load or pathname change
  useEffect(() => {
    const targetId = window.location.hash.replace('#', '') || sessionStorage.getItem(`activeSection_${pathname}`);
    if (!targetId) {
      isRestoringRef.current = false;
      return;
    }

    isRestoringRef.current = true;
    let scrollAttempts = 0;
    const maxAttempts = 20;

    const stopRestoring = () => {
      isRestoringRef.current = false;
    };

    const attemptScroll = () => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'auto' });
        scrollAttempts++;
        if (scrollAttempts >= maxAttempts) {
          clearInterval(scrollInterval);
          stopRestoring();
        }
      }
    };

    // Attempt immediately and then periodically to handle hydration and dynamic layout shifts
    attemptScroll();
    const scrollInterval = setInterval(attemptScroll, 100);

    const handleWindowLoad = () => {
      attemptScroll();
      clearInterval(scrollInterval);
      stopRestoring();
    };
    window.addEventListener('load', handleWindowLoad);

    // Stop restoration if user manually interacts (scrolling, touching, keyboard presses)
    window.addEventListener('wheel', stopRestoring, { passive: true });
    window.addEventListener('touchstart', stopRestoring, { passive: true });
    window.addEventListener('keydown', stopRestoring, { passive: true });

    // Safety timeout to ensure isRestoring gets turned off even if everything else fails
    const safetyTimeout = setTimeout(stopRestoring, 2000);

    return () => {
      clearInterval(scrollInterval);
      window.removeEventListener('load', handleWindowLoad);
      window.removeEventListener('wheel', stopRestoring);
      window.removeEventListener('touchstart', stopRestoring);
      window.removeEventListener('keydown', stopRestoring);
      clearTimeout(safetyTimeout);
    };
  }, [pathname]);

  // 2. Observe active section while scrolling and update sessionStorage/URL hash
  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]');
    if (sections.length === 0) return;

    const updateActiveSection = () => {
      if (isRestoringRef.current) return;

      const activeId = getActiveSection();
      if (activeId && activeId !== activeSectionRef.current) {
        activeSectionRef.current = activeId;
        sessionStorage.setItem(`activeSection_${pathname}`, activeId);
        
        // Silently update the hash in the browser URL
        if (activeId === 'hero') {
          window.history.replaceState(null, '', pathname);
        } else {
          window.history.replaceState(null, '', `${pathname}#${activeId}`);
        }
      }
    };

    const handleIntersection = () => {
      updateActiveSection();
    };

    // Watch sections with a multi-threshold intersection observer
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    });

    sections.forEach((section) => observer.observe(section));

    // Initial check
    updateActiveSection();

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
