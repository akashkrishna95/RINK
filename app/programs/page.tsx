import { Metadata } from 'next';
import { headers } from 'next/headers';
import { pb, mapPbProgram } from '@/lib/pocketbase';
import ProgramsClient from './ProgramsClient';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ id?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const id = resolvedSearchParams.id;
  const hostHeader = (await headers()).get('host') || 'rink.startupmission.in';
  const protocol = hostHeader.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${hostHeader}`;
  const defaultLogo = `${baseUrl}/images/rink-3d-logo.webp`;

  if (id) {
    try {
      const record = await pb.collection('programs').getOne(id);
      const title = record.program_name || record.program || record.event_name || record.title || 'Program';
      const description = record.description 
        ? record.description.replace(/[#*_\n]/g, ' ').slice(0, 150) + '...'
        : 'Explore this program on RINK KSUM.';
      const posterLink = record.poster_link || '';
      
      const driveMatch = posterLink.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || 
                         posterLink.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                         posterLink.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                         posterLink.match(/[?&]docid=([a-zA-Z0-9_-]+)/);
      const imageUrl = driveMatch && driveMatch[1]
        ? `https://lh3.googleusercontent.com/d/${driveMatch[1]}`
        : (posterLink || defaultLogo);

      return {
        title: `${title} | RINK Programs`,
        description,
        openGraph: {
          title,
          description,
          images: [imageUrl],
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [imageUrl],
        }
      };
    } catch (e) {
      console.error('Error generating metadata for program:', e);
    }
  }

  // Fallback default meta
  return {
    title: 'RINK Programs - Research Innovation Network Kerala',
    description: 'Research Innovation Network Kerala (RINK) is an initiative of Kerala Startup Mission (KSUM) that builds a bridge between research institutions and the startup ecosystem.',
    openGraph: {
      title: 'RINK Programs - Research Innovation Network Kerala',
      description: 'Research Innovation Network Kerala (RINK) is an initiative of Kerala Startup Mission (KSUM) that builds a bridge between research institutions and the startup ecosystem.',
      images: [defaultLogo],
    }
  };
}

async function getPrograms() {
  try {
    const records = await pb.collection('programs').getFullList({
      cache: 'no-store'
    });
    return records.map(mapPbProgram);
  } catch (error) {
    console.error('Failed to fetch programs from PocketBase:', error);
    return [];
  }
}

export default async function ProgramsPage() {
  const initialPrograms = await getPrograms();
  return <ProgramsClient initialPrograms={initialPrograms} />;
}
