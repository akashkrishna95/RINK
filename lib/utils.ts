//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\lib\utils.ts

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeIPStatus(status: string | undefined | null): 'Patented' | 'Patent Filed' | 'Not Specified' {
  if (!status) return 'Not Specified';
  const s = status.toUpperCase();
  if (s.includes('GRANTED') || s === 'PATENTED') {
    return 'Patented';
  }
  if (s.includes('PUBLISHED') || s.includes('FILED') || s === 'PATENT FILED' || s === 'REGISTRATION FILED') {
    return 'Patent Filed';
  }
  return 'Not Specified';
}
export function isFeaturedTechnology(status: string | undefined | null): boolean {
  if (!status) return false;
  return status.toUpperCase().includes('HIGH');
}

export function formatTechnologyName(name: string | undefined | null): string {
  if (!name) return 'Untitled Technology';
  
  const lettersOnly = name.replace(/[^a-zA-Z]/g, '');
  const isAllCaps = lettersOnly.length > 0 && lettersOnly === lettersOnly.toUpperCase();
  
  if (isAllCaps) {
    return name
      .toLowerCase()
      .replace(/\b[a-z]/g, (char) => char.toUpperCase());
  }
  
  return name;
}

export function getProxiedImageUrl(url: string | undefined | null): string {
  if (!url) return '/placeholder.svg';
  
  let targetUrl = url;
  // Normalize Google Drive URLs to direct CDN endpoint to bypass access blocks
  const driveMatch = targetUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || 
                     targetUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                     targetUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                     targetUrl.match(/[?&]docid=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    targetUrl = `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }

  // If it's a Google Drive/UserContent link, route it through our API proxy to prevent 403 blocks
  if (targetUrl.includes('drive.google.com') || targetUrl.includes('googleusercontent.com')) {
    return `/api/image-proxy?url=${encodeURIComponent(targetUrl)}`;
  }
  return targetUrl;
}

