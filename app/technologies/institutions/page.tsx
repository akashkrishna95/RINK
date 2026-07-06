import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, ArrowLeft } from 'lucide-react';
import TechnologiesNavbar from '@/HomePage/technologies/TechnologiesNavbar';
import Footer from '@/HomePage/Footer';

export const metadata: Metadata = {
  title: 'All Institutions - RINK',
  description: 'Browse all research institutions partnered with RINK Kerala.',
};

const allInstitutions = [
  { id: 'csir-niist', name: 'CSIR-National Institute for Interdisciplinary Science and...', techCount: 38, logo: '' },
  { id: 'kau', name: 'Kerala Agricultural University', techCount: 38, logo: '' },
  { id: 'kufos', name: 'Kerala University of Fisheries and Ocean Studies (KUFOS)', techCount: 26, logo: '' },
  { id: 'cpcri', name: 'ICAR-CPCRI Kasaragod', techCount: 24, logo: '' },
  { id: 'cdac', name: 'Centre for Development of Advanced Computing (C-DAC)', techCount: 21, logo: '' },
  { id: 'iisr', name: 'ICAR-Indian Institute of Spices Research (IISR)', techCount: 15, logo: '' },
  { id: 'ctcri', name: 'ICAR-Central Tuber Crops Research Institute (CTCRI)', techCount: 14, logo: '' },
  { id: 'kfri', name: 'KSCSTE- Kerala Forest Research Institute (KFRI)', techCount: 14, logo: '' },
  { id: 'cwrdm', name: 'KSCSTE- Centre for Water Resources Development and...', techCount: 10, logo: '' },
  { id: 'c-met', name: 'C-MET Kerala', techCount: 9, logo: '' },
  { id: 'jntbgri', name: 'KSCSTE- Jawaharlal Nehru Tropical Botanic Garden &...', techCount: 9, logo: '' },
  { id: 'mbgips', name: 'KSCSTE- Malabar Botanical Garden & Institute for Plant...', techCount: 8, logo: '' },
  { id: 'iav', name: 'Institute of Advanced Virology (IAV)', techCount: 8, logo: '' },
  { id: 'natpac', name: 'KSCSTE - National Transportation Planning and Research Centre...', techCount: 8, logo: '' },
  { id: 'sbi-kannur', name: 'ICAR-Sugarcane Breeding Institute Research Centre, Kannur', techCount: 7, logo: '' },
];

export default function AllInstitutionsPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <TechnologiesNavbar />
      
      <div className="flex-1 py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          
          <Link href="/technologies#institutions-section" className="inline-flex items-center gap-2 text-[#1b60bb] hover:text-[#124282] transition-colors mb-6 font-helios font-bold text-sm md:text-[15px]">
            <ArrowLeft className="w-4 h-4" />
            Back to Technologies
          </Link>

          <h1 className="font-helios text-[32px] md:text-5xl font-black text-[#1b60bb] tracking-tight mb-4">
            All 15 Institutions
          </h1>
          <p className="font-poppins text-sm md:text-base text-gray-600 max-w-3xl leading-relaxed mb-10 md:mb-16">
            Browse our complete directory of partnered research hubs, universities, and advanced core labs in Kerala.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
            {allInstitutions.map((inst) => (
              <Link key={inst.id} href={`/technologies/browse_technologies?institution=${encodeURIComponent(inst.id)}`} className="block h-full">
                <div className="group bg-white rounded-[20px] p-4 md:p-6 border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col h-full relative overflow-hidden z-10">
                  
                  {/* Subtle Background Accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-[#1b60bb]/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>
                  
                  {/* Logo / Icon Container */}
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[#f8fafd] group-hover:bg-[#f0f6fc] rounded-xl md:rounded-2xl flex items-center justify-center border border-gray-50 mb-4 md:mb-5 relative overflow-hidden flex-shrink-0 transition-colors">
                    {inst.logo ? (
                      <img src={inst.logo} alt={inst.name} className="w-full h-full object-contain p-2" />
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
            ))}
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
