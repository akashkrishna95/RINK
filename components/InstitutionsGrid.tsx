'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, X, Maximize2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('./InteractiveMap'), {
  ssr: false,
});

// Custom Classic Map Pin SVG
const ClassicMapPin = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="32"
    height="32"
    fill="#ef4444"
    stroke="white"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="drop-shadow-md"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" fill="white" stroke="none" />
  </svg>
);

// 1. Map Coordinates & Added 'techCount' Mock Data
const mapCoordinates: Record<string, { left: string; top: string; techCount: number }> = {
  Kasargod: { left: "251.709px", top: "-8.179px", techCount: 8 },
  Kannur: { left: "263.622px", top: "2.710px", techCount: 14 },
  Wayanad: { left: "284.617px", top: "11.047px", techCount: 6 },
  Kozhikode: { left: "274.189px", top: "13.464px", techCount: 22 },
  Malappuram: { left: "287.673px", top: "21.694px", techCount: 11 },
  Palakkad: { left: "298.360px", top: "28.333px", techCount: 15 },
  Thrissur: { left: "290.124px", top: "33.667px", techCount: 18 },
  Ernakulam: { left: "296.944px", top: "43.738px", techCount: 45 },
  Idukki: { left: "319.009px", top: "50.612px", techCount: 4 },
  Kottayam: { left: "304.126px", top: "52.612px", techCount: 12 },
  Alapuzha: { left: "295.097px", top: "55.774px", techCount: 9 },
  Pathanamthitta: { left: "317.939px", top: "62.195px", techCount: 7 },
  Kollam: { left: "314.088px", top: "67.444px", techCount: 16 },
  Thrivandrum: { left: "322.911px", top: "75.427px", techCount: 38 }
};

const getResponsivePos = (val: string, isY: boolean = false) => {
  const num = parseFloat(val.replace('px', ''));
  const scale = isY ? 1 : 0.25;
  const offset = isY ? 15 : 0;
  return `${(num * scale) + offset}%`;
};

// 2. Real Institutions Data (34 total across Kerala with Google Maps URLs and unique lat/lng)
const institutionLogos = [
  {
    id: 1,
    name: "CSIR - National Institute for Interdisciplinary Science and Technology",
    website: "https://www.google.com/maps/search/?api=1&query=CSIR-NIIST+Trivandrum",
    district: "Thrivandrum",
    techCount: 38,
    lat: 8.5361,
    lng: 76.9062
  },
  {
    id: 2,
    name: "Kerala Agricultural University",
    website: "https://www.google.com/maps/search/?api=1&query=Kerala+Agricultural+University+Thrissur",
    district: "Thrissur",
    techCount: 18,
    lat: 10.5452,
    lng: 76.2870
  },
  {
    id: 3,
    name: "Kerala University of Fisheries and Ocean Studies (KUFOS)",
    website: "https://www.google.com/maps/search/?api=1&query=KUFOS+Kochi",
    district: "Ernakulam",
    techCount: 45,
    lat: 9.9250,
    lng: 76.3150
  },
  {
    id: 4,
    name: "ICAR - Central Plantation Crops Research Institute (CPCRI)",
    website: "https://www.google.com/maps/search/?api=1&query=CPCRI+Kasaragod",
    district: "Kasargod",
    techCount: 8,
    lat: 12.5190,
    lng: 74.9920
  },
  {
    id: 5,
    name: "Centre for Development of Advanced Computing (C-DAC)",
    website: "https://www.google.com/maps/search/?api=1&query=CDAC+Trivandrum",
    district: "Thrivandrum",
    techCount: 38,
    lat: 8.5300,
    lng: 76.9200
  },
  {
    id: 6,
    name: "ICAR - Indian Institute of Spices Research (IISR)",
    website: "https://www.google.com/maps/search/?api=1&query=IISR+Kozhikode",
    district: "Kozhikode",
    techCount: 22,
    lat: 11.2980,
    lng: 75.8200
  },
  {
    id: 7,
    name: "ICAR - Central Tuber Crops Research Institute (CTCRI)",
    website: "https://www.google.com/maps/search/?api=1&query=CTCRI+Trivandrum",
    district: "Thrivandrum",
    techCount: 38,
    lat: 8.5500,
    lng: 76.9150
  },
  {
    id: 8,
    name: "KSCSTE - Kerala Forest Research Institute (KFRI)",
    website: "https://www.google.com/maps/search/?api=1&query=KFRI+Peechi",
    district: "Thrissur",
    techCount: 18,
    lat: 10.5312,
    lng: 76.3530
  },
  {
    id: 9,
    name: "KSCSTE - Centre for Water Resources Development and Management (CWRDM)",
    website: "https://www.google.com/maps/search/?api=1&query=CWRDM+Kozhikode",
    district: "Kozhikode",
    techCount: 22,
    lat: 11.3050,
    lng: 75.8750
  },
  {
    id: 10,
    name: "Centre for Materials for Electronics Technology (C-MET)",
    website: "https://www.google.com/maps/search/?api=1&query=CMET+Thrissur",
    district: "Thrissur",
    techCount: 18,
    lat: 10.5200,
    lng: 76.2200
  },
  {
    id: 11,
    name: "KSCSTE - Jawaharlal Nehru Tropical Botanic Garden and Research Institute",
    website: "https://www.google.com/maps/search/?api=1&query=JNTBGRI+Palode",
    district: "Thrivandrum",
    techCount: 38,
    lat: 8.7512,
    lng: 77.0210
  },
  {
    id: 12,
    name: "KSCSTE - Malabar Botanical Garden and Institute for Plant Sciences",
    website: "https://www.google.com/maps/search/?api=1&query=Malabar+Botanical+Garden+Kozhikode",
    district: "Kozhikode",
    techCount: 22,
    lat: 11.2720,
    lng: 75.8450
  },
  {
    id: 13,
    name: "Institute of Advanced Virology (IAV)",
    website: "https://www.google.com/maps/search/?api=1&query=IAV+Thonnakkal",
    district: "Thrivandrum",
    techCount: 38,
    lat: 8.6250,
    lng: 76.8500
  },
  {
    id: 14,
    name: "KSCSTE - National Transportation Planning and Research Centre (NATPAC)",
    website: "https://www.google.com/maps/search/?api=1&query=NATPAC+Trivandrum",
    district: "Thrivandrum",
    techCount: 38,
    lat: 8.5200,
    lng: 76.9300
  },
  {
    id: 15,
    name: "ICAR - Sugarcane Breeding Institute Research Centre, Kannur",
    website: "https://www.google.com/maps/search/?api=1&query=Sugarcane+Breeding+Institute+Kannur",
    district: "Kannur",
    techCount: 14,
    lat: 11.8920,
    lng: 75.3530
  },
  {
    id: 16,
    name: "Sree Chitra Tirunal Institute for Medical Sciences and Technology",
    website: "https://www.google.com/maps/search/?api=1&query=SCTIMST+Trivandrum",
    district: "Thrivandrum",
    techCount: 38,
    lat: 8.5218,
    lng: 76.9270
  },
  {
    id: 17,
    name: "National Institute of Technology (NIT) Calicut",
    website: "https://www.google.com/maps/search/?api=1&query=NIT+Calicut",
    district: "Kozhikode",
    techCount: 22,
    lat: 11.3210,
    lng: 75.9330
  },
  {
    id: 18,
    name: "Indian Institute of Space Science and Technology (IIST)",
    website: "https://www.google.com/maps/search/?api=1&query=IIST+Valiamala",
    district: "Thrivandrum",
    techCount: 38,
    lat: 8.6214,
    lng: 77.1278
  },
  {
    id: 19,
    name: "Cochin University of Science and Technology (CUSAT)",
    website: "https://www.google.com/maps/search/?api=1&query=CUSAT+Kochi",
    district: "Ernakulam",
    techCount: 45,
    lat: 10.0430,
    lng: 76.3244
  },
  {
    id: 20,
    name: "Kerala Veterinary and Animal Sciences University (KVASU)",
    website: "https://www.google.com/maps/search/?api=1&query=KVASU+Pookode",
    district: "Wayanad",
    techCount: 6,
    lat: 11.5380,
    lng: 76.0240
  },
  {
    id: 21,
    name: "Central University of Kerala, Kasaragod",
    website: "https://www.google.com/maps/search/?api=1&query=Central+University+of+Kerala+Kasaragod",
    district: "Kasargod",
    techCount: 8,
    lat: 12.3920,
    lng: 75.0930
  },
  {
    id: 22,
    name: "Government Engineering College, Thrissur",
    website: "https://www.google.com/maps/search/?api=1&query=GEC+Thrissur",
    district: "Thrissur",
    techCount: 18,
    lat: 10.5510,
    lng: 76.2215
  },
  {
    id: 23,
    name: "College of Engineering Trivandrum (CET)",
    website: "https://www.google.com/maps/search/?api=1&query=CET+Trivandrum",
    district: "Thrivandrum",
    techCount: 38,
    lat: 8.5444,
    lng: 76.9048
  },
  {
    id: 24,
    name: "TKM College of Engineering, Kollam",
    website: "https://www.google.com/maps/search/?api=1&query=TKM+College+of+Engineering+Kollam",
    district: "Kollam",
    techCount: 16,
    lat: 8.9130,
    lng: 76.6420
  },
  {
    id: 25,
    name: "Rajiv Gandhi Centre for Biotechnology (RGCB)",
    website: "https://www.google.com/maps/search/?api=1&query=RGCB+Trivandrum",
    district: "Thrivandrum",
    techCount: 38,
    lat: 8.4870,
    lng: 76.9730
  },
  {
    id: 26,
    name: "Mar Athanasios College for Advanced Studies Tiruvalla (MACFAST)",
    website: "https://www.google.com/maps/search/?api=1&query=MACFAST+Thiruvalla",
    district: "Pathanamthitta",
    techCount: 7,
    lat: 9.3820,
    lng: 76.5730
  },
  {
    id: 27,
    name: "Amal Jyothi College of Engineering",
    website: "https://www.google.com/maps/search/?api=1&query=Amal+Jyothi+Kanjirappally",
    district: "Kottayam",
    techCount: 12,
    lat: 9.5310,
    lng: 76.8210
  },
  {
    id: 28,
    name: "College of Engineering Kidangoor",
    website: "https://www.google.com/maps/search/?api=1&query=College+of+Engineering+Kidangoor",
    district: "Kottayam",
    techCount: 12,
    lat: 9.6910,
    lng: 76.6220
  },
  {
    id: 29,
    name: "NSS College of Engineering, Palakkad",
    website: "https://www.google.com/maps/search/?api=1&query=NSS+College+of+Engineering+Palakkad",
    district: "Palakkad",
    techCount: 15,
    lat: 10.8240,
    lng: 76.6930
  },
  {
    id: 30,
    name: "College of Engineering Karunagappally",
    website: "https://www.google.com/maps/search/?api=1&query=College+of+Engineering+Karunagappally",
    district: "Kollam",
    techCount: 16,
    lat: 9.0620,
    lng: 76.5310
  },
  {
    id: 31,
    name: "MES College of Engineering, Kuttippuram",
    website: "https://www.google.com/maps/search/?api=1&query=MES+College+of+Engineering+Kuttippuram",
    district: "Malappuram",
    techCount: 11,
    lat: 10.8140,
    lng: 75.9920
  },
  {
    id: 32,
    name: "College of Engineering Munnar",
    website: "https://www.google.com/maps/search/?api=1&query=College+of+Engineering+Munnar",
    district: "Idukki",
    techCount: 4,
    lat: 10.0910,
    lng: 77.0620
  },
  {
    id: 33,
    name: "College of Engineering Cherthala",
    website: "https://www.google.com/maps/search/?api=1&query=College+of+Engineering+Cherthala",
    district: "Alapuzha",
    techCount: 9,
    lat: 9.6820,
    lng: 76.3210
  },
  {
    id: 34,
    name: "Mar Athanasius College of Engineering (MACE)",
    website: "https://www.google.com/maps/search/?api=1&query=MACE+Kothamangalam",
    district: "Ernakulam",
    techCount: 45,
    lat: 10.0610,
    lng: 76.6200
  }
];

export default function InstitutionsGrid() {
  const [activeDistrict, setActiveDistrict] = useState<string | null>(null);
  const [activeInstitution, setActiveInstitution] = useState<number | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const handleLogoHover = (id: number, district: string) => {
    setActiveInstitution(id);
    setActiveDistrict(district);
  };

  const handleMapHover = (district: string) => {
    setActiveDistrict(district);
    setActiveInstitution(null);
  };

  const resetInteractions = () => {
    setActiveDistrict(null);
    setActiveInstitution(null);
  };

  const visibleLogos = showMore ? institutionLogos : institutionLogos.slice(0, 15);

  return (
    <div className="w-full py-8 md:py-16 px-4 md:px-8 bg-[#eff9ff] min-h-screen font-sans relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto">

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 lg:items-stretch">

          {/* --- MOBILE TITLE --- */}
          <div className="flex lg:hidden items-center gap-3 order-1 px-2">
            <h2
              className="font-normal text-[40px] sm:text-[44px] text-[#1b60bb] leading-none tracking-wide"
              style={{ fontFamily: "'Helios Extended', sans-serif" }}
            >
              Institutions Grid
            </h2>
            <ArrowDownRight className="w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] text-[#1b60bb]" strokeWidth={2.5} />
          </div>

          {/* --- MOBILE DESCRIPTION --- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex lg:hidden order-4 bg-white rounded-[20px] p-5 md:p-7 shadow-[0_4px_20px_rgb(0,0,0,0.04)] flex-col md:flex-row justify-between items-start md:items-end gap-5 border border-white/60"
          >
            <p className="text-[#1A365D] text-[13px] md:text-[14px] leading-relaxed max-w-lg font-medium">
              Partner with Kerala&apos;s leading research hubs. Access the labs, experts, and tech
              you need to bring your startup&apos;s vision to life.
            </p>
            <div className="w-full md:w-auto flex justify-end">
              <Link href="/technologies/institutions">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-[#1b60bb] hover:bg-[#154b94] text-white px-5 py-2.5 md:py-2 rounded-lg font-medium text-sm md:text-base flex items-center gap-1.5 transition-colors shadow-sm whitespace-nowrap"
                >
                  View More <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* --- MAP SECTION --- */}
          <div className="order-2 lg:order-2 lg:w-[35%] xl:w-[40%] flex flex-col justify-stretch h-[450px] lg:h-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6 }}
              className="relative w-full h-full flex-1 flex flex-col items-stretch justify-stretch"
            >
              <div 
                className="relative w-full h-full flex-1 group cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-3xl overflow-hidden ring-1 ring-black/5"
                onClick={() => setIsMapExpanded(true)}
              >
                <div className="absolute inset-0 bg-black/5 rounded-3xl transition-all duration-300 group-hover:bg-black/0 z-20 pointer-events-none" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur shadow-sm p-2 rounded-full z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 size={18} className="text-[#1b60bb]" />
                </div>
                <InteractiveMap 
                  activeDistrict={activeDistrict}
                  activeInstitution={activeInstitution}
                  onDistrictHover={handleMapHover}
                  onDistrictLeave={resetInteractions}
                  onInstitutionHover={setActiveInstitution}
                  isExpanded={false}
                  institutions={institutionLogos}
                />
              </div>
            </motion.div>
          </div>

          {/* Full Screen Map Modal */}
          <AnimatePresence>
            {isMapExpanded && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-8"
              >
                <div className="relative w-full h-full max-w-7xl bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
                  {/* Left Side Panel - Institutions info */}
                  <div className="w-full md:w-[350px] bg-[#111] border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col text-white z-40 overflow-y-auto shrink-0 animate-in fade-in slide-in-from-left duration-300">
                    <h3 className="text-xl font-bold font-sans text-white">Kerala Innovation Hubs</h3>
                    <p className="text-white/60 text-xs mt-1">Hover or click a location pin to explore</p>
                    
                    <div className="mt-8 flex-1">
                      {activeDistrict ? (
                        <div>
                          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                            <h4 className="text-lg font-semibold text-[#ef4444]">{activeDistrict}</h4>
                            <span className="text-xs bg-[#1b60bb] px-2 py-0.5 rounded font-mono text-white">
                              {mapCoordinates[activeDistrict]?.techCount || 0} Techs
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            {institutionLogos
                              .filter(inst => inst.district === activeDistrict)
                              .map(inst => {
                                const isActive = activeInstitution === inst.id;
                                return (
                                  <a 
                                    key={inst.id} 
                                    href={inst.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onMouseEnter={() => setActiveInstitution(inst.id)}
                                    onMouseLeave={() => setActiveInstitution(null)}
                                    className={`block p-3 rounded-xl border transition-all duration-200 ${
                                      isActive 
                                        ? 'bg-[#ef4444]/20 border-[#ef4444] scale-[1.02]' 
                                        : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
                                    }`}
                                  >
                                    <div className="font-medium text-sm text-white">{inst.name}</div>
                                    <div className="text-[11px] text-[#1b60bb] font-semibold mt-1">
                                      {inst.techCount} Technologies
                                    </div>
                                  </a>
                                );
                              })}
                            {institutionLogos.filter(inst => inst.district === activeDistrict).length === 0 && (
                              <div className="text-xs text-white/40 italic">No institutions mapped in this district yet.</div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-white/40 text-sm italic px-4 py-12">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 text-[#1b60bb] animate-bounce">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          Hover over or click a location pin on the map to view the universities and research hubs.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side Map */}
                  <div className="flex-1 relative h-[50vh] md:h-full">
                    <div className="absolute top-4 right-4 z-50">
                      <button 
                        onClick={() => setIsMapExpanded(false)}
                        className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur transition-colors"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    <InteractiveMap 
                      activeDistrict={activeDistrict}
                      activeInstitution={activeInstitution}
                      onDistrictHover={handleMapHover}
                      onDistrictLeave={resetInteractions}
                      onInstitutionHover={setActiveInstitution}
                      isExpanded={true}
                      institutions={institutionLogos}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

                            {/* --- CONTENT SECTION --- */}
                            <div className="order-3 lg:order-1 lg:w-[60%] xl:w-[55%] flex flex-col gap-4 md:gap-5">

                              {/* DESKTOP TITLE */}
                              <div className="hidden lg:flex items-center gap-3 mb-2">
                                <h2
                                  className="font-normal text-[52px] xl:text-[60px] text-[#1b60bb] leading-none tracking-wide"
                                  style={{ fontFamily: "'Helios Extended', sans-serif" }}
                                >
                                  Institutions Grid
                                </h2>
                                <ArrowDownRight className="w-[52px] h-[52px] xl:w-[60px] xl:h-[60px] text-[#1b60bb]" strokeWidth={2.5} />
                              </div>

                              {/* Description Card */}
                              <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="hidden lg:flex bg-white rounded-[20px] p-5 md:p-7 shadow-[0_4px_20px_rgb(0,0,0,0.04)] flex-col md:flex-row justify-between items-start md:items-end gap-5 border border-white/60"
                              >
                                <p className="text-[#1A365D] text-[13px] md:text-[14px] leading-relaxed max-w-lg font-medium">
                                  Partner with Kerala&apos;s leading research hubs. Access the labs, experts, and tech
                                  you need to bring your startup&apos;s vision to life.
                                </p>
                                <div className="w-full md:w-auto flex justify-end">
                                  <Link href="/technologies/institutions">
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      className="group bg-[#1b60bb] hover:bg-[#154b94] text-white px-5 py-2.5 md:py-2 rounded-lg font-medium text-sm md:text-base flex items-center gap-1.5 transition-colors shadow-sm whitespace-nowrap"
                                    >
                                      View More <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </motion.button>
                                  </Link>
                                </div>
                              </motion.div>

                              {/* Logos Grid Card */}
                              <motion.div
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                className="relative bg-white rounded-[24px] p-5 md:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-white/60"
                              >
                                {/* Smooth Expansion Container */}
                                <motion.div layout className="relative overflow-visible w-full">
                                  <motion.div
                                    layout
                                    className={`grid grid-cols-4 md:grid-cols-5 gap-y-6 md:gap-y-10 gap-x-2 md:gap-x-4 ${!showMore ? 'pb-12 md:pb-16' : 'pb-4'}`}
                                  >
                                  <AnimatePresence>
                    {visibleLogos.map((institution, index) => {
                      const isActiveLogo = activeInstitution === institution.id;
                      const isActiveDistrict = activeDistrict === institution.district;
                      const isDimmed = activeDistrict !== null && !isActiveDistrict && !isActiveLogo;

                      // 1. Prevent Vertical Clipping (Top Row)
                      const isTopRowClipped = showMore && index < 5;

                      // 2. Prevent Horizontal Clipping (Grid Edges)
                      const isMobileLeft = index % 4 === 0;
                      const isMobileRight = index % 4 === 3;
                      const isDesktopLeft = index % 5 === 0;
                      const isDesktopRight = index % 5 === 4;

                      // Build base classes (Mobile: 4 columns)
                      const baseAlign = isMobileLeft ? "left-0 translate-x-0" :
                                        isMobileRight ? "right-0 translate-x-0" :
                                        "left-1/2 -translate-x-1/2";

                      // Build desktop classes (Desktop: 5 columns) with overrides
                      const mdAlign = isDesktopLeft ? "md:left-0 md:translate-x-0 md:right-auto" :
                                      isDesktopRight ? "md:right-0 md:translate-x-0 md:left-auto" :
                                      "md:left-1/2 md:-translate-x-1/2 md:right-auto";

                      return (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          key={institution.id}
                          onMouseEnter={() => handleLogoHover(institution.id, institution.district)}
                          onClick={() => handleLogoHover(institution.id, institution.district)}
                          onMouseLeave={resetInteractions}
                          animate={{
                            scale: isActiveDistrict || isActiveLogo ? 1.05 : 1,
                            opacity: isDimmed ? 0.3 : 1,
                            zIndex: isActiveLogo ? 100 : 1, // Boosted z-index
                          }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="relative group flex items-center justify-center cursor-pointer"
                        >
                          {/* Logo Placeholder */}
                          <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center p-2 shadow-sm">
                            <div className="text-center text-slate-400 text-[9px] md:text-[10px] font-medium leading-tight">
                              Logo<br />{institution.id}
                            </div>
                          </div>

                          {/* Liquid Glass Tooltip - Smart Positioning */}
                          <AnimatePresence>
                            {isActiveLogo && (
                              <motion.div
                                initial={{ opacity: 0, y: isTopRowClipped ? -10 : 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: isTopRowClipped ? -5 : 5, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className={`absolute transform mb-2 p-3 rounded-xl w-44 shadow-[0_8px_32px_0_rgba(27,96,187,0.15)] backdrop-blur-md bg-white/95 border border-white text-center z-[100] pointer-events-none 
                                  ${isTopRowClipped ? "top-full mt-2" : "bottom-full mb-2"} 
                                  ${baseAlign} ${mdAlign}
                                `}
                              >
                                <div className="font-semibold text-[#1A365D] text-sm mb-0.5">
                                  {institution.name}
                                </div>
                                <div className="text-[11px] text-[#1b60bb] font-medium mb-2">
                                  {institution.techCount} Technologies
                                </div>
                                <div className="text-xs text-slate-500 font-medium inline-flex items-center gap-1">
                                  Visit Website <ArrowUpRight size={12} />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              </motion.div>

              {/* Show More Gradient Overlay */}
              {!showMore && (
                <div className="absolute bottom-0 left-0 w-full h-24 md:h-28 bg-gradient-to-t from-white via-white/95 to-transparent rounded-b-[24px] flex items-end p-5 md:p-8 pointer-events-none z-10">
                  <button
                    onClick={() => setShowMore(true)}
                    className="text-slate-400 font-sans text-[15px] hover:text-[#1b60bb] transition-colors pointer-events-auto font-medium"
                  >
                    See More...
                  </button>
                </div>
              )}

              {/* Show Less Control */}
              {showMore && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 pt-4 border-t border-slate-100 flex justify-start"
                >
                  <button
                    onClick={() => setShowMore(false)}
                    className="text-slate-400 font-sans text-[15px] hover:text-[#1b60bb] transition-colors font-medium"
                  >
                    See Less...
                  </button>
                </motion.div>
              )}
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}