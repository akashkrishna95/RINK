// app\RomiPortal\RomiPortalFeatures\MiniCard.tsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, School, Phone, Mail } from 'lucide-react';
import { formatTechnologyName } from '@/lib/utils';
import Link from 'next/link';

let cachedInstrumentData: any = null;
let fetchPromise: Promise<any> | null = null;


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
  className?: string;
  customHref?: string;
  isInstrumentation?: boolean;
  contactNumber?: string;
  email?: string;
}

export default function MiniCard({ technology, className, customHref, isInstrumentation, contactNumber, email }: MiniCardProps) {
  const expanded = false;
  const [imgError, setImgError] = useState(false);
  const [dynamicImageUrl, setDynamicImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isInstrumentation && technology.technology_id) {
      if (cachedInstrumentData) {
        findAndSetImage(cachedInstrumentData);
      } else {
        if (!fetchPromise) {
          fetchPromise = fetch('https://rink-git-cron.vercel.app/instrument.json')
            .then(res => res.json())
            .catch(err => {
              console.error("Error fetching instrument data", err);
              return null;
            });
        }
        fetchPromise.then(data => {
          if (data) {
            cachedInstrumentData = data;
            findAndSetImage(data);
          }
        });
      }
    }

    function findAndSetImage(data: any) {
      const inst = data.main_data?.find((item: any) => item.id === technology.technology_id);
      if (inst && inst.image_link) {
        const imgUrl = inst.image_link.startsWith('http') 
          ? inst.image_link 
          : `https://rink-git-cron.vercel.app${inst.image_link}`;
        setDynamicImageUrl(imgUrl);
      }
    }
  }, [isInstrumentation, technology.technology_id]);

  console.log("MiniCard received technology object:", technology);

  const defaultHref = isInstrumentation
    ? `https://rink-ui.vercel.app/instrument/${technology.technology_id}`
    : `/technologies/${technology.technology_id}`;


  const href = customHref || defaultHref;

  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" className="block w-full">
      <div
        className={`${className || "bg-white/95 dark:bg-[#1a1a1a]/95 border border-gray-200/80 dark:border-white/[0.1]"} rounded-2xl p-2.5 sm:p-3.5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2.5 sm:gap-3.5 relative overflow-hidden group`}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 50%, rgba(255,255,255,0.03) 100%)',
        }}
      >
        {/* Liquid glass shine effect - multiple layers */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
        </div>

        {/* Ribbon Badge over the whole card */}
        {(technology.featured || technology.is_top_tech) && (
          <div className="absolute top-0 right-3 bg-[#f97316] text-white font-bold px-1.5 pt-1 pb-1.5 shadow-sm uppercase tracking-wider flex flex-col items-center justify-center rounded-b-md z-10">
            <span className="text-[7px] leading-[1.2] text-center">TOP<br />TECH</span>
          </div>
        )}

        {/* Square Image with Cornered Edges */}
        <div className="flex-shrink-0 w-12 h-12 sm:w-20 sm:h-20 bg-gray-50 dark:bg-[#272727] rounded-lg overflow-hidden border border-gray-100 dark:border-white/[0.08] relative shadow-inner z-10">
          {(() => {
            const finalImageUrl = dynamicImageUrl || technology.image_url;
            if (
              finalImageUrl && 
              finalImageUrl !== "Not Specified" && 
              finalImageUrl !== "null" && 
              finalImageUrl !== "undefined" && 
              (finalImageUrl.startsWith("http://") || finalImageUrl.startsWith("https://") || finalImageUrl.startsWith("/")) && 
              !imgError
            ) {
              return (
                <img
                  src={finalImageUrl}
                  alt={formatTechnologyName(technology.technology_name)}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              );
            }
            return (
              <div className="w-full h-full flex items-center justify-center bg-[#1b60bb]/5 dark:bg-white/[0.05] text-[#1b60bb] dark:text-[#7dd3fc]">
                <span className="font-helios font-bold text-lg sm:text-xl">{formatTechnologyName(technology.technology_name).charAt(0)}</span>
              </div>
            );
          })()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center font-sans relative z-10">
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-helios font-bold text-[11px] sm:text-sm text-gray-900 dark:text-gray-100 leading-snug line-clamp-1 sm:line-clamp-2 pr-6">
              {formatTechnologyName(technology.technology_name)}
            </h4>
            <ArrowUpRight size={14} className="text-gray-400 group-hover:text-[#1b60bb] dark:group-hover:text-[#7dd3fc] transition-colors flex-shrink-0 mt-0.5" />
          </div>
          <p className="font-poppins text-[9px] sm:text-xs text-gray-500 dark:text-gray-400 font-semibold mt-0.5 leading-tight flex items-center gap-1 sm:gap-1.5 min-w-0 w-full">
            <School size={10} className="text-gray-400 dark:text-gray-400 shrink-0" />
            <span className="truncate flex-1">{technology.institution}</span>
          </p>
          {isInstrumentation && (
            <div className="flex flex-col gap-0.5 mt-0.5">
              {email && (
                <p className="font-poppins text-[9px] sm:text-xs text-gray-500 dark:text-gray-400 font-semibold leading-tight flex items-center gap-1 sm:gap-1.5 min-w-0 w-full">
                  <Mail size={10} className="text-gray-400 dark:text-gray-400 shrink-0" />
                  <span className="truncate flex-1">{email}</span>
                </p>
              )}
              {contactNumber && (
                <p className="font-poppins text-[9px] sm:text-xs text-gray-500 dark:text-gray-400 font-semibold leading-tight flex items-center gap-1 sm:gap-1.5 min-w-0 w-full">
                  <Phone size={10} className="text-gray-400 dark:text-gray-400 shrink-0" />
                  <span className="truncate flex-1">{contactNumber}</span>
                </p>
              )}
            </div>
          )}
          <p className="font-poppins text-[10px] sm:text-xs text-gray-600 dark:text-gray-300 leading-relaxed mt-0.5 sm:mt-1 line-clamp-2">
            {(() => {
              const rawDesc = technology.description || technology.brief_description_abstract || "No description provided.";
              
              // Clean up any "Technology:... Sector:... Description:..." formatting
              let desc = rawDesc;
              const descIndex = rawDesc.toLowerCase().indexOf("description:");
              if (descIndex !== -1) {
                desc = rawDesc.substring(descIndex + "description:".length).trim();
              }
              
              // Clean up any "Keywords:..." formatting at the end
              const keywordsIndex = desc.toLowerCase().indexOf("keywords:");
              if (keywordsIndex !== -1) {
                desc = desc.substring(0, keywordsIndex).trim();
              }
              
              // Clean up trailing dots resulting from splits
              if (desc.endsWith("..")) {
                desc = desc.substring(0, desc.length - 2).trim();
              } else if (desc.endsWith(".")) {
                desc = desc.substring(0, desc.length - 1).trim();
              }
              
              // Ensure it ends with a single period
              if (desc && desc !== "No description provided." && !desc.endsWith(".") && !desc.endsWith("?")) {
                desc += ".";
              }
              
              return desc.length > 250 ? `${desc.substring(0, 250)}...` : desc;
            })()}
          </p>

          {/* Mini Pills from Database */}
          <div className="flex flex-wrap gap-1 mt-1.5 sm:mt-2.5">
            {technology.technology_id && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-bold font-sans tracking-wide uppercase bg-blue-50 dark:bg-blue-900/40 text-[#1b60bb] dark:text-[#7dd3fc] border border-blue-100/50 dark:border-blue-700/50">
                ID: {technology.technology_id}
              </span>
            )}
            {isInstrumentation ? (
              contactNumber && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-bold font-sans tracking-wide bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-100/50 dark:border-amber-700/40">
                  Contact: {contactNumber}
                </span>
              )
            ) : (
              <>
                {technology.trl && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-bold font-sans tracking-wide bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-100/50 dark:border-amber-700/40">
                    TRL: {technology.trl}
                  </span>
                )}
                {technology.patent_status && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-bold font-sans tracking-wide bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-100/50 dark:border-emerald-700/40">
                    Patent: {technology.patent_status}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}