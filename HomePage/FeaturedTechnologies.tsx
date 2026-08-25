//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\HomePage\FeaturedTechnologies.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import TechnologyCard from './TechnologyCard';
import { normalizeIPStatus, isFeaturedTechnology } from '@/lib/utils';

interface Technology {
  id: string;
  name: string;
  image: string;
  sector: string;
  institution: string;
  ipStatus: 'Patented' | 'Patent Filed' | 'Not Specified';
  featured: boolean;
  description?: string;
}

interface FeaturedTechnologiesProps {
  initialTechnologies?: Technology[];
}

const TechnologyCardSkeleton = () => (
  <div className="w-full h-full bg-white rounded-2xl overflow-hidden flex flex-col relative border border-gray-100 shadow-[0_8px_16px_-3px_rgba(0,0,0,0.08)] animate-pulse">
    {/* Image Container Skeleton */}
    <div className="p-2 md:p-2.5">
      <div className="relative h-[140px] sm:h-[150px] md:h-[180px] w-full bg-slate-200 rounded-xl" />
    </div>
    {/* Content Skeleton */}
    <div className="flex-1 p-3 sm:p-4 md:p-5 flex flex-col bg-white">
      {/* Real Title: 2 lines min-height */}
      <div className="space-y-1.5 mb-2 min-h-[2.2rem] sm:min-h-[2.5rem]">
        <div className="h-4 bg-slate-200 rounded w-11/12" />
        <div className="h-4 bg-slate-200 rounded w-2/3" />
      </div>

      {/* Institution Label Skeleton */}
      <div className="bg-slate-50 rounded-lg p-2.5 mb-3 flex items-center gap-2">
        <div className="w-3 h-3 rounded bg-slate-200 shrink-0" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
      </div>

      {/* Short Description Skeleton (2 lines) */}
      <div className="space-y-1.5 mb-3 flex-1">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
      </div>

      {/* Footer Section Skeleton */}
      <div className="mt-auto flex items-end justify-between gap-2 border-t border-gray-100 pt-3">
        <div className="flex flex-col gap-1 w-1/3">
          <div className="h-2.5 bg-slate-100 rounded w-1/2" />
          <div className="h-3.5 bg-slate-200 rounded w-full" />
        </div>
        <div className="h-8 bg-slate-200 rounded-lg w-[100px]" />
      </div>
    </div>
  </div>
);

export default function FeaturedTechnologies({ initialTechnologies = [] }: FeaturedTechnologiesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef(false);
  const isVisible = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Drag-to-scroll states for desktop swiping
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(0);
  const dragScrollLeft = useRef(0);

  const [extendedTechnologies, setExtendedTechnologies] = useState<Technology[]>(() => {
    if (initialTechnologies.length > 0) {
      return [...initialTechnologies, ...initialTechnologies, ...initialTechnologies];
    }
    return [];
  });

  useEffect(() => {
    setIsMounted(true);

    if (initialTechnologies.length > 0) return; // Skip fetch if initialized from props

    async function fetchTechs() {
      try {
        const res = await fetch('/api/technologies');
        const json = await res.json();
        if (json.success && json.technologies) {
          let rawData = json.technologies;
          if (rawData['MAIN_SHEET']) {
            rawData = rawData['MAIN_SHEET'];
          } else if (rawData['MAIN SHEET']) {
            rawData = rawData['MAIN SHEET'];
          }

          const uniqueMap = new Map<string, Technology>();

          (rawData || []).forEach((tech: any) => {
            if (!tech.technology_id || tech.technology_id === 'technology_id') return;

            const isFeatured = isFeaturedTechnology(tech.startup_potential);
            const isPatented = normalizeIPStatus(tech.patent_status) === 'Patented';
            const hasTrl = tech.trl && tech.trl !== 'Not Specified' && tech.trl.trim() !== '';
            const hasStartupPotential = tech.startup_potential && tech.startup_potential !== '⚪ Not Specified' && tech.startup_potential.trim() !== '';

            // Show only cards that are patented, have a TRL, have startup potential, or are featured (have badge)
            if (isPatented || hasTrl || hasStartupPotential || isFeatured) {
              if (!uniqueMap.has(tech.technology_id)) {
                uniqueMap.set(tech.technology_id, {
                  id: String(tech.technology_id),
                  name: tech.technology_name || 'Untitled Technology',
                  institution: tech.institution || 'N/A',
                  sector: tech.primary_sector || tech.sector || 'N/A',
                  ipStatus: normalizeIPStatus(tech.patent_status),
                  featured: isFeatured,
                  image: tech.image_url || '/placeholder.jpg',
                  description: tech.description || tech.brief_description_abstract || tech.problem_solved || '',
                });
              }
            }
          });

          const getSortScore = (tech: Technology) => {
            const hasImage = tech.image && !tech.image.includes('placeholder') && tech.image.trim() !== '';
            const isFeatured = tech.featured;

            if (hasImage && isFeatured) return 3;
            if (hasImage) return 2;
            if (isFeatured) return 1;
            return 0;
          };

          const processedTechs = Array.from(uniqueMap.values())
            .sort((a, b) => getSortScore(b) - getSortScore(a));

          // Tripled array to facilitate seamless infinite native scrolling
          setExtendedTechnologies([
            ...processedTechs,
            ...processedTechs,
            ...processedTechs,
          ]);
        }
      } catch (error) {
        console.error("Failed to load featured technologies:", error);
      }
    }
    fetchTechs();
  }, [initialTechnologies]);

  // Monitor element intersection with viewport to pause when offscreen
  useEffect(() => {
    if (!isMounted) return;
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [isMounted]);

  // Handler for pausing the entire carousel
  const handleInteractionStart = useCallback(() => {
    isInteracting.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Handler for resuming the animation after 3 seconds of no interaction
  const handleInteractionEnd = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      isInteracting.current = false;
      timeoutRef.current = null;
    }, 3000);
  }, []);

  // Drag-to-scroll handlers for desktop swiping
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    setIsDragging(true);
    handleInteractionStart();
    dragStart.current = e.pageX - container.offsetLeft;
    dragScrollLeft.current = container.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - dragStart.current) * 1.5; // Drag sensitivity multiplier
    container.scrollLeft = dragScrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      handleInteractionEnd();
    }
  };

  const handleWheel = () => {
    handleInteractionStart();
    handleInteractionEnd(); // Automatically starts the 5s delay timer
  };

  // Infinite Auto-Scroll Logic (Moves Right to Left automatically)
  useEffect(() => {
    if (!isMounted || extendedTechnologies.length === 0) return;
    const container = containerRef.current;
    if (!container) return;

    // Detect if we are on a mobile/tablet or touch device to disable auto-scroll reflow loops.
    // This saves 100% CPU cycles on mobile phones and ensures butter-smooth page scrolling!
    const isMobileDevice = typeof window !== 'undefined' && (window.innerWidth < 1024 || 'ontouchstart' in window);
    
    if (isMobileDevice) {
      let scrollWidth = container.scrollWidth;
      container.scrollLeft = scrollWidth / 3;

      const handleResize = () => {
        if (container) {
          container.scrollLeft = container.scrollWidth / 3;
        }
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }

    // Cache scrollWidth to prevent layouts thrashing reflows inside requestAnimationFrame loop
    let scrollWidth = container.scrollWidth;

    const handleResize = () => {
      if (container) {
        scrollWidth = container.scrollWidth;
      }
    };
    window.addEventListener('resize', handleResize);

    // Start user in the middle section for infinite drag in both directions
    container.scrollLeft = scrollWidth / 3;

    let animationId: number;
    let currentScroll = container.scrollLeft;
    let lastTime = performance.now();

    const scroll = (now: number) => {
      const deltaTime = now - lastTime;
      lastTime = now;

      // Handle cases where deltaTime is excessively large (e.g., background tab)
      const clampedDelta = Math.min(deltaTime, 32); 

      if (!isInteracting.current && isVisible.current) {
        const speed = 0.10; // pixels per millisecond (speed set to 0.10)
        currentScroll += speed * clampedDelta;

        // Loop back seamlessly using cached calculation
        const oneThird = scrollWidth / 3;
        if (currentScroll >= oneThird * 2) {
          currentScroll -= oneThird;
        } else if (currentScroll <= 0) {
          currentScroll += oneThird;
        }
        container.scrollLeft = currentScroll;
      } else {
        // Sync float scroll value with actual DOM scrollLeft when user drags/interacts or offscreen
        currentScroll = container.scrollLeft;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isMounted, extendedTechnologies.length]);

  if (!isMounted) {
    return (
      <div id="technologies" data-section className="w-full relative">
        <div 
          className="bg-gradient-to-b from-[#36a8fb] via-[#1b60bb] to-[#153156] relative pt-[140px] md:pt-[180px] pb-[100px] md:pb-[140px] overflow-hidden flex flex-col justify-center"
          style={{ 
            border: 'none', 
            borderWidth: 0, 
            boxShadow: 'none',
            contentVisibility: 'auto',
            containIntrinsicSize: '600px'
          }}
        >
          {/* Top Inverted Curve Mask with Title */}
          <div
            className="absolute top-0 left-0 right-0 h-[140px] md:h-[180px] bg-[#eff9ff] rounded-b-[3rem] md:rounded-b-[4rem] z-10 w-full flex items-center justify-center pt-4"
            style={{ border: 'none', borderWidth: 0, boxShadow: 'none', top: '-2px' }}
          >
            <h2 className="font-helios font-medium text-4xl sm:text-5xl md:text-6xl text-[#1b60bb] tracking-wide px-4 text-center leading-tight">
              Explore Technologies
            </h2>
          </div>
          {/* Carousel Skeleton */}
          <div className="w-full relative z-20">
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-16 pt-16 md:pt-20 px-[10vw] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-shrink-0 w-[240px] xs:w-[260px] sm:w-[280px] md:w-[320px] h-[360px] sm:h-[380px] md:h-[420px]">
                  <TechnologyCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="technologies" data-section className="w-full relative">

      {/* Main Container Gradient */}
      <div 
        className="bg-gradient-to-b from-[#36a8fb] via-[#1b60bb] to-[#153156] relative pt-[140px] md:pt-[180px] pb-[100px] md:pb-[140px] overflow-hidden flex flex-col justify-center"
        style={{ 
          border: 'none', 
          borderWidth: 0, 
          boxShadow: 'none',
          contentVisibility: 'auto',
          containIntrinsicSize: '600px'
        }}
      >

        {/* Top Inverted Curve Mask with Title */}
        <div
          className="absolute top-0 left-0 right-0 h-[140px] md:h-[180px] bg-[#eff9ff] rounded-b-[3rem] md:rounded-b-[4rem] z-10 w-full flex items-center justify-center pt-4"
          style={{ border: 'none', borderWidth: 0, boxShadow: 'none', top: '-2px' }}
        >
          <h2 className="font-helios font-medium text-4xl sm:text-5xl md:text-6xl text-[#1b60bb] tracking-wide px-4 text-center leading-tight">
            Explore Technologies
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="w-full relative z-20">
          <div
            ref={containerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto pb-16 pt-16 md:pt-20 px-[10vw] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing snap-y select-none transform-gpu"
            style={{ 
              WebkitOverflowScrolling: 'touch',
              willChange: 'scroll-position',
              transform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
            onWheel={handleWheel}
          >
            {extendedTechnologies.map((tech, index) => {
              const uniqueId = `${tech.id}-${index}`;

              return (
                <div
                  key={uniqueId}
                  className="flex-shrink-0 w-[240px] xs:w-[260px] sm:w-[280px] md:w-[320px] relative h-[360px] sm:h-[380px] md:h-[420px] transition-transform duration-300 ease-out hover:-translate-y-4 hover:z-50 will-change-transform transform-gpu"
                  style={{
                    transform: 'translate3d(0, 0, 0)',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  <TechnologyCard
                    id={tech.id}
                    name={tech.name}
                    image={tech.image}
                    sector={tech.sector}
                    institution={tech.institution}
                    ipStatus={tech.ipStatus}
                    featured={tech.featured}
                    description={tech.description}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Inverted Curve Mask */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[80px] md:h-[120px] bg-[#eff9ff] rounded-t-[3rem] md:rounded-t-[4rem] z-10 w-full"
          style={{ border: 'none', borderWidth: 0, boxShadow: 'none', bottom: '-2px' }}
        />

      </div>
    </div>
  );
}