'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, CircleCheckBig, Building2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Technology {
  id: string;
  name: string;
  image: string;
  sector: string;
  institution: string;
  ipStatus: 'Patented' | 'Patent Filed' | 'Not Specified' | string;
  featured: boolean;
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
          if (rawData['MAIN SHEET']) {
            rawData = rawData['MAIN SHEET'];
          }
          const processedTechs: Technology[] = (rawData || [])
            .filter((tech: any) => tech.technology_id && tech.technology_id !== 'technology_id')
            .map((tech: any) => ({
              id: String(tech.technology_id),
              name: tech.technology_name || 'Untitled Technology',
              institution: tech.institution || 'N/A',
              sector: tech.sector || 'N/A',
              ipStatus: tech.patent_status || 'Not Specified',
              featured: tech.startup_potential === 'High',
              image: tech.image_url || '/images/placeholder-tech.jpg',
            }))
            .filter(t => t.featured) // only show featured ones on the home page
            .slice(0, 10); // get top 10

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
      <div className="bg-gradient-to-b from-[#36a8fb] via-[#1b60bb] to-[#153156] relative pt-[180px] md:pt-[220px] pb-[200px] md:pb-[240px] overflow-hidden flex flex-col justify-center min-h-[650px] md:min-h-[750px]">

        {/* Top Inverted Curve Mask with Title */}
        <div
          className="absolute top-0 left-0 right-0 h-[140px] md:h-[180px] bg-[#eff9ff] rounded-b-[3rem] md:rounded-b-[4rem] z-10 w-full flex items-center justify-center pt-4 shadow-sm"
        >
          <h2 className="font-helios font-black text-3xl md:text-[45px] lg:text-[50px] text-[#1b60bb] tracking-wide px-4 text-center leading-tight">
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
            className="flex gap-4 md:gap-6 overflow-x-auto pb-16 pt-8 px-[10vw] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing snap-y"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {extendedTechnologies.map((tech, index) => {
              const uniqueId = `${tech.id}-${index}`;
              const isHovered = hoveredCard === uniqueId;

              return (
                <motion.div
                  key={uniqueId}
                  onMouseEnter={() => handleInteractionStart(uniqueId)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onTouchStart={() => handleInteractionStart(uniqueId)}
                  animate={{
                    y: isHovered ? -16 : 0,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [0.25, 0.1, 0.25, 1], // Smooth lifting curve
                  }}
                  style={{
                    willChange: 'transform',
                    zIndex: isHovered ? 50 : 0
                  }}
                  className="flex-shrink-0 w-[260px] md:w-[320px] relative"
                >
                  <Link href={`/technologies/${tech.id}`} className="block h-full outline-none">
                    <motion.div
                      className="bg-white rounded-[20px] overflow-hidden h-full flex flex-col relative group"
                      animate={{
                        boxShadow: isHovered
                          ? "0 30px 60px -12px rgba(0, 0, 0, 0.5)"
                          : "0 10px 15px -3px rgba(0, 0, 0, 0.3)"
                      }}
                      transition={{ duration: 0.4 }}
                    >

                      {/* Image Container */}
                      <div className="p-[2px] md:p-[3px]">
                        <div className="relative h-[170px] md:h-[190px] w-full overflow-hidden rounded-[16px] bg-gray-100">

                          <Image
                            src={tech.image}
                            alt={tech.name}
                            fill
                            className="object-cover"
                            sizes="(max-width:768px) 260px, 320px"
                            priority={index < 8}
                          />

                          <div className="absolute bottom-2 left-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-md z-20">
                            <span className="font-avenir text-[11px] md:text-xs font-semibold text-[#1b60bb] whitespace-nowrap">
                              {tech.sector}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* TOP 15 Ribbon */}
                      {tech.featured && (
                        <div
                          className="absolute top-0 right-4 bg-[#f97316] shadow-md z-30 flex flex-col items-center pt-2 pb-4 px-2.5"
                          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)' }}
                        >
                          <CircleCheckBig size={18} className="text-white mb-0.5" strokeWidth={2.5} />
                          <span className="text-white font-bold text-[11px] md:text-[12px] text-center leading-[1.1] tracking-wider mt-0.5">
                            TOP<br />TECH
                          </span>
                        </div>
                      )}

                      {/* Content Container */}
                      <div className="flex-1 p-5 md:p-6 pt-7 md:pt-8 flex flex-col bg-white">
                        <h3 className="font-helios font-normal text-[15px] md:text-[17px] text-[#1b60bb] mb-3 leading-tight line-clamp-2 min-h-[2.5rem]">
                          {tech.name}
                        </h3>

                        {/* Institution Label */}
                        <div className="bg-[#f8f5f4] rounded-md p-2 mb-4 flex items-center gap-2 overflow-hidden">
                          <Building2 size={14} className="text-gray-500 flex-shrink-0" />
                          <span className="font-poppins text-[10px] md:text-[11px] text-gray-700 font-medium leading-snug truncate flex-1 min-w-0">
                            {tech.institution}
                          </span>
                        </div>

                        {/* Footer Section: IP Status & Button */}
                        <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-4">
                          <div className="flex flex-col">
                            <span className="font-avenir text-[10px] md:text-[11px] text-gray-500 mb-0.5">
                              IP Status:
                            </span>
                            <span className={`font-avenir text-xs md:text-sm font-bold tracking-wide ${getIPStatusColor(tech.ipStatus)}`}>
                              {tech.ipStatus}
                            </span>
                          </div>

                          <button
                            className="group/btn bg-[#1b60bb] hover:bg-[#153156] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md font-avenir font-semibold text-[11px] md:text-xs flex items-center gap-1.5 shadow-sm transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-md"
                          >
                            View Details
                            <ArrowUpRight
                              size={14}
                              strokeWidth={2.5}
                              className="transition-transform duration-700 ease-out group-hover/btn:translate-x-[2px] group-hover/btn:-translate-y-[2px]"
                            />
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Inverted Curve Mask with Content */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[160px] md:h-[200px] bg-[#eff9ff] rounded-t-[3rem] md:rounded-t-[4rem] z-10 w-full flex flex-col items-center justify-center px-4"
        >
          <h3 className="text-[#1b60bb] text-[18px] md:text-[24px] font-medium text-center mb-4 leading-snug">
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
