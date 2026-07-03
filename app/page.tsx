import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import InstitutionsGrid from '@/components/InstitutionsGrid';
import FeaturedTechnologies from '@/components/FeaturedTechnologies';
import AboutRink from '@/components/AboutRink';
import PartnerInstitutes from '@/components/PartnerInstitutes';
import Footer from '@/components/Footer';
import { getFeaturedTechnologies } from '@/lib/getFeaturedTechnologies';

export default function Page() {
  const initialTechnologies = getFeaturedTechnologies();

  return (
    <main style={{ backgroundColor: '#F4F7FB' }}>
      <Navbar />
      <HeroSection />
      <InstitutionsGrid />
      <FeaturedTechnologies initialTechnologies={initialTechnologies} />
      <AboutRink />
      <PartnerInstitutes />
      <Footer />
    </main>
  );
}
