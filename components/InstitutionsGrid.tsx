'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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

// 2. Mock Data generation (injecting the correct techCount per district)
const districts = Object.keys(mapCoordinates);
const institutionLogos = Array.from({ length: 20 }, (_, i) => {
  const assignedDistrict = districts[i % districts.length];
  return {
    id: i + 1,
    name: `Institution ${i + 1}`,
    website: `https://example.com/inst${i + 1}`,
    district: assignedDistrict,
    techCount: mapCoordinates[assignedDistrict].techCount
  };
});

export default function InstitutionsGrid() {
  const [activeDistrict, setActiveDistrict] = useState<string | null>(null);
  const [activeInstitution, setActiveInstitution] = useState<number | null>(null);
  const [showMore, setShowMore] = useState(false);

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

  const visibleLogos = showMore ? institutionLogos : institutionLogos.slice(0, 10);

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
            className="flex lg:hidden order-2 bg-white rounded-[20px] p-5 md:p-7 shadow-[0_4px_20px_rgb(0,0,0,0.04)] flex-col md:flex-row justify-between items-start md:items-end gap-5 border border-white/60"
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
          <div className="order-3 lg:order-2 lg:w-[40%] xl:w-[45%] flex items-center justify-center min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6 }}
              className="relative w-full h-full flex items-center justify-center max-w-[350px] lg:max-w-[450px]"
            >
              <div className="relative w-full h-full aspect-[2/3]">
                <Image
                  src="/images/kerala-map.png"
                  alt="Kerala 3D Map with research institutions"
                  fill
                  className="object-contain"
                  priority
                />

                {/* Hotspots */}
                {Object.entries(mapCoordinates).map(([district, coords]) => {
                  const isHovered = activeDistrict === district;
                  return (
                    <div
                      key={district}
                      onMouseEnter={() => handleMapHover(district)}
                      onMouseLeave={resetInteractions}
                      className="absolute z-10 w-8 h-8 -ml-4 -mt-4 cursor-pointer group"
                      style={{
                        left: getResponsivePos(coords.left, false),
                        top: getResponsivePos(coords.top, true),
                      }}
                    >
                      {/* Invisible larger hover area */}
                      <div className="w-full h-full rounded-full absolute top-0 left-0" />

                                        <AnimatePresence>
                                          {isHovered && (
                                            <motion.div
                                              initial={{ opacity: 0, y: -20, scale: 0.8 }}
                                              animate={{ opacity: 1, y: -16, scale: 1 }}
                                              exit={{ opacity: 0, y: -10, scale: 0.8 }}
                                              transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                              // Precisely aligned so the tip of the map pin hits the coordinate
                                              className="absolute -top-8 -left-4 flex flex-col items-center drop-shadow-xl z-50"
                                            >
                                              <ClassicMapPin />
                                              <div className="mt-0.5 bg-[#172E4D] text-white text-[11px] px-2.5 py-0.5 rounded shadow-sm font-medium whitespace-nowrap">
                                                {district}
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            </div>

                            {/* --- CONTENT SECTION --- */}
                            <div className="order-4 lg:order-1 lg:w-[60%] xl:w-[55%] flex flex-col gap-4 md:gap-5">

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