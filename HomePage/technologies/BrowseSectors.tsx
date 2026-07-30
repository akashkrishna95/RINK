'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Utensils, Wheat, Dna, Zap, Activity, Droplets, Cpu, Building, Bot, Layers, ShoppingBag } from 'lucide-react';

const sectors = [
  {
    id: 'Food Technology',
    title: 'FOOD TECHNOLOGY',
    icon: Utensils,
    techCount: 89,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'Agriculture',
    title: 'AGRICULTURE',
    icon: Wheat,
    techCount: 58,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'Biotechnology & Life Sciences',
    title: 'BIOTECHNOLOGY & LIFE SCIENCES',
    icon: Dna,
    techCount: 28,
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'Energy, Climate & Sustainability',
    title: 'ENERGY, CLIMATE & SUSTAINABILITY',
    icon: Zap,
    techCount: 19,
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'MedTech & Health Care',
    title: 'MEDTECH & HEALTH CARE',
    icon: Activity,
    techCount: 18,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'Water, Environment & Waste Management',
    title: 'WATER, ENVIRONMENT & WASTE MANAGEMENT',
    icon: Droplets,
    techCount: 17,
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'Digital Technologies, AI & Software',
    title: 'DIGITAL TECHNOLOGIES, AI & SOFTWARE',
    icon: Cpu,
    techCount: 13,
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'Infrastructure, Construction & Smart Cities',
    title: 'INFRASTRUCTURE, CONSTRUCTION & SMART CITIES',
    icon: Building,
    techCount: 11,
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'Robotics, Automation & Drones',
    title: 'ROBOTICS, AUTOMATION & DRONES',
    icon: Bot,
    techCount: 9,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'Advanced Materials & Chemicals',
    title: 'ADVANCED MATERIALS & CHEMICALS',
    icon: Layers,
    techCount: 7,
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'Consumer & Lifestyle Products',
    title: 'CONSUMER & LIFESTYLE PRODUCTS',
    icon: ShoppingBag,
    techCount: 5,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800',
  }
];

export default function BrowseSectors() {
  return (
    <section id="sectors-section" className="py-20 md:py-32 px-4 md:px-8 bg-[#f4f7fb]">
      <div className="max-w-[1400px] mx-auto">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 md:mb-14"
        >
          <h3 className="font-helios text-[12px] md:text-[14px] font-bold text-[#1b60bb] uppercase tracking-[0.15em] mb-2 md:mb-3">
            Explore by Sector
          </h3>
          <h2 className="font-helios text-[28px] md:text-4xl lg:text-5xl font-black text-[#1b60bb] tracking-tight mb-4">
            Browse Technologies by Domain
          </h2>
          <p className="font-poppins text-sm md:text-[15px] text-gray-600 max-w-2xl leading-relaxed">
            Explore opportunities by industry domain and discover technologies ready for commercialization.
          </p>
        </motion.div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 lg:gap-6">
          {sectors.slice(0, 8).map((sector, index) => {
            const Icon = sector.icon;
            return (
              <motion.div
                key={sector.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
              >
                <Link href={`https://rink-ksum.vercel.app/technologies?sector=${encodeURIComponent(sector.id)}`}>
                  <div className="group relative w-full h-[260px] lg:h-[280px] rounded-[16px] md:rounded-[20px] overflow-hidden cursor-pointer shadow-sm hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-1">

                    {/* Background Image */}
                    <img
                      src={sector.image}
                      alt={sector.title}
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#021224] via-[#021224]/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Content Container (Bottom Aligned) */}
                    <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 flex flex-col justify-end">

                      {/* Glassmorphic Inner Panel */}
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 md:p-4 mb-3 md:mb-4 transform group-hover:-translate-y-1 transition-transform duration-500 w-full overflow-hidden">
                        {/* Title & Icon */}
                        <div className="flex flex-col xl:flex-row items-start gap-2 xl:gap-2.5 w-full">
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded-md bg-white/20 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" strokeWidth={2.5} />
                          </div>
                          <h4 className="font-helios text-[11px] sm:text-[13px] md:text-[14px] font-bold text-white tracking-wide leading-tight break-words min-w-0 w-full" style={{ wordBreak: 'break-word', hyphens: 'auto' }}>
                            {sector.title}
                          </h4>
                        </div>
                      </div>

                      {/* Bottom Meta row */}
                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-helios text-[13px] font-bold text-white/90">
                          {sector.techCount} technologies
                        </span>
                        <ArrowRight className="w-5 h-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                      </div>

                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 md:mt-12"
        >
          <Link href="/technologies/sectors">
            <button className="group flex items-center gap-2 font-helios text-[15px] font-bold text-[#1b60bb] hover:text-[#124282] transition-colors">
              Browse all 11 sectors
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
