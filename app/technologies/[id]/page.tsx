import type { Metadata } from 'next';
import TechnologiesNavbar from '@/HomePage/technologies/TechnologiesNavbar';
import TechnologyDetails from '@/HomePage/technologies/TechnologyDetails';
import Footer from '@/HomePage/Footer';

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
