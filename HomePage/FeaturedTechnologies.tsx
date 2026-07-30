'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import TechnologyCard from './technologies/TechnologyCard';
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

export default function FeaturedTechnologies({ initialTechnologies = [] }: FeaturedTechnologiesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef(false);
  const isVisible = useRef(false);
  const [isMounted, setIsMounted] = useState(false);
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
  }, []);

  // Handler for resuming the animation immediately when interaction stops
  const handleInteractionEnd = useCallback(() => {
    isInteracting.current = false;
  }, []);

  // Infinite Auto-Scroll Logic (Moves Right to Left automatically)
  useEffect(() => {
    if (!isMounted || extendedTechnologies.length === 0) return;
    const container = containerRef.current;
    if (!container) return;

    // Start user in the middle section for infinite drag in both directions
    container.scrollLeft = container.scrollWidth / 3;

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

        // Loop back seamlessly using direct calculation to avoid jumps
        const oneThird = container.scrollWidth / 3;
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
    };
  }, [isMounted, extendedTechnologies.length]);

  if (!isMounted) return null;

  return (
    <div className="w-full relative">

      {/* Main Container Gradient */}
      <div className="bg-gradient-to-b from-[#36a8fb] via-[#1b60bb] to-[#153156] relative pt-[140px] md:pt-[180px] pb-[100px] md:pb-[140px] overflow-hidden flex flex-col justify-center">

        {/* Top Inverted Curve Mask with Title */}
        <div
          className="absolute top-0 left-0 right-0 h-[140px] md:h-[180px] bg-[#eff9ff] rounded-b-[3rem] md:rounded-b-[4rem] z-10 w-full flex items-center justify-center pt-4 shadow-sm"
        >
          <h2 className="font-helios font-black text-3xl md:text-[45px] lg:text-[50px] text-[#1b60bb] tracking-wide px-4 text-center leading-tight">
            Explore Technologies
          </h2>
        </div>

        {/* Carousel Container */}
        <div
          className="w-full relative z-20"
          onMouseEnter={handleInteractionStart}
          onMouseLeave={handleInteractionEnd}
          onTouchStart={handleInteractionStart}
          onTouchEnd={handleInteractionEnd}
        >
          <div
            ref={containerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto pb-16 pt-16 md:pt-20 px-[10vw] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing snap-y"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {extendedTechnologies.map((tech, index) => {
              const uniqueId = `${tech.id}-${index}`;

              return (
                <div
                  key={uniqueId}
                  className="flex-shrink-0 w-[240px] xs:w-[260px] sm:w-[280px] md:w-[320px] relative h-[360px] sm:h-[380px] md:h-[420px] transition-transform duration-300 ease-out hover:-translate-y-4 hover:z-50 will-change-transform"
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
        />

      </div>
    </div>
  );
}