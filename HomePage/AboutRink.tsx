//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\HomePage\AboutRink.tsx

'use client';

import { motion, Variants } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, TrendingUp, UsersRound, FileBadge, Coins } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutRink() {
  const featureCards = [
    { title: 'Research Incubation Programs', icon: TrendingUp, href: '/about/researchpreneurship' },
    { title: 'Demo Day & Exposure Visits', icon: UsersRound, href: '/about/demoday' },
    { title: 'IPR Support', icon: FileBadge, href: '/about/iprsupport' },
    { title: 'Research & Development Grant', icon: Coins, href: '/about/randd' },
  ];

  // Uniform arrow animation for all "View More" buttons
  const arrowAnimation: Variants = {
    initial: { x: 0, y: 0 },
    hover: { x: 3, y: -3, transition: { duration: 0.2, ease: "easeOut" } }
  };

  return (
    <div 
      className="relative w-full bg-[#eff9ff] py-20 overflow-hidden"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '650px',
      }}
    >

      {/* Main Content Wrapper (With Padding) */}
      <div className="relative max-w-7xl mx-auto px-8 z-10">

        {/* Top Section: Arrow on the left, Heading on the right */}
        <div className="flex justify-between items-center mb-8 lg:mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#1b60bb]"
          >
            <ArrowDownRight size={80} strokeWidth={2.5} className="w-12 h-12 md:w-20 md:h-20" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-helios font-medium text-4xl sm:text-5xl md:text-7xl text-[#1b60bb] text-right">
              About RINK
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start mt-2">

          {/* Left Column - Image (Now visible on ALL screens, stacks on top for mobile) */}
          <div className="relative w-full h-[260px] sm:h-[350px] lg:h-full lg:min-h-[450px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-full lg:h-[450px]"
            >
              <Image
                src="/images/rink-3d-logo.webp"
                alt="RINK 3D Logo"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-6 flex flex-col justify-center">

            {/* Description Container - Reduced whitespace and perfectly fit for PC */}
            {/* Description Container - Reduced whitespace and perfectly fit for PC */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="bg-white/95 backdrop-blur-sm rounded-[16px] p-4 lg:px-5 lg:py-4 shadow-sm border border-gray-100 w-full"
            >
              <p className="font-avenir text-gray-700 text-[14px] md:text-[15px] lg:text-[16px] leading-relaxed">
                An initiative of the Kerala Startup Mission, <span className="text-[#1b60bb] font-medium">RINK</span> bridges
                the gap between breakthrough lab research and commercial enterprise,
                empowering the research fraternity to{' '}
                <span className="text-[#1b60bb] font-medium">build and scale deep-tech ventures.</span>
              </p>

            </motion.div>

            {/* "What we do" Divider */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="flex items-center gap-4 pt-1"
            >
              <h3 className="font-helios font-medium text-2xl md:text-3xl lg:text-4xl text-[#1b60bb] whitespace-nowrap">
                What we do
              </h3>
              <div className="flex-grow border-t border-[#90daff] mt-2"></div>
            </motion.div>

            {/* Feature Cards Grid (2x2 Always) */}
            <div className="grid grid-cols-2 gap-3">
              {featureCards.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Link href={feature.href} key={index} className="group">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 + index * 0.05 }}
                      className="bg-[#5cc4fe]/95 backdrop-blur-sm rounded-[10px] p-3 md:p-4 flex flex-col justify-between min-h-[110px] md:min-h-[125px] shadow-sm group-hover:shadow-md transition-shadow h-full"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="text-[#153156] w-5 h-5 md:w-6 md:h-6 flex-shrink-0" strokeWidth={2} />
                        <h4 className="font-helios text-[#153156] font-normal text-[15px] md:text-[19px] lg:text-[20px] leading-[1.15] pr-1 tracking-tight">
                          {feature.title}
                        </h4>
                      </div>
                      <div className="flex justify-end mt-auto">
                        <motion.button
                          initial="initial"
                          whileHover="hover"
                          className="bg-white/90 text-[#1b60bb] px-2 py-1 md:px-2.5 md:py-1.5 rounded text-[9px] md:text-xs font-helios font-semibold hover:bg-white transition-colors flex items-center gap-1"
                        >
                          View More
                          <motion.div variants={arrowAnimation}>
                            <ArrowUpRight size={10} strokeWidth={2.5} className="md:w-3 md:h-3" />
                          </motion.div>
                        </motion.button>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Infinite Marquee - Full Width Edge-to-Edge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 w-full mt-16 py-5 overflow-hidden flex whitespace-nowrap"
      >
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 15, repeat: Infinity }}
          className="flex text-[#1b60bb] font-helios text-base md:text-lg font-medium tracking-widest uppercase w-max"
        >
          <span className="whitespace-pre">✦ KSUM ✦ RINK ✦ KSUM ✦ RINK ✦ KSUM ✦ RINK ✦ KSUM ✦ RINK ✦ KSUM ✦ RINK ✦ KSUM ✦ RINK ✦ KSUM ✦ RINK ✦ KSUM ✦ RINK</span>
          <span className="whitespace-pre">✦ KSUM ✦ RINK ✦ KSUM ✦ RINK ✦ KSUM ✦ RINK ✦ KSUM ✦ RINK ✦ KSUM ✦ RINK ✦ KSUM ✦ RINK ✦ KSUM ✦ RINK ✦ KSUM ✦ RINK</span>
          <span className="whitespace-pre">✦ KSUM ✦ RINK ✦ KSUM ✦ RINK ✦ KSUM ✦ RINK ✦ KSUM ✦ RINK ✦ KSUM ✦ RINK ✦ KSUM ✦ RINK ✦ KSUM ✦ RINK ✦ KSUM ✦ RINK</span>
        </motion.div>
      </motion.div>
    </div>
  );
}