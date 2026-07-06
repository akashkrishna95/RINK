'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatTechnologyName } from '@/lib/utils';

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
  const [stats, setStats] = useState({ techs: 0, domains: 0, institutions: 0 });
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
    
    const rawSearchLower = searchQuery.toLowerCase().trim();
    const searchLower = rawSearchLower
      .replace(/\bpatented\b/g, 'patent')
      .replace(/\btechnologies\b/g, 'technology');
    
    const searchWords = searchLower.split(/\s+/).filter(w => w.length > 1);

    const scoredResults = technologies.map((tech: any) => {
      let score = 0;
      const techName = (tech.technology_name || '').toLowerCase();
      const institution = (tech.institution || '').toLowerCase();
      const sector = (tech.primary_sector || tech.sector || '').toLowerCase();
      const techType = (tech.technology_type || '').toLowerCase();
      const description = (tech.problem_being_solved || tech.description || tech.brief_description_abstract || '').toLowerCase();
      const application = (tech.application_industry || '').toLowerCase();
      const ipStatus = (tech.patent_status || tech.ip_status || '').toLowerCase();
      const startupPotential = (tech.startup_potential || '').toLowerCase();
      const trlLevel = (tech.trl_level || tech.technology_readiness_level || '').toLowerCase();
      const isFeatured = startupPotential === 'high';

      const allText = Object.values(tech).map(v => (typeof v === 'string' ? v.toLowerCase() : '')).join(' ');

      if (techName === searchLower || techName === rawSearchLower) score += 10;
      if (institution === searchLower || institution === rawSearchLower) score += 8;
      if (sector === searchLower || sector === rawSearchLower) score += 8;
      if (ipStatus === searchLower || ipStatus === rawSearchLower) score += 5;

      const isFeaturedQuery = searchLower.includes('feature') || searchLower.includes('top tech');
      if (isFeaturedQuery && isFeatured) {
        score += 15;
      }

      if (techName.includes(searchLower) || techName.includes(rawSearchLower)) score += 5;
      if (institution.includes(searchLower) || institution.includes(rawSearchLower)) score += 4;
      if (sector.includes(searchLower) || sector.includes(rawSearchLower)) score += 4;
      if (techType.includes(searchLower) || techType.includes(rawSearchLower)) score += 3;

      searchWords.forEach((word) => {
        if (techName.includes(word)) score += (techName.startsWith(word) || techName.includes(` ${word}`)) ? 3 : 1.5;
        if (institution.includes(word)) score += (institution.startsWith(word) || institution.includes(` ${word}`)) ? 2.5 : 1;
        if (sector.includes(word)) score += (sector.startsWith(word) || sector.includes(` ${word}`)) ? 2.5 : 1;
        if (techType.includes(word)) score += 2;
        if (application.includes(word)) score += 1;
        if (description.includes(word)) score += 1;
        if (ipStatus.includes(word)) score += 1.5;
        if (trlLevel.includes(word)) score += 1.5;
        if (startupPotential.includes(word) || (word === 'featured' && isFeatured)) score += 2;
        if (allText.includes(word)) score += 0.3;
      });

      return { tech, score };
    });

    const matches = scoredResults
      .filter(item => item.score >= 0.25)
      .sort((a, b) => b.score - a.score)
      .map(item => item.tech)
      .slice(0, 5); // Max 5 suggestions in dropdown
      
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
        techs: Math.min(prev.techs + 15, 270),
        domains: Math.min(prev.domains + 1, 11),
        institutions: Math.min(prev.institutions + 2, 20),
      }));
    }, 40);
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

        <div className="w-full max-w-4xl mx-auto px-4 py-20 md:py-28 text-center relative z-10">
          {/* Main Content */}
          <div className="mb-10 md:mb-12 flex flex-col items-center">
            {/* Portal Tagline */}
            <p className="font-avenir text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] text-slate-400 font-bold mb-4">
              RESEARCH INNOVATION NETWORK KERALA • TECHNOLOGY TRANSFER PORTAL
            </p>
            {/* Main Title */}
            <h1 className="font-helios text-3xl sm:text-4xl md:text-6xl lg:text-[56px] font-black text-white leading-tight tracking-tight">
              Discover Technologies from
              <span className="text-xl sm:text-2xl md:text-4xl lg:text-[38px] font-extrabold text-white/80 block mt-2 md:mt-3">
                Kerala's Leading Research Institutions
              </span>
            </h1>
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
                        href={`/technologies/${s.technology_id || s['unnamed:_0']}`}
                        className="block px-6 py-4 hover:bg-[#eff9ff] transition-colors border-b border-gray-50"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <p className="font-poppins font-semibold text-gray-800 text-[15px] line-clamp-2">{formatTechnologyName(s.technology_name || s['unnamed:_1'])}</p>
                        <p className="font-poppins text-xs text-gray-500 mt-1.5 line-clamp-2 md:line-clamp-3">
                           {s.description || s.brief_description_abstract || s['unnamed:_4'] || 'No description available.'}
                        </p>
                        <p className="font-poppins text-xs text-[#1b60bb] mt-1.5">{s.institution || s['unnamed:_3']} • {s.sector || s['unnamed:_2']}</p>
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

          {/* Stats Row Cards (Liquid Glass Effect) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 max-w-3xl mx-auto mt-6">
            {/* Card 1 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl sm:rounded-2xl p-2 sm:p-4 md:p-5 shadow-[0_8px_32px_0_rgba(255,255,255,0.02)] hover:bg-white/15 hover:border-white/25 transition-all duration-300 flex flex-col justify-center">
              <div className="font-helios text-lg sm:text-2xl md:text-3xl font-extrabold text-[#5cc4fe] mb-0.5 sm:mb-1">
                {stats.techs}+
              </div>
              <div className="font-poppins text-[9px] sm:text-xs text-white/85 font-medium leading-tight">
                Available Technologies
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl sm:rounded-2xl p-2 sm:p-4 md:p-5 shadow-[0_8px_32px_0_rgba(255,255,255,0.02)] hover:bg-white/15 hover:border-white/25 transition-all duration-300 flex flex-col justify-center">
              <div className="font-helios text-lg sm:text-2xl md:text-3xl font-extrabold text-[#5cc4fe] mb-0.5 sm:mb-1">
                {stats.domains}+
              </div>
              <div className="font-poppins text-[9px] sm:text-xs text-white/85 font-medium leading-tight">
                Technology Domains
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl sm:rounded-2xl p-2 sm:p-4 md:p-5 shadow-[0_8px_32px_0_rgba(255,255,255,0.02)] hover:bg-white/15 hover:border-white/25 transition-all duration-300 flex flex-col justify-center">
              <div className="font-helios text-lg sm:text-2xl md:text-3xl font-extrabold text-[#5cc4fe] mb-0.5 sm:mb-1">
                {stats.institutions}+
              </div>
              <div className="font-poppins text-[9px] sm:text-xs text-white/85 font-medium leading-tight">
                Research Institutions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
