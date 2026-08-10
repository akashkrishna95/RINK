// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\lib\pocketbase.ts

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

let pbInstance: any = null;

export function getPocketBase() {
  if (typeof window === 'undefined') return null;
  
  const PocketBaseClass = (window as any).PocketBase;
  if (!PocketBaseClass) return null;
  
  if (!pbInstance) {
    pbInstance = new PocketBaseClass(pbUrl);
    pbInstance.autoCancellation(false);
  }
  return pbInstance;
}

export interface Institution {
  id: string | number;
  name: string;
  location: string;
  district: string;
  website: string;
  logo_url: string;
  partnered: boolean;
  lat: number;
  lng: number;
  techCount: number;
}

export function mapPbInstitution(record: any, index?: number): Institution {
  const name = record.institution || record.name || 'Untitled Institution';
  const location = record.location || '';
  const district = record.district || '';
  const website = record.website || '';
  const rawLogoUrl = record.institution_logo_url || record.logo_url || '';
  
  const getDirectDriveUrl = (url: string): string => {
    if (!url) return '';
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
    const queryMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (queryMatch && queryMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${queryMatch[1]}`;
    }
    return url;
  };
  
  const logo_url = getDirectDriveUrl(rawLogoUrl);
  
  const rawPartnered = record.partnered_institutions || record.partnered || '';
  const partnered = 
    typeof rawPartnered === 'boolean' 
      ? rawPartnered 
      : String(rawPartnered).trim().toLowerCase() === 'partnered' || String(rawPartnered).trim().toLowerCase() === 'true';
      
  const lat = parseFloat(record.latitude || record.lat || '10.5');
  const lng = parseFloat(record.longitude || record.lng || '76.3');
  const techCount = parseInt(record.tech_count || record.techCount || '0', 10);
  
  return {
    id: record.id || (index !== undefined ? String(index + 1) : String(Math.random())),
    name,
    location,
    district,
    website,
    logo_url,
    partnered,
    lat,
    lng,
    techCount
  };
}

const VIDEO_TITLES: Record<string, string> = {
  '4_4w6dkO1ik': 'ICAR-SUGARCANE BREEDING INSTITUTE KANNUR',
  'bY5FVptw0uI': 'MG UNIVERSITY',
  'uJnU7nZgzs8': 'Centre for Materials for Electronics Technology, CMET',
  'U0kmZCbR3nA': 'National Institute For Interdisciplinary Science and Technology, NIIST',
  'a3hbMuF5zl4': 'Central Plantation Crops Research Institute (CPCRI)',
  '5jrxaZ5w7e0': 'CENTRAL TUBER CROPS RESEARCH INSTITUTE (CTCRI)',
  'NojFCP84yls': 'KERALA UNIVERSITY OF FISHERIES & OCEAN STUDIES (KUFOS)',
  'IF-XZPllRFU': 'Centre for Development of Advanced Computing (C-DAC)',
  '8LDcim7TwwI': 'National Technology Day Special Demo Day'
};

function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const match = url.trim().match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export function mapPbDemoDay(record: any, index: number) {
  const youtubeLink = record.youtube_link || record.url || record.link || '';
  const id = extractYoutubeId(youtubeLink);
  if (!id) return null;
  const title = record.title || record.institution || record.name || VIDEO_TITLES[id] || `Demo Day Showcase ${index + 1}`;
  return { id, title, pbId: record.id };
}

function formatDriveImageUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  const driveMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }
  return trimmed;
}

export function mapPbStartup(record: any) {
  const name = record.startup_name || record.name || '';
  const logoUrl = record.startup_logo_url || record.logo_url || record.logo || '';
  return {
    pbId: record.id,
    name: name.trim(),
    logoUrl: formatDriveImageUrl(logoUrl)
  };
}

export interface SheetProgram {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  poster_link: string;
  registration_link: string;
  location: string;
  status: 'upcoming' | 'current' | 'past';
  event_gallery: string;
}

export function mapPbProgram(record: any, index: number): SheetProgram {
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
    id: record.id || `program-${index}-${programName.replace(/\s+/g, '-').toLowerCase().slice(0, 30)}`,
    title: programName,
    date: record.date ?? '',
    time: record.time ?? '',
    description: record.description ?? '',
    poster_link: formatDriveImageUrl(record.poster_link ?? ''),
    registration_link: record.registration_link ?? '',
    location: record.location ?? '',
    status,
    event_gallery: programGallery.trim(),
  };
}

export function mapPbPastVisitedInstitution(record: any) {
  const name = record.institution || record.name || '';
  const logoUrl = record.institution_logo_url || record.logo_url || record.logo || '';
  return {
    pbId: record.id,
    name: name.trim(),
    logoUrl: formatDriveImageUrl(logoUrl),
  };
}
