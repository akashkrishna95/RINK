import { pb, mapPbInstitution, Institution } from './pocketbase';

export async function getInstitutions(): Promise<Institution[]> {
  try {
    const records = await pb.collection('all_institutions').getFullList({
      sort: 'institution',
      cache: 'no-store'
    });
    return records.map(mapPbInstitution);
  } catch (error) {
    console.error("Failed to fetch real-time institutions from PocketBase:", error);
    return [];
  }
}
export type { Institution };
