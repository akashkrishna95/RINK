'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, CircleCheckBig, Building2 } from 'lucide-react';
import Image from 'next/image';
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

export default function FeaturedTechnologies() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef(false);
  const [isMounted, setIsMounted] = useState(false);
  const [extendedTechnologies, setExtendedTechnologies] = useState<Technology[]>([]);

  useEffect(() => {
    setIsMounted(true);

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
            
            if (isFeatured || isPatented) {
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
  }, []);

  // Handler for pausing the entire carousel and optionally targeting a specific card
  const handleInteractionStart = useCallback((cardUniqueId?: string) => {
    isInteracting.current = true;
    if (cardUniqueId) setHoveredCard(cardUniqueId);
  }, []);

  // Handler for resuming the animation immediately when interaction stops
  const handleInteractionEnd = useCallback(() => {
    isInteracting.current = false;
    setHoveredCard(null);
  }, []);

  // Infinite Auto-Scroll Logic (Moves Right to Left automatically)
  useEffect(() => {
    if (!isMounted || extendedTechnologies.length === 0) return;
    const container = containerRef.current;
    if (!container) return;

    // Start user in the middle section for infinite drag in both directions
    container.scrollLeft = container.scrollWidth / 3;

    let animationId: number;
    const scroll = () => {
      if (!isInteracting.current) {
        container.scrollLeft += 0.5; // Reduced speed from 1.2 to 0.5 for slower carousel

        // Loop back seamlessly using direct calculation to avoid jumps
        const oneThird = container.scrollWidth / 3;
        if (container.scrollLeft >= oneThird * 2) {
          container.scrollLeft -= oneThird;
        } else if (container.scrollLeft <= 0) {
          container.scrollLeft += oneThird;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isMounted, extendedTechnologies.length]);

  const getIPStatusColor = (status: string) => {
    switch (status) {
      case 'Patented':
        return 'text-[#1d984a]';
      case 'Patent Filed':
        return 'text-[#1b60bb]';
      case 'Not Specified':
        return 'text-[#ff3131]';
      default:
        return 'text-gray-500';
    }
  };

  if (!isMounted) return null;

  return (
    <div className="w-full relative">

      {/* Main Container Gradient */}
      <div className="bg-gradient-to-b from-[#36a8fb] via-[#1b60bb] to-[#153156] relative pt-[100px] md:pt-[140px] pb-[160px] md:pb-[190px] overflow-hidden flex flex-col justify-center min-h-[620px] sm:min-h-[660px] md:min-h-[720px]">

        {/* Top Inverted Curve Mask with Title */}
        <div
          className="absolute top-0 left-0 right-0 h-[85px] md:h-[120px] bg-[#eff9ff] rounded-b-[2rem] md:rounded-b-[3.5rem] z-10 w-full flex items-center justify-center pt-2 shadow-sm"
        >
          <h2 className="font-helios font-black text-2xl md:text-[34px] lg:text-[38px] text-[#1b60bb] tracking-wide px-4 text-center leading-tight">
            Explore Technologies
          </h2>
        </div>

        {/* Carousel Container */}
        {/* Attached mouse/touch handlers to the parent to pause even when hovering the gaps */}
        <div
          className="w-full relative z-20"
          onMouseEnter={() => { isInteracting.current = true; }}
          onMouseLeave={handleInteractionEnd}
          onTouchStart={() => { isInteracting.current = true; }}
          onTouchEnd={handleInteractionEnd}
        >
          <div
            ref={containerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto pb-8 pt-4 md:pb-12 md:pt-6 px-[10vw] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing snap-y"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {extendedTechnologies.map((tech, index) => {
              const uniqueId = `${tech.id}-${index}`;

              return (
                <div
                  key={uniqueId}
                  onMouseEnter={() => handleInteractionStart(uniqueId)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onTouchStart={() => handleInteractionStart(uniqueId)}
                  className="flex-shrink-0 w-[240px] xs:w-[260px] sm:w-[280px] md:w-[320px] relative h-[360px] sm:h-[380px] md:h-[420px]"
                >
                  <TechnologyCard 
                    id={tech.id}
                    name={tech.name}
                    image={tech.image}
                    sector={tech.sector}
                    institution={tech.institution}
                    ipStatus={tech.ipStatus as any}
                    featured={tech.featured}
                    description={tech.description}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Inverted Curve Mask with Content */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[150px] md:h-[180px] bg-[#eff9ff] rounded-t-[2rem] md:rounded-t-[3.5rem] z-10 w-full flex flex-col items-center justify-center px-4 pb-4"
        >
          <h3 className="text-[#1b60bb] text-[16px] md:text-[20px] font-medium text-center mb-3 leading-snug">
            Wanna Know What&apos;s New Technology<br className="hidden md:block" /> for your Startup?
          </h3>
          <Link href="/technologies/browse_technologies">
            <button className="group/btn bg-[#0057b7] hover:bg-[#004494] text-white px-5 py-2 md:px-6 md:py-2.5 rounded-lg font-semibold text-sm md:text-base flex items-center gap-1.5 shadow-sm transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-md">
              Explore More
              <ArrowUpRight
                size={18}
                strokeWidth={2.5}
                className="transition-transform duration-700 ease-out group-hover/btn:translate-x-[2px] group-hover/btn:-translate-y-[2px]"
              />
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
