//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\components\RomiAI\MiniCard.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { formatTechnologyName } from '@/lib/utils';
import Link from 'next/link';

interface MiniCardProps {
  technology: {
    technology_id: string;
    technology_name: string;
    institution: string;
    primary_sector: string;
    secondary_sector?: string;
    technology_type?: string;
    problem_solved?: string;
    brief_description_abstract: string;
    description?: string;
    applications?: string;
    trl: string;
    startup_potential: string;
    patent_status: string;
    contact_person?: string;
    email?: string;
    image_url?: string;
    featured?: boolean;
    is_top_tech?: boolean;
  };
}

export default function MiniCard({ technology }: MiniCardProps) {
  const expanded = false; // Added to support your expanded logic snippet without a ReferenceError in this compact layout
  console.log("MiniCard received technology object:", technology);

  return (
    <Link href={`/technologies/${technology.technology_id}`} className="block w-full">
      <motion.div
        layout
        className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3 relative overflow-hidden group"
      >
        {/* Ribbon Badge over the whole card */}
        {(technology.featured || technology.is_top_tech) && (
          <div className="absolute top-0 right-3 bg-[#f97316] text-white font-bold px-1.5 pt-1 pb-1.5 shadow-sm uppercase tracking-wider flex flex-col items-center justify-center rounded-b-md z-10">
            <span className="text-[7px] leading-[1.2] text-center">TOP<br />TECH</span>
          </div>
        )}

        {/* Square Image with Cornered Edges */}
        <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 relative">
          {technology.image_url ? (
            <img
              src={technology.image_url}
              alt={formatTechnologyName(technology.technology_name)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#1b60bb]/5 text-[#1b60bb]">
              <span className="font-helios font-bold text-xl">{formatTechnologyName(technology.technology_name).charAt(0)}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-helios font-bold text-xs text-gray-900 leading-snug truncate pr-6">
              {formatTechnologyName(technology.technology_name)}
            </h4>
            <ArrowUpRight size={14} className="text-gray-400 group-hover:text-[#1b60bb] transition-colors flex-shrink-0 mt-0.5" />
          </div>
          <p className="font-poppins text-[10px] text-gray-500 font-medium mb-0.5 truncate">
            {technology.institution}
          </p>
          <p className="font-poppins text-xs text-gray-600 leading-relaxed mt-1">
            {expanded 
              ? (technology.brief_description_abstract || technology.description || "No description provided.") 
              : (technology.brief_description_abstract 
                  ? `${technology.brief_description_abstract.substring(0, 120)}${technology.brief_description_abstract.length > 120 ? '...' : ''}` 
                  : "No description provided.")
            }
          </p>
        </div>
      </motion.div>
    </Link>
  );
}