// lib/getTechCounts.ts
//
// Resolves how many RINK technologies belong to each institution by
// matching institution names between PocketBase (all_institutions) and
// rink_tech.json. There's no institution_id in rink_tech.json — matching
// is name-based, so this file exists to make that matching predictable
// and debuggable rather than a silent black box.
//
// Server-only: this fetch always runs inside getInstitutions(), never in
// the browser, so the URL is intentionally NOT prefixed with NEXT_PUBLIC_.

interface RinkTechRecord {
  technology_id: string;
  institution: string;
  [key: string]: any;
}

const TECH_JSON_URL =
  process.env.RINK_TECH_JSON_URL || 'https://rink-git-cron.vercel.app/rink_tech.json';
  
if (!process.env.RINK_TECH_JSON_URL) {
  console.warn('[TECH-COUNT] RINK_TECH_JSON_URL not set — falling back to hardcoded URL. Add it in Vercel env vars to remove this warning.');
}

let cachedTechsPromise: Promise<RinkTechRecord[]> | null = null;

export function normalizeInstitutionName(raw: string): string {
  if (!raw) return '';
  return raw
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')                       // drop "(CTCRI)" style acronyms
    .replace(/[^a-z0-9\s]/g, ' ')                      // drop punctuation
    .replace(/\b(the|of|and|for|dept|department)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Pulls out BOTH forms of an acronym-plus-expansion name, since
// normalizeInstitutionName only keeps whatever's outside the parens and
// throws away the acronym itself. Either form now gets a shot at an
// exact match (e.g. "RGCB (Rajiv Gandhi Centre for Biotechnology)" tries
// both "rgcb" and "rajiv gandhi centre biotechnology").
function extractNameVariants(raw: string): string[] {
  if (!raw) return [];
  const variants = new Set<string>();

  const primary = normalizeInstitutionName(raw);
  if (primary) variants.add(primary);

  const parenMatch = raw.match(/\(([^)]+)\)/);
  if (parenMatch) {
    const acronymForm = normalizeInstitutionName(parenMatch[1]);
    if (acronymForm) variants.add(acronymForm);
  }

  return Array.from(variants);
}

// Umbrella bodies that sit above several independently-listed child
// institutes (KSCSTE has 9+ child institutes in all_institutions).
// Fuzzy matching is never safe for these — a short shared word like
// "kscste" would grab whichever child institute happens to score
// highest, which is essentially always the wrong answer for the parent
// record itself.
const NO_FUZZY_INSTITUTIONS = new Set<string>([
  normalizeInstitutionName('KSCSTE (Kerala State Council for Science, Technology and Environment)'),
]);

// Confirmed mismatches go here once you've checked the [TECH-COUNT] logs.
// Left side: exact institution string as stored in PocketBase.
// Right side: however that institute is phrased in rink_tech.json.
const MANUAL_ALIASES: Record<string, string> = {
  // "RGCB (Rajiv Gandhi Centre for Biotechnology)": "Rajiv Gandhi Centre for Biotechnology",
};

async function fetchTechs(): Promise<RinkTechRecord[]> {
  if (cachedTechsPromise) return cachedTechsPromise;
  cachedTechsPromise = fetch(TECH_JSON_URL, { next: { revalidate: 3600 } })
    .then((res) => {
      if (!res.ok) throw new Error(`rink_tech.json fetch failed: ${res.status}`);
      return res.json();
    })
    .then((json) => {
      const list: RinkTechRecord[] = json.technologies || [];
      console.log(`[TECH-COUNT] loaded ${list.length} technologies from rink_tech.json`);
      return list;
    })
    .catch((err) => {
      console.error('[TECH-COUNT] fetch failed:', err);
      cachedTechsPromise = null; // allow retry on next call instead of caching a failure
      return [];
    });
  return cachedTechsPromise;
}

export async function getTechCountsByInstitution(): Promise<Map<string, number>> {
  const techs = await fetchTechs();
  const counts = new Map<string, number>();
  for (const t of techs) {
    const key = normalizeInstitutionName(t.institution);
    if (!key) continue;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

export interface TechCountMatch {
  count: number;
  matchType: 'exact' | 'fuzzy' | 'none';
  matchedKey?: string;
}

export function matchTechCount(institutionName: string, counts: Map<string, number>): TechCountMatch {
  const aliasTarget = MANUAL_ALIASES[institutionName];
  if (aliasTarget) {
    const aliasKey = normalizeInstitutionName(aliasTarget);
    if (counts.has(aliasKey)) {
      return { count: counts.get(aliasKey)!, matchType: 'exact', matchedKey: aliasKey };
    }
  }

  const variants = extractNameVariants(institutionName);
  if (variants.length === 0) return { count: 0, matchType: 'none' };

  for (const v of variants) {
    if (counts.has(v)) return { count: counts.get(v)!, matchType: 'exact', matchedKey: v };
  }

  const primaryKey = variants[0];
  if (NO_FUZZY_INSTITUTIONS.has(primaryKey)) {
    return { count: 0, matchType: 'none' };
  }

  const keyTokens = primaryKey.split(' ').filter(Boolean);
  // A near-single-word name (e.g. a bare acronym) is too generic to trust
  // for fuzzy matching on its own — require an exact hit or a manual alias.
  if (keyTokens.length < 2) return { count: 0, matchType: 'none' };

  let best = 0;
  let bestKey: string | undefined;
  let bestShared = 0;
  for (const [techKey, count] of counts) {
    const techTokens = techKey.split(' ').filter(Boolean);
    if (techTokens.length < 2) continue;
    const shared = keyTokens.filter((t) => techTokens.includes(t)).length;
    const minLen = Math.min(keyTokens.length, techTokens.length);
    // Requires 2+ real shared words covering most of the shorter name —
    // this specifically stops a single word like "kscste" from ever
    // being enough on its own to win a match.
    if (shared >= 2 && shared / minLen >= 0.6 && shared > bestShared) {
      best = count;
      bestKey = techKey;
      bestShared = shared;
    }
  }
  return { count: best, matchType: best > 0 ? 'fuzzy' : 'none', matchedKey: bestKey };
}