'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Check } from 'lucide-react';
import { useState } from 'react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sectors: string[];
  institutions: string[];
  ipStatuses: string[];
  techTypes: string[];
  selectedSectors: string[];
  selectedInstitutions: string[];
  selectedIPStatuses: string[];
  selectedTechTypes: string[];
  selectedFeatured: string[];
  onSectorChange: (sector: string, checked: boolean) => void;
  onInstitutionChange: (institution: string, checked: boolean) => void;
  onIPStatusChange: (status: string, checked: boolean) => void;
  onTechTypeChange: (type: string, checked: boolean) => void;
  onFeaturedChange: (option: string, checked: boolean) => void;
}

export default function FilterDrawer({
  isOpen,
  onClose,
  sectors,
  institutions,
  ipStatuses,
  techTypes,
  selectedSectors,
  selectedInstitutions,
  selectedIPStatuses,
  selectedTechTypes,
  selectedFeatured,
  onSectorChange,
  onInstitutionChange,
  onIPStatusChange,
  onTechTypeChange,
  onFeaturedChange,
}: FilterDrawerProps) {
  const [expandedSections, setExpandedSections] = useState({
    sectors: false,
    institutions: false,
    ipStatus: false,
    techTypes: false,
    featured: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const CustomCheckbox = ({
    id,
    checked,
    onChange,
    label,
  }: {
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
  }) => (
    <motion.label
      whileHover={{ x: 4 }}
      className="flex items-center gap-3 cursor-pointer group w-full"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`relative w-5 h-5 rounded-lg border-2 transition-all duration-300 flex items-center justify-center flex-shrink-0 ${
          checked
            ? 'border-[#1b60bb] bg-[#1b60bb] shadow-md'
            : 'border-[#90daff] bg-white group-hover:border-[#1b60bb]'
        }`}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Check size={14} className="text-white" strokeWidth={3} />
          </motion.div>
        )}
      </motion.div>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />
      <span className="font-poppins text-sm text-gray-700 group-hover:text-[#1b60bb] transition-colors truncate">
        {label}
      </span>
    </motion.label>
  );

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed md:absolute right-0 top-0 md:top-20 w-full sm:w-96 md:w-80 h-screen md:h-[calc(100vh-100px)] bg-white rounded-none md:rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b-2 border-[#daf1ff] px-6 py-5 z-50 flex items-center justify-between">
              <h3 className="font-helios text-2xl font-bold text-[#1b60bb]">Filters</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#f0f9ff] rounded-lg transition-colors text-gray-600 hover:text-[#1b60bb] flex-shrink-0"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Sectors */}
              <div>
                <button
                  onClick={() => toggleSection('sectors')}
                  className="w-full flex items-center justify-between mb-4 p-3 rounded-xl bg-[#f0f9ff] hover:bg-[#e0f1ff] transition-colors"
                >
                  <h4 className="font-helios text-lg font-bold text-[#1b60bb]">Sectors</h4>
                  <ChevronDown
                    size={20}
                    className={`text-[#1b60bb] transition-transform ${
                      expandedSections.sectors ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedSections.sectors && (
                  <div className="space-y-3 pl-0">
                    {sectors.map((sector) => (
                      <CustomCheckbox
                        key={sector}
                        id={`sector-${sector}`}
                        checked={selectedSectors.includes(sector)}
                        onChange={(checked) => onSectorChange(sector, checked)}
                        label={sector}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Institutions */}
              <div>
                <button
                  onClick={() => toggleSection('institutions')}
                  className="w-full flex items-center justify-between mb-4 p-3 rounded-xl bg-[#f0f9ff] hover:bg-[#e0f1ff] transition-colors"
                >
                  <h4 className="font-helios text-lg font-bold text-[#1b60bb]">Institutions</h4>
                  <ChevronDown
                    size={20}
                    className={`text-[#1b60bb] transition-transform ${
                      expandedSections.institutions ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedSections.institutions && (
                  <div className="space-y-3">
                    {institutions.map((institution) => (
                      <CustomCheckbox
                        key={institution}
                        id={`inst-${institution}`}
                        checked={selectedInstitutions.includes(institution)}
                        onChange={(checked) => onInstitutionChange(institution, checked)}
                        label={institution}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* IP Status */}
              <div>
                <button
                  onClick={() => toggleSection('ipStatus')}
                  className="w-full flex items-center justify-between mb-4 p-3 rounded-xl bg-[#f0f9ff] hover:bg-[#e0f1ff] transition-colors"
                >
                  <h4 className="font-helios text-lg font-bold text-[#1b60bb]">IP Status</h4>
                  <ChevronDown
                    size={20}
                    className={`text-[#1b60bb] transition-transform ${
                      expandedSections.ipStatus ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedSections.ipStatus && (
                  <div className="space-y-3">
                    {ipStatuses.map((status) => (
                      <CustomCheckbox
                        key={status}
                        id={`ip-${status}`}
                        checked={selectedIPStatuses.includes(status)}
                        onChange={(checked) => onIPStatusChange(status, checked)}
                        label={status}
                      />
                    ))}
                  </div>
                )}
              </div>


              {/* Tech Types */}
              {techTypes.length > 0 && (
                <div>
                  <button
                    onClick={() => toggleSection('techTypes')}
                    className="w-full flex items-center justify-between mb-4 p-3 rounded-xl bg-[#f0f9ff] hover:bg-[#e0f1ff] transition-colors"
                  >
                    <h4 className="font-helios text-lg font-bold text-[#1b60bb]">Tech Types</h4>
                    <ChevronDown
                      size={20}
                      className={`text-[#1b60bb] transition-transform ${
                        expandedSections.techTypes ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedSections.techTypes && (
                    <div className="space-y-3">
                      {techTypes.map((type) => (
                        <CustomCheckbox
                          key={type}
                          id={`type-${type}`}
                          checked={selectedTechTypes.includes(type)}
                          onChange={(checked) => onTechTypeChange(type, checked)}
                          label={type}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Featured */}
              <div>
                <button
                  onClick={() => toggleSection('featured')}
                  className="w-full flex items-center justify-between mb-4 p-3 rounded-xl bg-[#f0f9ff] hover:bg-[#e0f1ff] transition-colors"
                >
                  <h4 className="font-helios text-lg font-bold text-[#1b60bb]">Featured</h4>
                  <ChevronDown
                    size={20}
                    className={`text-[#1b60bb] transition-transform ${
                      expandedSections.featured ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedSections.featured && (
                  <div className="space-y-3">
                    <CustomCheckbox
                      id="featured-all"
                      checked={selectedFeatured.includes('all')}
                      onChange={(checked) => onFeaturedChange('all', checked)}
                      label="All Technologies"
                    />
                    <CustomCheckbox
                      id="featured-yes"
                      checked={selectedFeatured.includes('featured')}
                      onChange={(checked) => onFeaturedChange('featured', checked)}
                      label="Featured Only"
                    />
                    <CustomCheckbox
                      id="featured-no"
                      checked={selectedFeatured.includes('non-featured')}
                      onChange={(checked) => onFeaturedChange('non-featured', checked)}
                      label="Non-Featured Only"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
