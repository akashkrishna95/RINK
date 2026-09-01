//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\about\demoday\page.tsx
import DemoDayExposureVisitsClient from '@/HomePage/AboutRink/DemoDayExposureVisits';
import { pb, mapPbDemoDay, mapPbPastVisitedInstitution } from '@/lib/pocketbase';

export const dynamic = 'force-dynamic';

async function getDemoDays() {
  try {
    const records = await pb.collection('demo_days').getFullList({
      requestKey: null,
    });
    return records.map((record, index) => mapPbDemoDay(record, index)).filter(Boolean);
  } catch (error) {
    console.error('Failed to fetch demo days from PocketBase:', error);
    return [];
  }
}

async function getPastVisitedInstitutions() {
  try {
    const records = await pb.collection('past_visited_institutions').getFullList({
      requestKey: null,
    });
    return records.map(mapPbPastVisitedInstitution);
  } catch (error) {
    console.error('Failed to fetch past visited institutions from PocketBase:', error);
    return [];
  }
}

export default async function Page() {
  const [initialVideos, initialPastVisitedInstitutions] = await Promise.all([
    getDemoDays(),
    getPastVisitedInstitutions()
  ]);

  return (
    <DemoDayExposureVisitsClient 
      initialVideos={initialVideos as any[]} 
      initialPastVisitedInstitutions={initialPastVisitedInstitutions} 
    />
  );
}
