'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Building2, CircleCheckBig } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatTechnologyName } from '@/lib/utils';

export interface TechnologyListCardProps {
  id: string;
  name: string;
  image: string;
  sector: string;
  institution: string;
  ipStatus: string;
  description: string;
  featured: boolean;
}

export default function TechnologyListCard({
  id,
  name,
  image,
  sector,
  institution,
  ipStatus,
  description,
  featured,
}: TechnologyListCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getIPStatusColor = (status: string) => {
    switch (status) {
      case 'Patented':
        return 'text-green-600';
      case 'Patent Filed':
        return 'text-blue-600';
      case 'Not Specified':
      default:
        return 'text-red-600';
    }
  };

  // Truncate description to a safe maximum for DOM rendering
  const truncateDescription = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length > maxLength) {
      return text.substring(0, maxLength);
    }
    return text;
  };

  const displayDescription = truncateDescription(description || '', 300);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      animate={{
        y: isHovered ? -2 : 0,
      }}
      transition={{
        duration: 0.2,
        ease: 'easeOut',
      }}
      className="w-full relative z-0 mb-4"
    >
      <Link href={`/technologies/${id}`} className="block outline-none">
        <motion.div
          className="bg-white rounded-xl overflow-hidden flex flex-col sm:flex-row relative group border border-gray-200"
          animate={{
            boxShadow: isHovered
              ? '0 10px 25px -5px rgba(27, 96, 187, 0.15)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          }}
          transition={{ duration: 0.2 }}
        >
          {/* Top Right Badge (Outside Image, on Card) */}
          {featured && (
            <div
              className="absolute top-0 right-4 sm:right-6 w-12 h-16 bg-[#f97316] flex flex-col items-center justify-start pt-1.5 z-10"
              style={{
                clipPath: 'polygon(100% 0, 100% 100%, 60% 68%, 17% 100%, 17% 0)',
              }}
            >
              {/* Padding-left compensates for the 17% cut-off on the left to perfectly center text */}
              <div className="pl-[17%] flex flex-col items-center w-full gap-0.5">
                <CircleCheckBig size={14} className="text-white" strokeWidth={2.5} />
                <span className="text-white font-bold text-[10px] leading-[1.1] text-center">
                  TOP<br />TECH
                </span>
              </div>
            </div>
          )}

          {/* Image Section */}
          <div className="w-full sm:w-56 sm:flex-shrink-0 relative h-48 sm:h-auto min-h-[160px]">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              sizes="(max-width:768px) 100%, 224px"
            />
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between bg-white relative">

            {/* Top Content */}
            <div className="mb-4 pr-10 sm:pr-14"> {/* Right padding to prevent text under badge */}

              {/* Title */}
              <h3 className="font-helios text-lg sm:text-[22px] leading-tight font-medium text-[#1b60bb] line-clamp-2 mb-3">
                {formatTechnologyName(name)}
              </h3>

              {/* Institution & Sector Pills */}
              <div className="flex flex-wrap gap-2 mb-3">
                {/* Institution - Beige rectangular pill */}
                <div className="bg-[#fcf5f3] rounded px-2.5 py-1 inline-flex items-center gap-1.5 border border-[#f5e6e1]">
                  <Building2 size={12} className="text-gray-600" />
                  <span className="font-poppins text-[10px] text-gray-700 font-semibold uppercase tracking-wider truncate">
                    {institution}
                  </span>
                </div>

                {/* Sector - Light blue rounded-full pill */}
                <div className="bg-[#f0f7ff] rounded-full px-3 py-1 inline-flex items-center">
                  <span className="font-poppins text-[11px] text-[#1b60bb] font-medium">
                    {sector}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="font-poppins text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {displayDescription}
              </p>
            </div>

            {/* Bottom Section: IP Status & Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-gray-400 pt-3 gap-3">
              <div className="font-avenir text-sm">
                <span className="text-gray-800 font-semibold">IP Status: </span>
                <span className={`font-bold ${getIPStatusColor(ipStatus)}`}>
                  {ipStatus || 'Not Specified'}
                </span>
              </div>

              <div
                className="bg-[#005bb5] hover:bg-[#004a94] text-white px-4 py-1.5 rounded flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="font-poppins text-xs font-semibold">View Details</span>
                <ArrowUpRight size={16} />
              </div>
            </div>

          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}