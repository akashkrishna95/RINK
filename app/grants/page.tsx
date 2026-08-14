import { Metadata } from 'next';
import { headers } from 'next/headers';
import { pb, mapPbGrant } from '@/lib/pocketbase';
import GrantsClient from './GrantsClient';

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
      const record = await pb.collection('grants').getOne(id);
      const title = record.grant_name || record.title || 'Grant Opportunity';
      const description = record.description 
        ? record.description.replace(/[#*_\n]/g, ' ').slice(0, 150) + '...'
        : 'Explore this grant opportunity on RINK KSUM.';
      const posterLink = record.poster_link || '';
      
      const driveMatch = posterLink.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || 
                         posterLink.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                         posterLink.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                         posterLink.match(/[?&]docid=([a-zA-Z0-9_-]+)/);
      const imageUrl = driveMatch && driveMatch[1]
        ? `https://lh3.googleusercontent.com/d/${driveMatch[1]}`
        : (posterLink || defaultLogo);

      return {
        title: `${title} | RINK Grants`,
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
      console.error('Error generating metadata for grant:', e);
    }
  }

  // Fallback default meta
  return {
    title: 'RINK Grants - Research Innovation Network Kerala',
    description: 'Research Innovation Network Kerala (RINK) is an initiative of Kerala Startup Mission (KSUM) that builds a bridge between research institutions and the startup ecosystem.',
    openGraph: {
      title: 'RINK Grants - Research Innovation Network Kerala',
      description: 'Research Innovation Network Kerala (RINK) is an initiative of Kerala Startup Mission (KSUM) that builds a bridge between research institutions and the startup ecosystem.',
      images: [defaultLogo],
    }
  };
}

async function getGrants() {
  try {
    const records = await pb.collection('grants').getFullList({
      cache: 'no-store'
    });
    return records.map(mapPbGrant);
  } catch (error) {
    console.error('Failed to fetch grants from PocketBase:', error);
    return [];
  }
}

export default async function GrantsPage() {
  const initialGrants = await getGrants();
  return <GrantsClient initialGrants={initialGrants} />;
}
