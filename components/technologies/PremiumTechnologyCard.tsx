'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, CircleCheckBig, Building2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export interface TechnologyCardProps {
  id: string;
  name: string;
  image: string;
  sector: string;
  institution: string;
  ipStatus: 'Patented' | 'Patent Filed' | 'Not Specified';
  featured: boolean;
}

export default function TechnologyCard({
  id,
  name,
  image,
  sector,
  institution,
  ipStatus,
  featured,
}: TechnologyCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getIPStatusColor = (status: TechnologyCardProps['ipStatus']) => {
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

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      animate={{
        y: isHovered ? -16 : 0,
      }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{
        willChange: 'transform',
        zIndex: isHovered ? 50 : 0,
      }}
      className="w-full relative"
    >
      <Link href={`/technologies/${id}`} className="block h-full outline-none">
        <motion.div
          className="bg-white rounded-2xl overflow-hidden h-full flex flex-col relative group border border-gray-100"
          animate={{
            boxShadow: isHovered
              ? '0 25px 50px -12px rgba(27, 96, 187, 0.15)'
              : '0 8px 16px -3px rgba(0, 0, 0, 0.08)',
          }}
          transition={{ duration: 0.4 }}
        >
          {/* Image Container */}
          <div className="p-2 md:p-2.5">
            <div className="relative h-[140px] sm:h-[150px] md:h-[180px] w-full overflow-hidden rounded-xl">
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width:768px) 260px, 320px"
              />

              <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-md z-20">
                <span className="font-avenir text-[9px] md:text-[10px] font-semibold text-[#1b60bb] truncate max-w-[120px] inline-block">
                  {sector}
                </span>
              </div>
            </div>
          </div>

          {/* TOP TECH Ribbon */}
          {featured && (
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
          <div className="flex-1 p-3 sm:p-4 md:p-5 flex flex-col bg-white">
            <h3 className="font-helios font-normal text-[14px] sm:text-[15px] md:text-[16px] text-[#1b60bb] mb-2 leading-tight line-clamp-2 min-h-[2rem]">
              {name}
            </h3>

            {/* Institution Label */}
            <div className="bg-[#f8f5f4] rounded-lg p-2 mb-3 flex items-center gap-2 overflow-hidden">
              <Building2 size={12} className="text-gray-500 flex-shrink-0" />
              <span className="font-poppins text-[9px] sm:text-[10px] md:text-[11px] text-gray-700 font-medium leading-snug truncate flex-1 min-w-0">
                {institution}
              </span>
            </div>

            {/* Footer Section: IP Status & Button */}
            <div className="mt-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-t border-gray-100 pt-3">
              <div className="flex flex-col">
                <span className="font-avenir text-[9px] sm:text-[10px] text-gray-500 mb-0.5">
                  IP Status
                </span>
                <span
                  className={`font-avenir text-[11px] sm:text-xs md:text-sm font-bold tracking-wide ${getIPStatusColor(
                    ipStatus
                  )}`}
                >
                  {ipStatus}
                </span>
              </div>

              <button className="group/btn bg-[#1b60bb] hover:bg-[#153156] text-white px-3 py-1 sm:py-1.5 md:py-2 rounded-lg font-avenir font-semibold text-[10px] sm:text-[11px] md:text-xs flex items-center gap-1 shadow-sm transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-md whitespace-nowrap">
                View Details
                <ArrowUpRight
                  size={12}
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
}
