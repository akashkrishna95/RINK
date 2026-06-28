'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, Tag, Award, MapPin, ChevronRight, ArrowUpRight, X, Handshake } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import PremiumTechnologyCard from './PremiumTechnologyCard';

interface PremiumTechnologyDetailsProps {
  id: string;
}

export default function PremiumTechnologyDetails({ id }: PremiumTechnologyDetailsProps) {
  const router = useRouter();
  const [technology, setTechnology] = useState<any>(null);
  const [allTechnologies, setAllTechnologies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTech() {
      try {
        const res = await fetch('/api/technologies');
        const json = await res.json();
        if (json.success && json.technologies) {
          let rawData = json.technologies;
          if (rawData['MAIN SHEET']) {
            rawData = rawData['MAIN SHEET'];
          }
          const processedTechs = (rawData || [])
            .filter((tech: any) => tech.technology_id && tech.technology_id !== 'technology_id');
          
          setAllTechnologies(processedTechs);
          const tech = processedTechs.find((t: any) => String(t.technology_id) === id);
          setTechnology(tech || null);
        } else {
          setTechnology(null);
        }
      } catch (error) {
        console.error("Failed to load technologies", error);
        setTechnology(null);
      } finally {
        setLoading(false);
      }
    }
    fetchTech();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-[#1b60bb]/30 border-t-[#1b60bb] rounded-full" />
        </div>
      </div>
    );
  }

  if (!technology) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12">
        <h1 className="font-helios text-4xl font-bold text-[#1b60bb] mb-4">Technology Not Found</h1>
        <p className="text-gray-600 font-poppins mb-8">The technology you're looking for doesn't exist.</p>
        <Link
          href="/technologies/browse_technologies"
          className="px-8 py-3 bg-[#1b60bb] text-white rounded-lg hover:bg-[#153156] transition-colors font-poppins font-semibold"
        >
          Back to Browse Technologies
        </Link>
      </div>
    );
  }

  const techId = technology.technology_id || 'N/A';
  const techName = technology.technology_name || 'Untitled Technology';
  const institution = technology.institution || 'N/A';
  const sector = technology.primary_sector || 'N/A';
  const problemSolved = technology.problem_solved || '';
  const description = technology.description || '';
  const applications = technology.applications || '';
  const ipStatus = technology.patent_status || 'Not Specified';
  const trl = technology.trl || 'Not Specified';
  const image = technology.image_url || '/images/placeholder-tech.jpg';
  const isFeatured = technology.startup_potential === 'High';

  const getIPStatusColor = (status: string) => {
    switch (status) {
      case 'Patented':
        return { bg: 'bg-[#e8f5e9]', text: 'text-[#1d984a]', icon: 'text-[#1d984a]' };
      case 'Patent Filed':
        return { bg: 'bg-[#e3f2fd]', text: 'text-[#1b60bb]', icon: 'text-[#1b60bb]' };
      case 'Not Specified':
        return { bg: 'bg-[#ffebee]', text: 'text-[#ff3131]', icon: 'text-[#ff3131]' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', icon: 'text-gray-600' };
    }
  };

  const statusColor = getIPStatusColor(ipStatus);

  // Get related technologies from same sector (limit to 6)
  const relatedTechnologies = allTechnologies
    .filter((t: any) => 
      t.primary_sector === sector && 
      String(t.technology_id) !== id
    )
    .slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-b from-[#0f3a6d] to-[#153156] text-white py-12 md:py-20 px-4 md:px-8"
      >
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors mb-6 font-poppins font-semibold"
          >
            <ArrowLeft size={20} />
            Back
          </motion.button>

          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm font-poppins mb-8 text-gray-300"
          >
            <Link href="/" className="hover:text-white transition-colors">
              HOME
            </Link>
            <ChevronRight size={16} />
            <Link href="/technologies" className="hover:text-white transition-colors">
              TECHNOLOGIES
            </Link>
            <ChevronRight size={16} />
            <Link href="/technologies/browse_technologies" className="hover:text-white transition-colors">
              BROWSE
            </Link>
            <ChevronRight size={16} />
            <span>{sector}</span>
          </motion.div>

          {/* Header Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Featured Badge */}
              {isFeatured && (
                <div className="inline-flex items-center gap-2 bg-[#f97316] px-4 py-2 rounded-full mb-6 text-white font-semibold text-sm">
                  <Award size={16} />
                  TOP TECH
                </div>
              )}

              {/* Title */}
              <h1 className="font-helios text-4xl md:text-5xl font-bold leading-tight mb-6">
                {techName}
              </h1>

              {/* Institution */}
              <div className="flex items-center gap-3 mb-8 text-lg">
                <Building2 size={24} className="flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">From Institute</p>
                  <p className="font-semibold">{institution}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-white/20 rounded-full font-poppins text-sm backdrop-blur-sm">
                  {sector}
                </span>
                <span className={`px-4 py-2 rounded-full font-poppins text-sm font-semibold backdrop-blur-sm ${statusColor.bg} ${statusColor.text}`}>
                  {ipStatus}
                </span>
              </div>
            </motion.div>

            {/* Right: Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src={image}
                alt={techName}
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Content Section */}
      <div className="py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3 space-y-12"
            >
              {/* Problem Solved */}
              {problemSolved && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-[#eff9ff] to-[#daf1ff] rounded-2xl border-2 border-[#1872dd] p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <h2 className="font-helios text-2xl md:text-3xl font-bold text-[#1b60bb] mb-4">
                    Problem Solved
                  </h2>
                  <p className="font-poppins text-gray-700 leading-relaxed text-lg">
                    {problemSolved}
                  </p>
                </motion.div>
              )}

              {/* Description */}
              {description && (
                <div>
                  <h2 className="font-helios text-2xl md:text-3xl font-bold text-[#1b60bb] mb-4">
                    About This Technology
                  </h2>
                  <p className="font-poppins text-gray-700 leading-relaxed text-lg">
                    {description}
                  </p>
                </div>
              )}

              {/* Application Area */}
              {applications && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-white to-[#f0f9ff] rounded-2xl border-2 border-[#90daff] p-8 shadow-lg"
                >
                  <h2 className="font-helios text-2xl md:text-3xl font-bold text-[#1b60bb] mb-8">
                    Applications
                  </h2>
                  <div className="space-y-4">
                    {applications.split('\n').filter((line: string) => line.trim()).map((line: string, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + idx * 0.05 }}
                        className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
                      >
                        <span className="text-[#1872dd] font-bold text-xl flex-shrink-0">•</span>
                        <p className="font-poppins text-gray-700 leading-relaxed text-lg">
                          {line.trim().replace(/^[-•]\s*/, '')}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Sidebar: Tech Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl border border-gray-200 p-8 sticky top-32 shadow-lg">
                <h3 className="font-helios text-xl font-bold text-[#1b60bb] mb-8">Technology Info</h3>

                {/* Info Items */}
                <div className="space-y-6">
                  {/* Sector */}
                  <div>
                    <p className="text-xs font-poppins text-gray-500 mb-2 uppercase tracking-wider">
                      Sector
                    </p>
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-[#1b60bb]" />
                      <p className="font-poppins font-semibold text-gray-900">{sector}</p>
                    </div>
                  </div>

                  {/* Institution */}
                  <div>
                    <p className="text-xs font-poppins text-gray-500 mb-2 uppercase tracking-wider">
                      Institution
                    </p>
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-[#1b60bb]" />
                      <p className="font-poppins font-semibold text-gray-900 truncate">{institution}</p>
                    </div>
                  </div>

                  {/* IP Status */}
                  <div>
                    <p className="text-xs font-poppins text-gray-500 mb-2 uppercase tracking-wider">
                      IP Status
                    </p>
                    <div className={`px-4 py-3 rounded-lg font-semibold text-center ${statusColor.bg} ${statusColor.text}`}>
                      {ipStatus}
                    </div>
                  </div>

                  {/* Featured Badge */}
                  {isFeatured && (
                    <div className="px-4 py-3 rounded-lg bg-[#fff3e0] text-[#f97316] font-semibold text-center flex items-center justify-center gap-2">
                      <Award size={16} />
                      Featured Technology
                    </div>
                  )}
                </div>

                {/* EOI Section Premium Redesign - Government / Authoritative Style (Bigger & Highlighted) */}
                <div className="mt-10 border-t border-gray-200 pt-8">
                  <div className="bg-[#f8fafd] rounded-2xl border border-[#e1eaf4] p-8 md:p-10 relative overflow-hidden shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                    {/* Top blue accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#1b60bb]"></div>
                    
                    <div className="relative z-10">
                      <h4 className="font-helios text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-snug">
                        Interested in this Technology?
                      </h4>
                      
                      <p className="font-poppins text-sm text-gray-600 leading-relaxed mb-8">
                        Submit an Expression of Interest (EOI) through RINK to explore technology transfer, licensing, startup creation, and commercialization opportunities.
                      </p>
                      
                      <button
                        className="w-full bg-[#1b60bb] hover:bg-[#153156] group-hover:bg-[#153156] text-white py-4 px-6 rounded-xl font-helios font-bold text-base tracking-wide flex items-center justify-center gap-2 transition-all duration-300 shadow-md group-hover:shadow-lg"
                      >
                        Submit EOI
                        <ArrowUpRight size={18} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </button>
                      
                      <p className="text-gray-500 text-[11px] font-poppins mt-5 text-center flex items-center justify-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        Secure & confidential process
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Related Technologies Section */}
      {relatedTechnologies.length > 0 && (
        <div className="py-16 md:py-24 px-4 md:px-8 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Header with Sector and Count */}
              <div className="mb-12">
                <h2 className="font-helios text-3xl md:text-4xl font-bold text-[#1b60bb] mb-6">
                  Related Technologies in {sector}
                </h2>
              </div>

              {/* Institutions Horizontal Rack */}
              <div className="mb-12">
                <h3 className="font-poppins font-bold text-gray-600 text-sm mb-4 uppercase tracking-wider">
                  Featured Institutions
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {Array.from(
                    new Set(relatedTechnologies.map((t: any) => t['unnamed:_2']))
                  )
                    .slice(0, 6)
                    .map((inst: any, idx: number) => {
                      const count = relatedTechnologies.filter(
                        (t: any) => t['unnamed:_2'] === inst
                      ).length;
                      return (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.05 }}
                          className="bg-[#eff9ff] rounded-full px-5 py-2.5 border border-[#90daff] flex-shrink-0 hover:border-[#1872dd] transition-all"
                        >
                          <p className="font-poppins font-semibold text-[#1b60bb] text-sm whitespace-nowrap">
                            {inst?.split(' ').slice(0, 2).join(' ')} ({count})
                          </p>
                        </motion.div>
                      );
                    })}
                </div>
              </div>

              {/* Technologies Grid - Matches Browse Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
                {relatedTechnologies.slice(0, 8).map((tech: any, idx: number) => {
                  const status = tech.patent_status;
                  const ipStatusProp = (status === 'Patented' || status === 'Patent Filed' || status === 'Not Specified') ? status : 'Not Specified';
                  return (
                    <motion.div
                      key={tech.technology_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <PremiumTechnologyCard
                        id={String(tech.technology_id)}
                        name={tech.technology_name || 'Untitled Technology'}
                        image={tech.image_url || '/images/placeholder-tech.jpg'}
                        sector={tech.primary_sector || 'N/A'}
                        institution={tech.institution || 'N/A'}
                        ipStatus={ipStatusProp}
                        featured={tech.startup_potential === 'High'}
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* View All Button */}
              <div className="text-center">
                <Link
                  href={`/technologies/browse_technologies?sector=${encodeURIComponent(sector)}`}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1b60bb] hover:bg-[#153156] text-white rounded-2xl font-helios font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  View All {sector} Technologies
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-[#0f3a6d] to-[#153156] text-white text-center"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="font-helios text-3xl md:text-4xl font-bold mb-4">
            Want to Explore More Technologies?
          </h2>
          <p className="font-poppins text-lg text-gray-200 mb-8">
            Discover verified technologies from KSUM-backed institutions and find the perfect innovation for your startup or business.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/technologies/browse_technologies"
              className="px-8 py-3 bg-white text-[#1b60bb] rounded-lg hover:bg-gray-100 transition-colors font-poppins font-semibold"
            >
              Explore Technologies
            </Link>
            <Link
              href="/#contact"
              className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-poppins font-semibold"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
