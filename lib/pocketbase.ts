//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\lib\pocketbase.ts

import PocketBase from 'pocketbase';

const rawPbUrl = (process.env.NEXT_PUBLIC_POCKETBASE_URL || process.env.POCKETBASE_URL || 'http://127.0.0.1:8090').trim();
// Remove trailing slash if present for clean URL concatenations
export const POCKETBASE_URL = rawPbUrl.replace(/\/+$/, '');

export const pb = new PocketBase(POCKETBASE_URL);

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

// Helper to resolve media URLs whether they are Google Drive links, full HTTP links, or native PocketBase file uploads
export function getMediaUrl(record: any, fieldOrUrl: string | undefined | null): string {
  if (!fieldOrUrl) return '';
  const val = String(fieldOrUrl).trim();
  if (!val) return '';

  // If it's already an absolute HTTP/HTTPS URL or Google Drive link
  if (val.startsWith('http://') || val.startsWith('https://')) {
    return formatDriveImageUrl(val);
  }

  // If it's a relative PocketBase file name stored in a record (e.g., 'image_abc.png')
  if (record && (record.collectionId || record.collectionName) && record.id) {
    const col = record.collectionId || record.collectionName;
    return `${POCKETBASE_URL}/api/files/${col}/${record.id}/${val}`;
  }

  return val;
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
  if (!record) return {} as Institution;
  const name = (record.institution || record.institution_name || record.name || record.title || 'Untitled Institution').trim();
  const location = (record.location || record.address || '').trim();
  const district = (record.district || record.standardized_district || '').trim();
  const website = (record.website || record.url || record.link || '').trim();
  const logoRaw = record.institution_logo_url || record.logo_url || record.logo || record.image || '';
  const logoUrl = getMediaUrl(record, logoRaw);
  const rawPartnered = record.partnered_institutions ?? record.partnered ?? record.is_partnered ?? record.isPartnered ?? '';
  const isPartnered = 
    typeof rawPartnered === 'boolean' 
      ? rawPartnered 
      : ['partnered', 'true', '1', 'yes'].includes(String(rawPartnered).trim().toLowerCase());
  const lat = parseFloat(record.latitude || record.lat || '10.5');
  const lng = parseFloat(record.longitude || record.lng || '76.3');
  const techCount = parseInt(record.tech_count || record.techCount || record.technologies_count || '0', 10);

  return {
    id: record.id,
    name,
    location,
    district,
    website,
    logoUrl,
    isPartnered,
    lat: isNaN(lat) ? 10.5 : lat,
    lng: isNaN(lng) ? 76.3 : lng,
    techCount: isNaN(techCount) ? 0 : techCount
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
  if (!record) return null;
  const youtubeLink = record.youtube_link || record.youtube_url || record.url || record.link || record.video_url || '';
  const youtubeId = extractYoutubeId(youtubeLink);
  if (!youtubeId) return null;
  const title = (record.title || record.institution || record.institution_name || record.name || `Demo Day Showcase ${(index ?? 0) + 1}`).trim();
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

export const mapPbFund = (record: any): Fund => {
  if (!record) return {} as Fund;
  const posterRaw = record.poster_link || record.poster || record.image || record.poster_url || '';
  return {
    id: record.id,
    title: (record.fund_name || record.title || record.grant_name || record.name || '').trim(), 
    description: record.description || record.details || record.about || '',
    posterLink: getMediaUrl(record, posterRaw),
    lastDate: record.last_date || record.lastDate || record.deadline || record.date || record.end_date || '',
    registrationLink: (record.registration_link || record.registration_url || record.apply_link || record.link || record.url || '').trim(),
  };
};

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
  if (!record) return {} as Program;
  const rawStatus = (record.status ?? '').toLowerCase().trim();
  let status: 'upcoming' | 'current' | 'past' = 'upcoming';
  if (rawStatus.includes('current') || rawStatus.includes('ongoing') || rawStatus.includes('live')) {
    status = 'current';
  } else if (rawStatus.includes('past') || rawStatus.includes('completed') || rawStatus.includes('closed')) {
    status = 'past';
  } else if (rawStatus.includes('upcoming') || rawStatus.includes('open')) {
    status = 'upcoming';
  }

  const programName = (record.program_name || record.program || record.event_name || record.title || record.name || '').trim();
  const programGallery = (record.view_gallery || record.program_gallery || record.event_gallery || record.gallery || record.gallery_link || record.eventGallery || '').trim();
  const posterRaw = record.poster_link || record.poster || record.image || record.poster_url || record.posterLink || '';

  return {
    id: record.id,
    title: programName,
    date: record.date || record.program_date || record.event_date || '',
    time: record.time || record.program_time || record.event_time || '',
    description: record.description || record.details || record.about || '',
    posterLink: getMediaUrl(record, posterRaw),
    registrationLink: (record.registration_link || record.registration_url || record.apply_link || record.link || record.registrationLink || '').trim(),
    location: (record.location || record.venue || record.place || '').trim(),
    status,
    eventGallery: programGallery,
  };
}

export interface Startup {
  id: string;
  name: string;
  logoUrl: string;
}

export function mapPbStartup(record: any): Startup {
  if (!record) return {} as Startup;
  const logoRaw = record.startup_logo_url || record.logo_url || record.logo || record.image || '';
  return {
    id: record.id,
    name: (record.startup_name || record.name || record.title || '').trim(),
    logoUrl: getMediaUrl(record, logoRaw)
  };
}

export interface PastVisitedInstitution {
  id: string;
  name: string;
  logoUrl: string;
}

export function mapPbPastVisitedInstitution(record: any): PastVisitedInstitution {
  if (!record) return {} as PastVisitedInstitution;
  const logoRaw = record.institution_logo_url || record.logo_url || record.logo || record.image || '';
  return {
    id: record.id,
    name: (record.institution || record.institution_name || record.name || record.title || '').trim(),
    logoUrl: getMediaUrl(record, logoRaw)
  };
}

