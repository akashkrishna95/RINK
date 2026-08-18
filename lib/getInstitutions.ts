import { pb, mapPbInstitution, Institution } from './pocketbase';
import { getTechCountsByInstitution, matchTechCount } from './getTechCounts';

export async function getInstitutions(): Promise<Institution[]> {
  try {
    const [records, techCounts] = await Promise.all([
      pb.collection('all_institutions').getFullList({
        sort: 'institution',
        next: { revalidate: 3600 },
      }),
      getTechCountsByInstitution().catch(() => new Map<string, number>()),
    ]);

    console.log(`[TECH-COUNT] matching against ${records.length} institutions`);

    return records.map((r) => {
      const inst = mapPbInstitution(r);
      const result = matchTechCount(inst.name, techCounts);

      if (result.matchType === 'fuzzy') {
        console.log(`[TECH-COUNT] FUZZY: "${inst.name}" -> "${result.matchedKey}" (${result.count})`);
      } else if (result.matchType === 'none') {
        console.log(`[TECH-COUNT] NO MATCH: "${inst.name}"`);
      }

      return result.count > 0 ? { ...inst, techCount: result.count } : inst;
    });
  } catch (error) {
    console.error('Failed to fetch real-time institutions from PocketBase:', error);
    return [];
  }
}