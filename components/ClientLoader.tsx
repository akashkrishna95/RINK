'use client';

import { useState, useEffect } from 'react';
import PremiumLoader from '@/HomePage/PremiumLoader';

export default function ClientLoader({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {!isMounted && <PremiumLoader />}
      <div 
        className={!isMounted ? 'opacity-0 pointer-events-none' : 'opacity-100 transition-opacity duration-500 ease-out'}
      >
        {children}
      </div>
    </>
  );
}
