'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, Tag, Award, MapPin, ChevronRight, ArrowUpRight, X, Lightbulb, ArrowRight, FileText, CircleCheckBig } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import TechnologyCard from './TechnologyCard';
import { normalizeIPStatus, isFeaturedTechnology, formatTechnologyName } from '@/lib/utils';

interface TechnologyDetailsProps {
  id: string;
}

export default function TechnologyDetails({ id }: TechnologyDetailsProps) {
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
      <div className="flex items-center justify-center min-h-screen bg-[#F4F7FB]">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-[#1b60bb]/30 border-t-[#1b60bb] rounded-full" />
        </div>
      </div>
    );
  }

  if (!technology) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12 bg-[#F4F7FB]">
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
  const techName = formatTechnologyName(technology.technology_name || 'Untitled Technology');
  const institution = technology.institution || 'N/A';
  const sector = technology.primary_sector || technology.sector || 'N/A';
  const problemSolved = technology.problem_solved || '';
  const description = technology.description || '';
  const applications = technology.applications || '';
  const ipStatus = technology.patent_status || 'Not Specified';
  const trl = technology.trl || 'Not Specified';
  const image = technology.image_url || '/placeholder.jpg';
  const isFeatured = isFeaturedTechnology(technology.startup_potential);

  const getIPStatusColor = (status: string) => {
    switch (status) {
      case 'Patented':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'bg-emerald-500' };
      case 'Patent Filed':
        return { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: 'bg-blue-500' };
      case 'Not Specified':
      case 'Patent Status Not Available':
        return { bg: 'bg-red-50 text-red-700 border-red-200', icon: 'bg-red-500' };
      default:
        return { bg: 'bg-gray-50 text-gray-700 border-gray-200', icon: 'bg-gray-500' };
    }
  };

  const statusColor = getIPStatusColor(ipStatus);

  // Get related technologies from same sector (limit to 4)
  const relatedTechnologies = allTechnologies
    .filter((t: any) =>
      (t.primary_sector || t.sector) === sector &&
      String(t.technology_id) !== id
    );

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-gray-900">

      {/* Header Section (White Background to match reference) */}
      <section className="border-b border-gray-200 bg-white py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 flex-wrap mb-8 font-poppins">
            <Link href="/" className="hover:text-[#1b60bb] transition-colors">
              Home
            </Link>
            <ChevronRight size={12} className="text-gray-300" />
            <Link href="/technologies" className="hover:text-[#1b60bb] transition-colors">
              Technologies
            </Link>
            <ChevronRight size={12} className="text-gray-300" />
            <Link href={`/technologies/browse_technologies?sector=${encodeURIComponent(sector)}`} className="hover:text-[#1b60bb] transition-colors">
              {sector}
            </Link>
            <ChevronRight size={12} className="text-gray-300" />
            <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-sm">
              {techName}
            </span>
          </nav>

          {/* Grid Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Left Side: Info */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap gap-2">
                <span className="bg-gray-50 border border-gray-200 text-gray-700 rounded-sm text-xs px-3 py-1 font-poppins font-semibold">
                  {sector}
                </span>
                {isFeatured && (
                  <span className="bg-[#fff3e0] border border-[#ffe0b2] text-[#f97316] rounded-sm text-xs px-3 py-1 font-poppins font-semibold">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="font-helios text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f3a6d] leading-tight">
                {techName}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm font-poppins">
                <span className="font-bold text-[#1b60bb]">{institution}</span>
                <span className="text-gray-300">|</span>
                <span className="font-mono text-gray-500">ID: {techId}</span>
              </div>


            </div>

            {/* Right Side: Image Aspect-[16/9] */}
            <div>
              <div className="rounded-xl overflow-hidden border border-gray-200 shadow-md aspect-[16/9] w-full relative bg-gray-50 flex items-center justify-center">
                {technology.image_url && technology.image_url.trim() !== '' ? (
                  <Image
                    src={technology.image_url.startsWith('http') ? `/api/image-proxy?url=${encodeURIComponent(technology.image_url)}` : technology.image_url}
                    alt={techName}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <Building2 className="w-10 h-10 text-gray-300 mb-2" />
                    <p className="font-poppins text-xs text-gray-400 font-semibold">Image not uploaded yet</p>
                  </div>
                )}

                {/* Slanted Clip Path Badge */}
                <div
                  className="absolute top-0 left-0 bg-[#1b60bb] text-white px-5 py-2 text-[10px] sm:text-xs font-helios font-bold z-10 shadow-sm"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)' }}
                >
                  {techId}
                </div>

                {/* TOP TECH Ribbon overlay */}
                {isFeatured && (
                  <div
                    className="absolute top-0 right-4 bg-[#f97316] shadow-md z-30 flex flex-col items-center pt-2 pb-4 px-2.5"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)' }}
                  >
                    <CircleCheckBig size={16} className="text-white mb-0.5" strokeWidth={2.5} />
                    <span className="text-white font-bold text-[9px] sm:text-[10px] text-center leading-[1.1] tracking-wider mt-0.5">
                      TOP<br />TECH
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Details Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* Left Column: Details Content (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">

              {/* Problem Being Solved Banner */}
              {problemSolved && (
                <div className="relative rounded-xl overflow-hidden">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/30 via-indigo-500/20 to-cyan-500/20 p-px">
                    <div className="h-full w-full rounded-xl bg-blue-50/5"></div>
                  </div>
                  <div className="absolute -inset-1 bg-blue-500/5 blur-2xl rounded-2xl"></div>

                  <div className="relative rounded-xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-indigo-50/40 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#1b60bb]/10 flex items-center justify-center border border-[#1b60bb]/20">
                        <Lightbulb className="w-5 h-5 text-[#1b60bb]" />
                      </div>
                      <h2 className="font-helios text-lg font-bold text-[#0f3a6d] tracking-tight">
                        Problem Being Solved
                      </h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed font-poppins text-[15px]">
                      {problemSolved}
                    </p>
                  </div>
                </div>
              )}

              {/* Technology Description */}
              {description && (
                <div className="space-y-3">
                  <h2 className="font-helios text-xl font-bold text-[#0f3a6d]">
                    Technology Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed font-poppins whitespace-pre-line text-[15px]">
                    {description}
                  </p>
                </div>
              )}

              {/* Applications & Industrial Potential */}
              {applications && (
                <div className="space-y-3">
                  <h2 className="font-helios text-xl font-bold text-[#0f3a6d]">
                    Applications & Industrial Potential
                  </h2>
                  <ul className="space-y-2.5">
                    {applications.split('\n').filter((line: string) => line.trim()).map((line: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700 font-poppins text-[15px]">
                        <span className="mt-2.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#1b60bb]"></span>
                        <span>{line.trim().replace(/^[-•]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

            {/* Right Column: Sticky Sidebar Info Card (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-4">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

                  {/* Technology Readiness Level */}
                  <div className="p-5 border-b border-gray-100">
                    <div className="text-[11px] font-helios font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Technology Readiness Level
                    </div>
                    <div className="text-sm text-gray-500 font-poppins italic">
                      {trl !== 'Not Specified' && trl !== '' ? `TRL: ${trl}` : 'Will be updated soon'}
                    </div>
                  </div>

                  {/* IP Status */}
                  <div className="p-5 border-b border-gray-100">
                    <div className="text-[11px] font-helios font-bold text-gray-400 uppercase tracking-wider mb-2">
                      IP / Patent Status
                    </div>
                    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-md border ${statusColor.bg}`}>
                      {ipStatus}
                    </span>
                  </div>

                  {/* Partner Institution */}
                  <div className="p-5 border-b border-gray-100">
                    <div className="text-[11px] font-helios font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Institution
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#1b60bb] font-poppins">
                      <Building2 size={16} className="text-gray-400 flex-shrink-0" />
                      <span>{institution}</span>
                    </div>
                  </div>

                  {/* EOI Section (Preserving existing premium EOI design) */}
                  <div className="p-6 bg-[#f8fafd] relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#1b60bb]"></div>
                    <h4 className="font-helios text-lg font-bold text-gray-900 mb-2 leading-snug">
                      Interested in this Technology?
                    </h4>
                    <p className="font-poppins text-xs text-gray-600 leading-relaxed mb-4">
                      Submit an Expression of Interest (EOI) through RINK to explore technology transfer, licensing, startup creation, and commercialization opportunities.
                    </p>
                    <button
                      className="w-full bg-[#1b60bb] hover:bg-[#153156] text-white py-3 px-4 rounded-xl font-helios font-bold text-sm tracking-wide flex items-center justify-center gap-1.5 transition-all duration-300 shadow-sm"
                    >
                      Submit EOI
                      <ArrowUpRight size={16} strokeWidth={2.5} />
                    </button>
                    <p className="text-gray-500 text-[10px] font-poppins mt-3 text-center flex items-center justify-center gap-1.5">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      Secure & confidential process
                    </p>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Related Technologies Section */}
      {relatedTechnologies.length > 0 && (
        <section className="border-t border-gray-200 bg-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-poppins">
                  More from {sector}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-helios">
                  Related Technologies
                </h2>
              </div>
              <Link
                href={`/technologies/browse_technologies?sector=${encodeURIComponent(sector)}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#1b60bb] hover:underline font-poppins"
              >
                View all
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedTechnologies.slice(0, 4).map((tech: any, idx: number) => {
                return (
                  <TechnologyCard
                    key={tech.technology_id}
                    id={String(tech.technology_id)}
                    name={tech.technology_name || 'Untitled Technology'}
                    image={tech.image_url || '/placeholder.jpg'}
                    sector={tech.primary_sector || tech.sector || 'N/A'}
                    institution={tech.institution || 'N/A'}
                    ipStatus={normalizeIPStatus(tech.patent_status)}
                    featured={isFeaturedTechnology(tech.startup_potential)}
                    description={tech.description || tech.brief_description_abstract || tech.problem_solved || ''}
                  />
                );
              })}
            </div>

          </div>
        </section>
      )}

    </div>
  );
}
