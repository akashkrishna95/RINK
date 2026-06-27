'use client';

import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import InstitutionsGrid from '@/components/InstitutionsGrid';
import FeaturedTechnologies from '@/components/FeaturedTechnologies';
import AboutRink from '@/components/AboutRink';
import PartnerInstitutes from '@/components/PartnerInstitutes';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <main style={{ backgroundColor: '#F4F7FB' }}>
      <Navbar />
      <HeroSection />
      <InstitutionsGrid />
      <FeaturedTechnologies />
      <AboutRink />
      <PartnerInstitutes />
      <Footer />
    </main>
  );
}
