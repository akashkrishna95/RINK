'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const cards = [
  {
    id: 1,
    title: 'Technologies',
    subtitle: 'License breakthrough IP',
    href: '#',
    bgColor: 'bg-[#aec1d9]',
    textColor: 'text-[#084f8b]',
    subtitleColor: 'text-[#0060b8]',
  },
  {
    id: 2,
    title: 'Instrumentation',
    subtitle: 'Access advanced core labs',
    href: '#',
    bgColor: 'bg-[#aec1d9]',
    textColor: 'text-[#084f8b]',
    subtitleColor: 'text-[#0060b8]',
  },
  {
    id: 3,
    title: 'Research Incubation Program',
    subtitle: 'Turn your research into startups',
    href: '#',
    bgColor: 'bg-[#084f8b]',
    textColor: 'text-[#aec1d9]',
    subtitleColor: 'text-[#aec1d9]',
  },
];

export default function ActionCardsGrid() {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Link href={card.href}>
              <motion.div
                className={`${card.bgColor} rounded-[20px] p-8 h-48 flex flex-col justify-between cursor-pointer group relative overflow-hidden`}
                whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)' }}
                transition={{ duration: 0.3 }}
              >
                {/* Card Content */}
                <div className="relative z-10">
                  <h3 className={`${card.textColor} font-helios font-black text-3xl md:text-4xl leading-tight mb-2`}>
                    {card.title}
                  </h3>
                  <p className={`${card.subtitleColor} font-gotham text-sm md:text-base font-medium`}>
                    {card.subtitle}
                  </p>
                </div>

                {/* Arrow Icon - Top Right */}
                <div className="absolute top-6 right-6 z-20">
                  <motion.div
                    initial={{ x: 0, y: 0 }}
                    whileHover={{ x: 4, y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowUpRight className={`${card.textColor} w-8 h-8`} strokeWidth={2.5} />
                  </motion.div>
                </div>

                {/* Hover Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/10 transition-all duration-300 z-0"></div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
