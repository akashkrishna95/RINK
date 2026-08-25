//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\HomePage\PartnerInstitutes.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

import { getProxiedImageUrl } from '@/lib/utils';
import { useRealTimeSync } from '@/hooks/useRealTimeSync';
import { pb, mapPbInstitution, Institution } from '@/lib/pocketbase';

interface Institute {
  id: string;
  name: string;
  logoUrl: string;
}


export default function PartnerInstitutes({ initialInstitutions }: { initialInstitutions?: Institution[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const institutions = useRealTimeSync<Institution>(
    'all_institutions',
    initialInstitutions || [],
    mapPbInstitution
  );

  const activeInstitutes: Institute[] = (institutions.length > 0 ? institutions : (initialInstitutions || []))
    .filter(inst => inst.isPartnered)
    .map(inst => ({
      id: inst.id,
      name: inst.name,
      logoUrl: inst.logoUrl
    }));

  // 18 items = exactly 6 rows on mobile (3 cols) OR 3 rows on desktop (6 cols)
  const INITIAL_VISIBLE_COUNT = 18;

  const visibleInstitutes = isExpanded
    ? activeInstitutes
    : activeInstitutes.slice(0, INITIAL_VISIBLE_COUNT);

  const hasMore = activeInstitutes.length > INITIAL_VISIBLE_COUNT;

  if (!isMounted) {
    return (
      <section 
        id="partners"
        data-section
        className="w-full py-16 px-4 md:px-12 bg-white animate-pulse"
        style={{
          contentVisibility: 'auto',
          containIntrinsicSize: '400px',
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Header Skeleton */}
          <div className="h-12 bg-slate-200 rounded w-1/4 mb-10" />
          {/* Logo Grid Skeleton */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-slate-100 rounded-xl aspect-[4/3] w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="partners"
      data-section
      className="w-full py-16 px-4 md:px-12 bg-white"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '400px',
      }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-12"
        >
          <h2 className="font-helios font-medium text-4xl sm:text-5xl md:text-7xl text-[#1b60bb] tracking-tight">
            Partnered Institutes
          </h2>
        </motion.div>

        {/* Logo Grid - 3 columns on mobile, up to 6 on desktop */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
          <AnimatePresence mode="popLayout">
            {visibleInstitutes.map((institute, index) => (
              <motion.div
                key={institute.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.3,
                  delay: (index % INITIAL_VISIBLE_COUNT) * 0.02
                }}
                className="flex items-center justify-center bg-white rounded-xl p-3 md:p-6 aspect-[4/3] shadow-[0_4px_20px_-4px_rgba(27,96,187,0.08)]"
                title={institute.name}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={getProxiedImageUrl(institute.logoUrl)}
                    alt={institute.name}
                    fill
                    className="object-contain"
                    sizes="(max-w-768px) 33vw, (max-w-1200px) 25vw, 16vw"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* See More / See Less */}
        {hasMore && (
          <div className="mt-10 flex justify-start">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="font-medium text-[16px] text-[#1b60bb] transition-opacity duration-300 flex items-center gap-2 active:opacity-70"
            >
              {isExpanded ? 'See Less' : 'See More'}
              <span className="text-xl leading-none relative top-[1px]">
                {isExpanded ? '↑' : '↓'}
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}