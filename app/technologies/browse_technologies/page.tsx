import type { Metadata } from 'next';
import { Suspense } from 'react';
import TechnologiesNavbar from '@/components/technologies/TechnologiesNavbar';
import BrowseTechnologies from '@/components/technologies/BrowseTechnologies';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Browse Technologies - RINK | Advanced Search & Filters',
  description:
    'Advanced search and filtering for RINK verified technologies. Find the perfect technology for your startup with filters and grid/list views.',
};

// Cache the page for 1 hour and regenerate in background
export const revalidate = 3600;

export default function BrowseTechnologiesPage() {
  return (
    <main style={{ 
      backgroundColor: '#bde7ff',
      minHeight: '100vh'
    }}>
      <TechnologiesNavbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-helios text-[#1b60bb]">Loading...</div>}>
        <BrowseTechnologies />
      </Suspense>
      <Footer />
    </main>
  );
}
