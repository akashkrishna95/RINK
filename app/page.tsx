// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\page.tsx

import Navbar from '@/HomePage/Navbar';
import HeroSection from '@/HomePage/HeroSection';
import InstitutionsGrid from '@/HomePage/InstitutionsGrid';
import FeaturedTechnologies from '@/HomePage/FeaturedTechnologies';
import AboutRink from '@/HomePage/AboutRink';
import PartnerInstitutes from '@/HomePage/PartnerInstitutes';
import Footer from '@/HomePage/Footer';
import { getFeaturedTechnologies } from '@/lib/getFeaturedTechnologies';
import { getInstitutions } from '@/lib/getInstitutions';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const initialTechnologies = getFeaturedTechnologies();
  const institutions = await getInstitutions();

  return (
    <main style={{ backgroundColor: '#F4F7FB' }}>
      <Navbar />
      <HeroSection />
      <InstitutionsGrid initialInstitutions={institutions} />
      <FeaturedTechnologies initialTechnologies={initialTechnologies} />
      <AboutRink />
      <PartnerInstitutes initialInstitutions={institutions} />
      <Footer />
    </main>
  );
}
