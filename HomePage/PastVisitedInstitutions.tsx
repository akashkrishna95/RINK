'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getProxiedImageUrl } from '@/lib/utils';

interface Institution {
  name: string;
  logoUrl: string;
}

function InstitutionLogoCard({ inst, index }: { inst: Institution; index: number }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="flex items-center justify-center bg-white rounded-2xl p-2.5 w-36 md:w-48 h-24 md:h-28 shadow-[0_4px_20px_-4px_rgba(27,96,187,0.08)] border border-slate-100/50 shrink-0 select-none"
      title={inst.name}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {inst.logoUrl && !imgError ? (
          <img
            src={getProxiedImageUrl(inst.logoUrl)}
            alt={inst.name}
            className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="font-poppins text-xs md:text-sm font-semibold text-[#1b60bb] text-center px-1.5 leading-snug whitespace-normal break-words line-clamp-3">
            {inst.name}
          </span>
        )}
      </div>
    </div>
  );
}

export default function PastVisitedInstitutions() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInstitutions() {
      try {
        const res = await fetch('/api/past-visited-institutions');
        const data = await res.json();
        if (data.success && data.institutions) {
          setInstitutions(data.institutions);
        }
      } catch (err) {
        console.error('Failed to load past visited institutions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInstitutions();
  }, []);

  if (loading || institutions.length === 0) return null;

  // Doubled list for seamless infinite marquee loop (saves 33% DOM nodes compared to tripling)
  const listToRender = [...institutions, ...institutions];

  return (
    <section className="w-full py-16 bg-[#F4F7FB] overflow-hidden border-t border-slate-200/50">
      {/* Inject GPU Accelerated CSS Marquee */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-smooth {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee-smooth {
          animation: marquee-smooth 35s linear infinite;
          will-change: transform;
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        @media (min-width: 768px) {
          .animate-marquee-smooth {
            gap: 3rem;
          }
        }
        .animate-marquee-smooth:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-helios font-medium text-4xl sm:text-5xl md:text-7xl text-[#1b60bb] tracking-tight text-center md:text-left"
        >
          Past Visited Institutions
        </motion.h2>
      </div>

      {/* Infinite Horizontal Carousel */}
      <div className="relative w-full overflow-hidden flex py-4">
        {/* Left and Right Blur Faders for a Premium Look */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#F4F7FB] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#F4F7FB] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-smooth w-max">
          {listToRender.map((inst, index) => (
            <InstitutionLogoCard
              key={`${inst.name}-${index}`}
              inst={inst}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
