'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Building2 } from 'lucide-react';
import { getProxiedImageUrl } from '@/lib/utils';

interface InstitutionItem {
  id: number | string;
  name: string;
  logo_url?: string;
  logoUrl?: string; // support both logo mappings
  techCount: number;
}

interface BrowseInstitutionsProps {
  institutions?: InstitutionItem[];
}

const fallbackInstitutions: InstitutionItem[] = [
  { id: 'csir-niist', name: 'CSIR-National Institute for Interdisciplinary Science and Technology (NIIST)', techCount: 38, logo_url: '' },
  { id: 'kau', name: 'Kerala Agricultural University', techCount: 38, logo_url: '' },
  { id: 'kufos', name: 'Kerala University of Fisheries and Ocean Studies (KUFOS)', techCount: 26, logo_url: '' },
  { id: 'cpcri', name: 'ICAR-CPCRI Kasaragod', techCount: 24, logo_url: '' },
  { id: 'cdac', name: 'Centre for Development of Advanced Computing (C-DAC)', techCount: 21, logo_url: '' },
  { id: 'iisr', name: 'ICAR-Indian Institute of Spices Research (IISR)', techCount: 15, logo_url: '' },
];

export default function BrowseInstitutions({ institutions: propInstitutions = [] }: BrowseInstitutionsProps) {
  const activeItems = propInstitutions.length > 0
    ? [...propInstitutions].sort((a, b) => b.techCount - a.techCount).slice(0, 6)
    : fallbackInstitutions;

  const totalCount = propInstitutions.length > 0 ? propInstitutions.length : 15;

  return (
    <section id="institutions-section" className="py-20 md:py-32 px-4 md:px-8 bg-white">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <h2 className="font-helios text-[28px] md:text-4xl lg:text-5xl font-black text-[#1b60bb] tracking-tight max-w-3xl">
            Technologies From Kerala&apos;s Leading Research Institutions
          </h2>
          <Link href="/technologies/institutions" className="hidden md:flex group items-center gap-2 font-helios text-[15px] font-bold text-[#1b60bb] hover:text-[#124282] transition-colors whitespace-nowrap">
            See all {totalCount} institutions
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Institutions Premium Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {activeItems.map((inst, index) => {
            const logo = inst.logo_url || inst.logoUrl || '';
            const instId = String(inst.id);

            return (
              <motion.div
                key={instId}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
              >
                <Link href={`/technologies/browse_technologies?institution=${encodeURIComponent(inst.name)}`} className="block h-full">
                  <div className="group bg-white rounded-[20px] p-4 md:p-6 border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col h-full relative overflow-hidden z-10">
                    
                    {/* Subtle Background Accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-[#1b60bb]/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>
                    
                    {/* Logo / Icon Container */}
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-[#f8fafd] group-hover:bg-[#f0f6fc] rounded-xl md:rounded-2xl flex items-center justify-center border border-gray-50 mb-4 md:mb-5 relative overflow-hidden flex-shrink-0 transition-colors">
                      {logo ? (
                        <img src={getProxiedImageUrl(logo)} alt={inst.name} className="w-full h-full object-contain p-2" />
                      ) : (
                        <Building2 className="w-6 h-6 md:w-8 md:h-8 text-[#1b60bb]/60 group-hover:text-[#1b60bb] transition-colors" strokeWidth={1.5} />
                      )}
                    </div>
                    
                    {/* Content Area */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="font-helios text-[13px] sm:text-[15px] md:text-[16px] font-bold text-[#153156] leading-[1.3] line-clamp-3 group-hover:text-[#1b60bb] transition-colors mb-3">
                        {inst.name}
                      </h3>
                      
                      {/* Bottom Row */}
                      <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3 md:pt-4">
                        <span className="font-poppins text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-[#1b60bb]">
                          {inst.techCount} <span className="hidden sm:inline">technologies</span><span className="sm:hidden">tech</span>
                        </span>
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-300 group-hover:text-[#1b60bb] group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                  
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 md:hidden flex"
        >
          <Link href="/technologies/institutions" className="group flex items-center gap-2 font-helios text-[14px] font-bold text-[#1b60bb] hover:text-[#124282] transition-colors">
            See all {totalCount} institutions
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
