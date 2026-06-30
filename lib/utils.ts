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

