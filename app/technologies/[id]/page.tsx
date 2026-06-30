import type { Metadata } from 'next';
import TechnologiesNavbar from '@/components/technologies/TechnologiesNavbar';
import TechnologyDetails from '@/components/technologies/TechnologyDetails';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Technology Details - RINK | Discover Research Technologies',
  description: 'Explore detailed information about verified RINK technologies from KSUM-backed institutions.',
};

export default async function TechnologyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main>
      <TechnologiesNavbar />
      <TechnologyDetails id={id} />
      <Footer />
    </main>
  );
}
