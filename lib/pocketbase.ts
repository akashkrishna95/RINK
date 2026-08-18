//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\lib\pocketbase.ts

import PocketBase from 'pocketbase';

export const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

// Disable auto cancellation to prevent concurrent request conflicts
pb.autoCancellation(false);

// Helper to format Google Drive URLs to direct links
export function formatDriveImageUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  const driveMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || 
                     trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                     trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                     trimmed.match(/[?&]docid=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }
  return trimmed;
}

export interface Institution {
  id: string;
  name: string;
  location: string;
  district: string;
  website: string;
  logoUrl: string;
  isPartnered: boolean;
  lat: number;
  lng: number;
  techCount: number;
}

export function mapPbInstitution(record: any): Institution {
  const name = record.institution || record.name || 'Untitled Institution';
  const location = record.location || '';
  const district = record.district || '';
  const website = record.website || '';
  const logoUrl = formatDriveImageUrl(record.institution_logo_url || record.logo_url || '');
  const rawPartnered = record.partnered_institutions || record.partnered || '';
  const isPartnered = 
    typeof rawPartnered === 'boolean' 
      ? rawPartnered 
      : String(rawPartnered).trim().toLowerCase() === 'partnered' || String(rawPartnered).trim().toLowerCase() === 'true';
  const lat = parseFloat(record.latitude || record.lat || '10.5');
  const lng = parseFloat(record.longitude || record.lng || '76.3');
  const techCount = parseInt(record.tech_count || record.techCount || '0', 10);

  return {
    id: record.id,
    name,
    location,
    district,
    website,
    logoUrl,
    isPartnered,
    lat,
    lng,
    techCount
  };
}

export interface DemoDayVideo {
  id: string;       // PocketBase record ID (string)
  youtubeId: string; // YouTube video ID (string)
  title: string;
}

function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const match = url.trim().match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export function mapPbDemoDay(record: any, index?: number): DemoDayVideo | null {
  const youtubeLink = record.youtube_link || record.url || record.link || '';
  const youtubeId = extractYoutubeId(youtubeLink);
  if (!youtubeId) return null;
  const title = record.title || record.institution || record.name || `Demo Day Showcase ${(index ?? 0) + 1}`;
  return {
    id: record.id,
    youtubeId,
    title
  };
}

export interface Fund {
  id: string;
  title: string;
  lastDate: string;
  description: string;
  posterLink: string;
  registrationLink: string;
}

export const mapPbFund = (record: any): Fund => ({
  id: record.id,
  // Changed grant_name to fund_name here to match your database change
  title: record.fund_name || record.title || '', 
  description: record.description || '',
  posterLink: record.poster_link || '',
  lastDate: record.last_date || '',
  registrationLink: record.registration_link || '',
});

export interface Program {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  posterLink: string;
  registrationLink: string;
  location: string;
  status: 'upcoming' | 'current' | 'past';
  eventGallery: string;
}

export function mapPbProgram(record: any): Program {
  const rawStatus = (record.status ?? '').toLowerCase().trim();
  let status: 'upcoming' | 'current' | 'past' = 'upcoming';
  if (rawStatus.includes('current')) {
    status = 'current';
  } else if (rawStatus.includes('past')) {
    status = 'past';
  } else if (rawStatus.includes('upcoming')) {
    status = 'upcoming';
  }

  const programName = record.program_name || record.program || record.event_name || record.title || '';
  const programGallery = record.view_gallery || record.program_gallery || record.event_gallery || '';

  return {
    id: record.id,
    title: programName,
    date: record.date ?? '',
    time: record.time ?? '',
    description: record.description ?? '',
    posterLink: formatDriveImageUrl(record.poster_link ?? ''),
    registrationLink: record.registration_link ?? '',
    location: record.location ?? '',
    status,
    eventGallery: programGallery.trim(),
  };
}

export interface Startup {
  id: string;
  name: string;
  logoUrl: string;
}

export function mapPbStartup(record: any): Startup {
  return {
    id: record.id,
    name: (record.startup_name || record.name || '').trim(),
    logoUrl: formatDriveImageUrl(record.startup_logo_url || record.logo_url || record.logo || '')
  };
}

export interface PastVisitedInstitution {
  id: string;
  name: string;
  logoUrl: string;
}

export function mapPbPastVisitedInstitution(record: any): PastVisitedInstitution {
  return {
    id: record.id,
    name: (record.institution || record.name || '').trim(),
    logoUrl: formatDriveImageUrl(record.institution_logo_url || record.logo_url || record.logo || '')
  };
}
