'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const placeholders = [
  'Best Technologies in agritech for my startup...',
  'Describe your idea, challenge, product or opportunity...',
  'Find startup-ready research technologies...',
  'Search food processing technologies...',
  'Explore renewable energy innovations...',
];

export default function TechnologiesHero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [stats, setStats] = useState({ techs: 0, institutions: 0, funds: 0 });
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [technologies, setTechnologies] = useState<any[]>([]);

  useEffect(() => {
    async function fetchTechs() {
      try {
        const res = await fetch('/api/technologies');
        const json = await res.json();
        if (json.success && json.technologies) {
          let rawData = json.technologies;
          if (rawData['MAIN SHEET']) {
            rawData = rawData['MAIN SHEET'];
          }
          const processedTechs = (rawData || [])
            .filter((tech: any) => tech.technology_id && tech.technology_id !== 'technology_id');
          setTechnologies(processedTechs);
        }
      } catch (error) {
        console.error("Failed to fetch technologies", error);
      }
    }
    fetchTechs();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim() || technologies.length === 0) {
      setSuggestions([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const matches = technologies
      .filter((tech: any) => {
        const name = (tech.technology_name || '').toLowerCase();
        const sector = (tech.primary_sector || '').toLowerCase();
        return name.includes(query) || sector.includes(query);
      });
      
    setSuggestions(matches);
  }, [searchQuery, technologies]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const counters = setInterval(() => {
      setStats((prev) => ({
        techs: Math.min(prev.techs + 10, 150),
        institutions: Math.min(prev.institutions + 5, 100),
        funds: Math.min(prev.funds + 10, 150),
      }));
    }, 50);
    return () => clearInterval(counters);
  }, []);

  return (
    <div className="w-full bg-[#F4F7FB] px-4 py-6 md:px-8">
      <div className="max-w-[1400px] mx-auto bg-[#011a38] rounded-[24px] md:rounded-[32px] overflow-hidden relative shadow-xl min-h-[500px] md:min-h-[600px] flex items-center justify-center">
        {/* Background Image Setup */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/tech-hero-bg.png" 
            alt="Technologies Background" 
            fill 
            className="object-cover" 
            priority
          />
          {/* Overlays to match the design (dark blue/cyan gradient overlay) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#003b73]/80 via-[#011a38]/70 to-[#011a38]/95 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0060b8]/40 via-transparent to-[#011a38]/60"></div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-4 py-24 md:py-40 text-center relative z-10">
          {/* Main Content */}
          <div className="mb-10 md:mb-14">
            <h1 className="font-helios text-4xl md:text-6xl lg:text-[64px] font-black text-white mb-6 leading-tight tracking-tight">
              Discover. License. Scale.
            </h1>
            <p className="font-poppins text-lg md:text-[22px] text-white/90">
              Where breakthrough research meets{' '}
              <span className="text-[#5cc4fe]">commercial scale</span>
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-10 relative z-30">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[28px] px-6 py-4 md:py-5 flex items-center gap-4 transition-colors focus-within:bg-white/15 shadow-2xl relative">
              <div className="flex-1 relative h-6 md:h-7 flex items-center">
                {/* Animated Placeholder Text */}
                {!searchQuery && !isFocused && (
                  <div className="absolute inset-0 flex items-center pointer-events-none overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={currentPlaceholder}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="text-white/60 font-poppins text-[15px] md:text-[17px] truncate w-full text-left absolute"
                      >
                        {placeholders[currentPlaceholder]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                )}
                
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      window.location.href = `/technologies/browse_technologies?search=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                  className="w-full h-full bg-transparent text-white font-poppins text-[15px] md:text-[17px] outline-none z-10 relative"
                />
              </div>
              <Link
                href={searchQuery.trim() ? `/technologies/browse_technologies?search=${encodeURIComponent(searchQuery)}` : '/technologies/browse_technologies'}
                className="text-white/80 hover:text-white transition-colors flex-shrink-0 z-10 relative"
              >
                <Search size={26} strokeWidth={2} />
              </Link>
            </div>
            
            {/* Autocomplete Dropdown */}
            <AnimatePresence>
              {searchQuery.trim() && isFocused && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-[110%] left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 text-left flex flex-col max-h-[380px]"
                >
                  <div className="overflow-y-auto custom-scrollbar flex-1">
                    {suggestions.map((s, idx) => (
                      <Link 
                        key={idx}
                        href={`/technologies/${s['unnamed:_0']}`}
                        className="block px-6 py-4 hover:bg-[#eff9ff] transition-colors border-b border-gray-50"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <p className="font-poppins font-semibold text-gray-800 text-[15px] line-clamp-2">{s['unnamed:_1']}</p>
                        <p className="font-poppins text-xs text-[#1b60bb] mt-1">{s['unnamed:_3']} • {s['unnamed:_2']}</p>
                      </Link>
                    ))}
                  </div>
                  
                  {/* Sticky View All Button */}
                  <div className="bg-[#f8fbff] p-3 md:p-4 border-t border-blue-100 text-center flex-shrink-0 z-10 shadow-[0_-4px_10px_rgb(0,0,0,0.02)]">
                     <Link
                        href={`/technologies/browse_technologies?search=${encodeURIComponent(searchQuery)}`}
                        className="text-[#1b60bb] font-poppins font-semibold text-sm hover:underline"
                        onMouseDown={(e) => e.preventDefault()}
                     >
                        View all {suggestions.length} results for "{searchQuery}"
                     </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stats Row Inline */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-white/90 font-poppins text-xs sm:text-sm md:text-[16px]">
            <span>{stats.techs}+ Technologies</span>
            <span className="text-white/50 text-[10px] mx-1 md:mx-2">•</span>
            <span>{stats.institutions}+ Institutions</span>
            <span className="text-white/50 text-[10px] mx-1 md:mx-2">•</span>
            <span>₹{stats.funds}L+ Innovation Fund</span>
          </div>
        </div>
      </div>
    </div>
  );
}
