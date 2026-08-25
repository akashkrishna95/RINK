//C:\Users\Akash Krishna\Downloads\RINK KSUM Website\lib\getFeaturedTechnologies.ts
import technologiesData from '@/data/technologies.json';
import { normalizeIPStatus, isFeaturedTechnology } from '@/lib/utils';

export interface Technology {
  id: string;
  name: string;
  image: string;
  sector: string;
  institution: string;
  ipStatus: 'Patented' | 'Patent Filed' | 'Not Specified';
  featured: boolean;
  description?: string;
}

export function getFeaturedTechnologies(): Technology[] {
  let rawData: any = technologiesData;
  if (rawData['MAIN_SHEET']) {
    rawData = rawData['MAIN_SHEET'];
  } else if (rawData['MAIN SHEET']) {
    rawData = rawData['MAIN SHEET'];
  }

  const uniqueMap = new Map<string, Technology>();

  (rawData || []).forEach((tech: any) => {
    if (!tech.technology_id || tech.technology_id === 'technology_id') return;

    const isFeatured = isFeaturedTechnology(tech.startup_potential);
    const isPatented = normalizeIPStatus(tech.patent_status) === 'Patented';

    // Display only Top Tech (Featured) or Patented technologies in the carousel
    if (isFeatured || isPatented) {
      if (!uniqueMap.has(tech.technology_id)) {
        uniqueMap.set(tech.technology_id, {
          id: String(tech.technology_id),
          name: tech.technology_name || 'Untitled Technology',
          institution: tech.institution || 'N/A',
          sector: tech.primary_sector || tech.sector || 'N/A',
          ipStatus: normalizeIPStatus(tech.patent_status),
          featured: isFeatured,
          image: tech.image_url || '/placeholder.svg',
          description: tech.description || tech.brief_description_abstract || tech.problem_solved || '',
        });
      }
    }
  });

  const featured = Array.from(uniqueMap.values()).filter(t => t.featured);
  const patentedOnly = Array.from(uniqueMap.values()).filter(t => !t.featured && t.ipStatus === 'Patented');

  // Take top 8 featured and top 8 patented (total 16 items)
  const processedTechs = [
    ...featured.slice(0, 8),
    ...patentedOnly.slice(0, 8)
  ];

  return processedTechs;
}
