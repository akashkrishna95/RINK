import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import InstitutionsGrid from '@/components/InstitutionsGrid';
import FeaturedTechnologies from '@/components/FeaturedTechnologies';
import AboutRink from '@/components/AboutRink';
import PartnerInstitutes from '@/components/PartnerInstitutes';
import Footer from '@/components/Footer';
import { getFeaturedTechnologies } from '@/lib/getFeaturedTechnologies';
import { getInstitutions } from '@/lib/getInstitutions';

export const dynamic = 'force-dynamic';

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
