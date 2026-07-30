'use client';

import { ArrowUpRight, CircleCheckBig, Building2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatTechnologyName } from '@/lib/utils';

export interface TechnologyCardProps {
  id: string;
  name: string;
  image: string;
  sector: string;
  institution: string;
  ipStatus: 'Patented' | 'Patent Filed' | 'Not Specified';
  featured: boolean;
  description?: string;
}

export default function TechnologyCard({
  id,
  name,
  image,
  sector,
  institution,
  ipStatus,
  featured,
  description,
}: TechnologyCardProps) {
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

  // Proxy external images (e.g. drive.google.com) to bypass mobile user-agent blocking rules
  const imageUrl = image.startsWith('http')
    ? `/api/image-proxy?url=${encodeURIComponent(image)}`
    : image;

  return (
    <div
      className="w-full h-full relative transition-transform duration-300 ease-out hover:-translate-y-4 hover:z-50 will-change-transform group"
    >
      <Link href="https://rink-ksum.vercel.app/" target="_blank" rel="noopener noreferrer" className="block h-full outline-none">
        <div
          className="bg-white rounded-2xl overflow-hidden h-full flex flex-col relative border border-gray-100 shadow-[0_8px_16px_-3px_rgba(0,0,0,0.08)] group-hover:shadow-[0_25px_50px_-12px_rgba(27,96,187,0.15)] transition-shadow duration-300"
        >
          {/* Image Container */}
          <div className="p-2 md:p-2.5">
            <div className="relative h-[140px] sm:h-[150px] md:h-[180px] w-full overflow-hidden rounded-xl">
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width:768px) 260px, 320px"
              />

              <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm rounded-full px-2.5 h-[22px] md:h-6 shadow-md z-20 flex items-center justify-center">
                <span className="font-avenir text-[9px] md:text-[10px] font-semibold text-[#1b60bb] truncate max-w-[120px] leading-none select-none">
                  {sector}
                </span>
              </div>
            </div>
          </div>

          {/* TOP TECH Ribbon */}
          {featured && (
            <div
              className="absolute -top-[2px] right-4 bg-[#f97316] shadow-md z-30 flex flex-col items-center pt-2 pb-4 px-2.5"
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
              {formatTechnologyName(name)}
            </h3>

            {/* Institution Label */}
            <div className="bg-[#f8f5f4] rounded-lg p-2 mb-3 flex items-center gap-2 overflow-hidden">
              <Building2 size={12} className="text-gray-500 flex-shrink-0" />
              <span className="font-poppins text-[9px] sm:text-[10px] md:text-[11px] text-gray-700 font-medium leading-snug truncate flex-1 min-w-0">
                {institution}
              </span>
            </div>

            {/* Short Description */}
            {description && (
              <p className="font-poppins text-[10px] sm:text-[11px] text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                {description.length > 100 ? `${description.substring(0, 97)}...` : description}
              </p>
            )}

            {/* Footer Section: IP Status & Button */}
            <div className="mt-auto flex items-end justify-between gap-2 border-t border-gray-100 pt-3">
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

              <div className="group/btn bg-[#1b60bb] hover:bg-[#153156] text-white px-3 py-1.5 rounded-lg font-avenir font-semibold text-[10px] sm:text-[11px] md:text-xs flex items-center gap-1 shadow-sm transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-md whitespace-nowrap">
                View Details
                <ArrowUpRight
                  size={12}
                  strokeWidth={2.5}
                  className="transition-transform duration-700 ease-out group-hover/btn:translate-x-[2px] group-hover/btn:-translate-y-[2px]"
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
