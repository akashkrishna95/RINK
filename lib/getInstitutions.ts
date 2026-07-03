import baselineInstitutions from '@/data/institutions_mapped.json';

export interface Institution {
  id: number;
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

// Simple RFC 4180 compliant CSV parser
function parseCSV(text: string) {
  const lines = text.split(/\r?\n/);
  if (lines.length < 2) return [];
  
  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    rows.push(row);
  }
  return rows;
}

function parseCSVLine(line: string) {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  return result.map(val => val.replace(/^"|"$/g, '').replace(/""/g, '"'));
}

// Clean names for matching
function cleanName(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// District coordinates map for fallback geocoding
const districtCenters: Record<string, { lat: number; lng: number }> = {
  kasaragod: { lat: 12.4996, lng: 74.9869 },
  kannur: { lat: 11.8745, lng: 75.3704 },
  wayanad: { lat: 11.6854, lng: 76.1320 },
  kozhikode: { lat: 11.2588, lng: 75.7804 },
  malappuram: { lat: 11.0735, lng: 76.0740 },
  palakkad: { lat: 10.7867, lng: 76.6547 },
  thrissur: { lat: 10.5276, lng: 76.2144 },
  ernakulam: { lat: 9.9816, lng: 76.2999 },
  idukki: { lat: 9.9189, lng: 77.1025 },
  kottayam: { lat: 9.5916, lng: 76.5222 },
  alappuzha: { lat: 9.4981, lng: 76.3388 },
  alapuzha: { lat: 9.4981, lng: 76.3388 },
  pathanamthitta: { lat: 9.2648, lng: 76.7870 },
  kollam: { lat: 8.8932, lng: 76.6141 },
  thiruvananthapuram: { lat: 8.5241, lng: 76.9366 },
  trivandrum: { lat: 8.5241, lng: 76.9366 },
  thrivandrum: { lat: 8.5241, lng: 76.9366 }
};

// Transform Google Drive URL to direct embed link
function getDirectDriveUrl(url: string): string {
  if (!url) return '';
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  const queryMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (queryMatch && queryMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${queryMatch[1]}`;
  }
  return url;
}

// Global in-memory cache for geocoded locations (preserves state across hot-reloads)
const globalCache = (globalThis as any)._geocodeCache || new Map<string, { lat: number; lng: number }>();
(globalThis as any)._geocodeCache = globalCache;

// Prepopulate the cache with baseline coordinates
if (globalCache.size === 0) {
  baselineInstitutions.forEach(inst => {
    if (inst.location) {
      globalCache.set(cleanName(inst.location), { lat: inst.lat, lng: inst.lng });
    }
    globalCache.set(cleanName(inst.name), { lat: inst.lat, lng: inst.lng });
  });
}

// Helper to query Nominatim OSM Geocoding API
async function geocodeNominatim(query: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'RINK-KSUM-Website-Builder-Akash'
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data[0]) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
    }
  } catch (error) {
    console.error(`Geocoding error for "${query}":`, error);
  }
  return null;
}

export async function getInstitutions(): Promise<Institution[]> {
  try {
    // Append timestamp & random parameter to bypass caching completely at the Google CDN layer
    const sheetUrl = `https://docs.google.com/spreadsheets/d/1HXlzT504-AhqzfU6Nm3bktAspIjaQm2l1z45qROZrFc/export?format=csv&gid=1582106736&t=${Date.now()}&cb=${Math.random()}`;
    
    // Fetch from sheet in real-time
    const response = await fetch(sheetUrl, { 
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Sheet fetch failed: ${response.statusText}`);
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);

    // Build baseline techCounts map from baseline data
    const techCountsMap = new Map<string, number>();
    baselineInstitutions.forEach(inst => {
      techCountsMap.set(cleanName(inst.name), inst.techCount || 0);
    });

    const institutions: Institution[] = await Promise.all(rows.map(async (row, index) => {
      const name = row['institution'] || 'Untitled Institution';
      const location = row['location'] || '';
      const district = row['district'] || '';
      const website = row['website'] || '';
      const rawLogoUrl = row['institution_logo_url'] || '';
      const logo_url = getDirectDriveUrl(rawLogoUrl);
      const partnered = (row['partnered_institutions'] || '').trim().toLowerCase() === 'partnered';

      const cleanInstName = cleanName(name);
      const cleanLoc = cleanName(location);
      
      // Determine coordinates
      let lat = 10.5;
      let lng = 76.3;

      // 0. Try reading coordinates directly from spreadsheet if provided
      const sheetLat = parseFloat(row['latitude'] || row['lat'] || '');
      const sheetLng = parseFloat(row['longitude'] || row['lng'] || row['long'] || '');

      if (!isNaN(sheetLat) && !isNaN(sheetLng)) {
        lat = sheetLat;
        lng = sheetLng;
      } else {
        // 1. Try cache by location text
        if (cleanLoc && globalCache.has(cleanLoc)) {
          const coords = globalCache.get(cleanLoc)!;
          lat = coords.lat;
          lng = coords.lng;
        }
        // 2. Try cache by institution name
        else if (globalCache.has(cleanInstName)) {
          const coords = globalCache.get(cleanInstName)!;
          lat = coords.lat;
          lng = coords.lng;
        }
        // 3. Fallback: Geocode dynamically using Nominatim (adds to cache for next loads)
        else if (location) {
          const query = `${location}`;
          const coords = await geocodeNominatim(query);
          if (coords) {
            lat = coords.lat;
            lng = coords.lng;
            globalCache.set(cleanLoc, coords);
            globalCache.set(cleanInstName, coords);
          } else {
            // Try name + district
            const fallbackQuery = `${name}, ${district}, Kerala, India`;
            const fallbackCoords = await geocodeNominatim(fallbackQuery);
            if (fallbackCoords) {
              lat = fallbackCoords.lat;
              lng = fallbackCoords.lng;
              globalCache.set(cleanLoc, fallbackCoords);
              globalCache.set(cleanInstName, fallbackCoords);
            } else {
              // Fallback to district center coordinates
              const cleanDistrictName = cleanName(district);
              const distCoords = districtCenters[cleanDistrictName];
              if (distCoords) {
                lat = distCoords.lat;
                lng = distCoords.lng;
              }
            }
          }
        }
      }

      // Tech count mapping
      let techCount = techCountsMap.get(cleanInstName) || 0;
      if (techCount === 0) {
        // Substring search for new/modified names
        for (const [key, val] of techCountsMap.entries()) {
          if (cleanInstName.includes(key) || key.includes(cleanInstName)) {
            techCount = val;
            break;
          }
        }
      }

      return {
        id: index + 1,
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
    }));

    return institutions;
  } catch (error) {
    printError(error);
    // Fallback to baseline if real-time fetch fails
    return baselineInstitutions.map(inst => ({
      ...inst,
      techCount: inst.techCount || 0
    }));
  }
}

function printError(err: any) {
  console.error("Failed to fetch real-time institutions from Google Sheet:", err);
}
