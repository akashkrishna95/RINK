import type { Metadata } from 'next';
import TechnologiesNavbar from '@/components/technologies/TechnologiesNavbar';
import TechnologiesHero from '@/components/technologies/TechnologiesHero';
import FeaturedTechnologies from '@/components/technologies/FeaturedTechnologies';
import { getFeaturedTechnologies } from '@/lib/getFeaturedTechnologies';
import BrowseInstitutions from '@/components/technologies/BrowseInstitutions';
import BrowseSectors from '@/components/technologies/BrowseSectors';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Technologies - RINK | Browse Research Technologies',
  description:
    'Discover breakthrough research technologies from India\'s top institutions. License innovation and scale your startup with market-ready IP.',
};

export default function TechnologiesPage() {
  return (
    <main style={{ backgroundColor: '#F4F7FB' }}>
      <TechnologiesNavbar />
      <TechnologiesHero />
      <FeaturedTechnologies initialTechnologies={getFeaturedTechnologies()} />

      {/* Modern, Premium Browse by Institution Section */}
      <BrowseInstitutions />

      {/* Modern, Premium Browse by Sector Section */}
      <BrowseSectors />

      <Footer />
    </main>
  );
}
