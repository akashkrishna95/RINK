'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3x3, List, Filter, X } from 'lucide-react';
import rinkDatabase from '@/data/rink_database.json';
import PremiumTechnologyCard from './PremiumTechnologyCard';
import PremiumTechnologyListCard from './PremiumTechnologyListCard';
import FilterDrawer from './FilterDrawer';

const ITEMS_PER_PAGE = 12;

const normalizeTechType = (type: string) => {
  const stopWords = /(?:\s+)(?:Technology|Technologies|Equipment|System|Systems|Software|Platform|Product|Products|Agent|Formulation|Machinery|Device)s?\b/gi;
  let cleanType = type.replace(stopWords, '').trim();
  cleanType = cleanType.replace(/[\s&-]+$/, '').trim();
  return cleanType.length > 0 ? cleanType : type;
};

export default function PremiumBrowseTechnologies() {
  const searchParams = useSearchParams();
  const [layoutView, setLayoutView] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({
    sector: [] as string[],
    institution: [] as string[],
    ipStatus: [] as string[],
    techType: [] as string[],
    featured: [] as string[],
  });

  // Parse query params on mount
  useEffect(() => {
    const sectorParam = searchParams.get('sector');
    if (sectorParam) {
      setSelectedFilters((prev) => ({
        ...prev,
        sector: [decodeURIComponent(sectorParam)],
      }));
    }
  }, [searchParams]);

  // Filter out header row (first item contains field names instead of data)
  const technologies = ((rinkDatabase as any)['MAIN SHEET'] || []).filter(
    (tech: any, index: number) => index > 0 && tech['unnamed:_0'] && tech['unnamed:_0'] !== 'technology_id'
  );

  const uniqueSectors = useMemo(() => {
    const sectors = new Set<string>();
    technologies.forEach((tech: any) => {
      if (tech['unnamed:_3']) sectors.add(tech['unnamed:_3']);
    });
    return Array.from(sectors).sort();
  }, [technologies]);

  const uniqueInstitutions = useMemo(() => {
    const institutions = new Set<string>();
    technologies.forEach((tech: any) => {
      if (tech['unnamed:_2']) institutions.add(tech['unnamed:_2']);
    });
    return Array.from(institutions).slice(0, 15).sort();
  }, [technologies]);

  const uniqueTechTypes = useMemo(() => {
    const typeMap = new Map<string, string>();
    technologies.forEach((tech: any) => {
      let techTypeRaw = tech['unnamed:_4'];
      if (typeof techTypeRaw === 'string') {
        const parts = techTypeRaw.split(',').map(s => s.trim()).filter(s => s.length > 0 && s.toLowerCase() !== 'technology_type');
        parts.forEach(techType => {
          const cleanType = normalizeTechType(techType);
          const lower = cleanType.toLowerCase();
          if (!typeMap.has(lower)) {
            typeMap.set(lower, cleanType);
          }
        });
      }
    });
    return Array.from(typeMap.values()).sort();
  }, [technologies]);

  const filteredTechnologies = useMemo(() => {
    return technologies.filter((tech: any) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        (tech['unnamed:_1'] || '').toLowerCase().includes(searchLower) ||
        (tech['unnamed:_3'] || '').toLowerCase().includes(searchLower) ||
        (tech['unnamed:_2'] || '').toLowerCase().includes(searchLower);

      const matchesSector =
        selectedFilters.sector.length === 0 ||
        selectedFilters.sector.includes(tech['unnamed:_3']);

      const matchesInstitution =
        selectedFilters.institution.length === 0 ||
        selectedFilters.institution.includes(tech['unnamed:_2']);

      const matchesIP =
        selectedFilters.ipStatus.length === 0 ||
        selectedFilters.ipStatus.includes(tech['unnamed:_10'] || 'Not Specified');

      const matchesTechType =
        selectedFilters.techType.length === 0 ||
        (() => {
          const raw = tech['unnamed:_4'];
          if (!raw || typeof raw !== 'string') return false;
          const types = raw.split(',').map((s: string) => normalizeTechType(s.trim()));
          return selectedFilters.techType.some((t: string) => types.includes(t));
        })();

      const isFeatured = tech['unnamed:_8'] === 'High';
      const matchesFeatured =
        selectedFilters.featured.length === 0 ||
        (selectedFilters.featured.includes('featured') && isFeatured) ||
        (selectedFilters.featured.includes('non-featured') && !isFeatured);

      return matchesSearch && matchesSector && matchesInstitution && matchesIP && matchesTechType && matchesFeatured;
    });
  }, [searchQuery, selectedFilters, technologies]);

  const totalPages = Math.ceil(filteredTechnologies.length / ITEMS_PER_PAGE);
  const paginatedTechnologies = useMemo(() => {
    return filteredTechnologies.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredTechnologies, currentPage]);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
      if (!pages.includes(i)) pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);

  const handleFilterChange = (key: string, value: string) => {
    setSelectedFilters((prev) => {
      const updated = { ...prev };
      if ((updated as any)[key].includes(value)) {
        (updated as any)[key] = (updated as any)[key].filter((v: string) => v !== value);
      } else {
        (updated as any)[key] = [...(updated as any)[key], value];
      }
      return updated;
    });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedFilters({ sector: [], institution: [], ipStatus: [], techType: [], featured: [] });
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen py-8 md:py-12 bg-[#F4F7FB]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
          {/* Search Bar */}
          <div className="w-full md:w-[450px]">
            <div className="relative bg-white rounded-full shadow-sm border border-gray-200 focus-within:border-[#1b60bb] focus-within:ring-2 focus-within:ring-[#1b60bb]/20 transition-all">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search technologies by name, sector, institution..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-4 py-3 bg-transparent rounded-full focus:outline-none font-poppins text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Layout & Filter Controls */}
          <div className="flex gap-3 items-center flex-wrap justify-end">
            {/* Grid/List Toggle */}
            <div className="flex gap-2 bg-white rounded-lg border border-gray-200 p-1.5 shadow-sm hidden sm:flex">
              <button
                onClick={() => setLayoutView('grid')}
                className={`p-2 rounded transition-colors ${
                  layoutView === 'grid'
                    ? 'bg-[#1b60bb] text-white'
                    : 'text-gray-600 hover:text-[#1b60bb]'
                }`}
              >
                <Grid3x3 size={20} />
              </button>
              <button
                onClick={() => setLayoutView('list')}
                className={`p-2 rounded transition-colors ${
                  layoutView === 'list'
                    ? 'bg-[#1b60bb] text-white'
                    : 'text-gray-600 hover:text-[#1b60bb]'
                }`}
              >
                <List size={20} />
              </button>
            </div>

            {/* Reset Filters Button */}
            {(selectedFilters.sector.length > 0 || selectedFilters.institution.length > 0 || selectedFilters.ipStatus.length > 0 || selectedFilters.techType.length > 0 || selectedFilters.featured.length > 0 || searchQuery !== '') && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-[#ff3131] transition-colors font-poppins font-semibold text-sm md:text-base shadow-sm"
              >
                <X size={18} />
                Reset
              </button>
            )}

            {/* Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1b60bb] text-white rounded-lg hover:bg-[#153156] transition-colors font-poppins font-semibold text-sm md:text-base shadow-md"
            >
              <Filter size={20} />
              Filters
            </button>
          </div>
        </div>

        {/* Filter Drawer */}
        <FilterDrawer
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          sectors={uniqueSectors}
          institutions={uniqueInstitutions}
          ipStatuses={['Patented', 'Patent Filed', 'Not Specified']}
          techTypes={uniqueTechTypes}
          selectedSectors={selectedFilters.sector}
          selectedInstitutions={selectedFilters.institution}
          selectedIPStatuses={selectedFilters.ipStatus}
          selectedTechTypes={selectedFilters.techType}
          selectedFeatured={selectedFilters.featured}
          onSectorChange={(sector, checked) => handleFilterChange('sector', sector)}
          onInstitutionChange={(institution, checked) => handleFilterChange('institution', institution)}
          onIPStatusChange={(status, checked) => handleFilterChange('ipStatus', status)}
          onTechTypeChange={(type, checked) => handleFilterChange('techType', type)}
          onFeaturedChange={(option, checked) => handleFilterChange('featured', option)}
        />

        {/* Main Content */}
        <div className="flex gap-6 relative">
          {/* Results */}
          <div className="flex-1 md:relative">
            {/* Active Filters Display */}
            {(selectedFilters.sector.length > 0 || selectedFilters.institution.length > 0 || selectedFilters.ipStatus.length > 0 || selectedFilters.techType.length > 0 || selectedFilters.featured.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="flex flex-col gap-3">
                  <p className="text-gray-600 font-poppins text-sm font-semibold">Active Filters:</p>
                  <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                    {/* Sector Pills */}
                    {selectedFilters.sector.map((sector) => (
                      <motion.div
                        key={`sector-${sector}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-[#1b60bb] text-white px-4 py-2 rounded-full flex items-center gap-2 font-poppins text-sm font-semibold shadow-md whitespace-nowrap"
                      >
                        {sector}
                        <button
                          onClick={() => handleFilterChange('sector', sector)}
                          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </motion.div>
                    ))}

                    {/* Institution Pills */}
                    {selectedFilters.institution.map((institution) => (
                      <motion.div
                        key={`inst-${institution}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-[#1872dd] text-white px-4 py-2 rounded-full flex items-center gap-2 font-poppins text-sm font-semibold shadow-md whitespace-nowrap"
                      >
                        <span className="truncate max-w-[150px]">{institution}</span>
                        <button
                          onClick={() => handleFilterChange('institution', institution)}
                          className="hover:bg-white/20 rounded-full p-0.5 transition-colors flex-shrink-0"
                        >
                          <X size={16} />
                        </button>
                      </motion.div>
                    ))}

                    {/* IP Status Pills */}
                    {selectedFilters.ipStatus.map((status) => (
                      <motion.div
                        key={`ip-${status}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-[#36a8fb] text-white px-4 py-2 rounded-full flex items-center gap-2 font-poppins text-sm font-semibold shadow-md whitespace-nowrap"
                      >
                        {status}
                        <button
                          onClick={() => handleFilterChange('ipStatus', status)}
                          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </motion.div>
                    ))}

                    {/* Tech Type Pills */}
                    {selectedFilters.techType.map((type) => (
                      <motion.div
                        key={`type-${type}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-[#90daff] text-[#1b60bb] px-4 py-2 rounded-full flex items-center gap-2 font-poppins text-sm font-semibold shadow-md whitespace-nowrap"
                      >
                        {type}
                        <button
                          onClick={() => handleFilterChange('techType', type)}
                          className="hover:bg-white/30 rounded-full p-0.5 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </motion.div>
                    ))}

                    {/* Featured Pills */}
                    {selectedFilters.featured.map((featured) => (
                      <motion.div
                        key={`feat-${featured}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-[#ff9c3d] text-white px-4 py-2 rounded-full flex items-center gap-2 font-poppins text-sm font-semibold shadow-md whitespace-nowrap"
                      >
                        {featured === 'featured' ? 'Featured' : featured === 'non-featured' ? 'Non-Featured' : 'All'}
                        <button
                          onClick={() => handleFilterChange('featured', featured)}
                          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Results Info */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <p className="text-[#1b60bb] font-poppins font-semibold text-sm">
                Showing <span className="font-bold">{paginatedTechnologies.length}</span> of <span className="font-bold">{filteredTechnologies.length}</span> technologies
              </p>
              {filteredTechnologies.length > 0 && (
                <p className="text-gray-600 font-poppins text-xs">
                  Page {currentPage} of {totalPages}
                </p>
              )}
            </div>

            {/* Grid View */}
            {layoutView === 'grid' ? (
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 mb-12 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <AnimatePresence>
                  {paginatedTechnologies.map((tech: any, index: number) => (
                    <PremiumTechnologyCard
                        key={`tech-grid-${tech['unnamed:_0'] || 'empty'}-${index}`}
                        id={String(tech['unnamed:_0'] || index)}
                        name={tech['unnamed:_1'] || 'Untitled'}
                        image={tech['unnamed:_16'] || '/images/placeholder-tech.jpg'}
                        sector={tech['unnamed:_3'] || 'N/A'}
                        institution={tech['unnamed:_2'] || 'N/A'}
                        ipStatus={tech['unnamed:_10'] || 'Not Specified'}
                        featured={tech['unnamed:_8'] === 'High'}
                      />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                className="space-y-4 mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <AnimatePresence>
                  {paginatedTechnologies.map((tech: any, index: number) => (
                    <PremiumTechnologyListCard
                      key={`tech-list-${tech['unnamed:_0'] || 'empty'}-${index}`}
                      id={String(tech['unnamed:_0'] || index)}
                      name={tech['unnamed:_1'] || 'Untitled'}
                      image={tech['unnamed:_16'] || '/images/placeholder-tech.jpg'}
                      sector={tech['unnamed:_3'] || 'N/A'}
                      institution={tech['unnamed:_2'] || 'N/A'}
                      ipStatus={tech['unnamed:_10'] || 'Not Specified'}
                      description={tech['unnamed:_6'] || 'No description available'}
                      featured={tech['unnamed:_8'] === 'High'}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12 pt-8 border-t border-gray-200 flex-wrap">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-[#1b60bb] text-[#1b60bb] hover:bg-[#f0f4f8] disabled:opacity-50 transition-colors font-poppins font-semibold"
                >
                  Previous
                </button>

                <div className="flex gap-2 flex-wrap justify-center">
                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg transition-colors font-poppins font-semibold ${
                        currentPage === page
                          ? 'bg-[#1b60bb] text-white'
                          : 'border border-[#1b60bb] text-[#1b60bb] hover:bg-[#f0f4f8]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-[#1b60bb] text-[#1b60bb] hover:bg-[#f0f4f8] disabled:opacity-50 transition-colors font-poppins font-semibold"
                >
                  Next
                </button>


              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
