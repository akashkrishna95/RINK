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
    const hasTrl = tech.trl && tech.trl !== 'Not Specified' && tech.trl.trim() !== '';
    const hasStartupPotential = tech.startup_potential && tech.startup_potential !== '⚪ Not Specified' && tech.startup_potential.trim() !== '';

    if (isPatented || hasTrl || hasStartupPotential || isFeatured) {
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

  const getSortScore = (tech: Technology) => {
    const hasImage = tech.image && !tech.image.includes('placeholder') && tech.image.trim() !== '';
    const isFeatured = tech.featured;

    if (hasImage && isFeatured) return 3;
    if (hasImage) return 2;
    if (isFeatured) return 1;
    return 0;
  };

  return Array.from(uniqueMap.values()).sort((a, b) => getSortScore(b) - getSortScore(a));
}
