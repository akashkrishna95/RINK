//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\about\researchpreneurship\page.tsx
import ResearchIncubationProgramsClient from '@/HomePage/AboutRink/ResearchIncubationPrograms';
import { pb, mapPbStartup } from '@/lib/pocketbase';

export const dynamic = 'force-dynamic';

async function getStartups() {
  try {
    const records = await pb.collection('startups').getFullList({
      requestKey: null,
    });
    return records.map(mapPbStartup);
  } catch (error) {
    console.error('Failed to fetch startups from PocketBase:', error);
    return [];
  }
}

export default async function Page() {
  const initialStartups = await getStartups();
  return <ResearchIncubationProgramsClient initialStartups={initialStartups} />;
}
