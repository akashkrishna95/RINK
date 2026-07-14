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

export const revalidate = 3600; // Cache for 1 hour

export default async function Page() {
  const initialTechnologies = getFeaturedTechnologies();
  const institutions = await getInstitutions();

  const partneredInstitutes = institutions
    .filter(inst => inst.partnered)
    .map(inst => ({
      id: String(inst.id),
      name: inst.name,
      logoUrl: inst.logo_url
    }));

  return (
    <main style={{ backgroundColor: '#F4F7FB' }}>
      <Navbar />
      <HeroSection />
      <InstitutionsGrid initialInstitutions={institutions} />
      <FeaturedTechnologies initialTechnologies={initialTechnologies} />
      <AboutRink />
      <PartnerInstitutes initialInstitutes={partneredInstitutes} />
      <Footer />
    </main>
  );
}
