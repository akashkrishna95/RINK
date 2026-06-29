'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface Technology {
  technology_id: string;
  technology_name: string;
  primary_sector?: string;
  brief_description_abstract?: string;
  description?: string;
  brief_description?: string;
  image_url?: string;
  institution?: string;
}

interface MiniCardProps {
  technology: Technology;
}

export default function MiniCard({ technology }: MiniCardProps) {
  const desc = technology.brief_description_abstract || technology.description || technology.brief_description || 'No description available.';
  const truncatedDesc = desc.length > 120 ? desc.substring(0, 120) + '...' : desc;
  const id = technology.technology_id.split('_row')[0];

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01, boxShadow: "0 10px 20px -3px rgba(27, 96, 187, 0.06)" }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="w-full"
    >
      <Link
        href={`/technologies/${id}`}
        className="group p-3 bg-white hover:bg-gradient-to-br hover:from-white hover:to-[#f5f9ff] border border-gray-200 hover:border-[#1b60bb] rounded-2xl shadow-sm flex items-start gap-3 transition-all duration-300 block"
      >
        {/* Micro Image Thumbnail */}
        <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-100">
          <img
            src={technology.image_url || '/images/placeholder-tech.jpg'}
            alt={technology.technology_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/images/placeholder-tech.jpg';
            }}
          />
        </div>
        
        {/* Text Info */}
        <div className="flex-1 min-w-0">
          <h5 className="font-helios font-bold text-[12px] text-gray-800 line-clamp-1 group-hover:text-[#1b60bb] leading-snug">
            {technology.technology_name}
          </h5>
          <p className="font-poppins text-[10px] text-gray-500 line-clamp-2 mt-0.5 leading-normal">
            {truncatedDesc}
          </p>
          {technology.institution && (
            <span className="text-[9px] font-bold text-[#1b60bb] tracking-wide block mt-1 font-poppins uppercase">
              {technology.institution}
            </span>
          )}
        </div>
        
        <ArrowUpRight size={14} className="text-gray-400 group-hover:text-[#1b60bb] transition-colors flex-shrink-0 self-center" />
      </Link>
    </motion.div>
  );
}
