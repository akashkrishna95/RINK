import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = (values[i] ?? '').trim(); });
    return row;
  }).filter(row => {
    const title = row['program_name'] || row['program'] || row['event_name'] || '';
    return title.trim() !== '';
  });
}

const parseDateSafe = (d: string) => { const t = Date.parse(d); return isNaN(t) ? 0 : t; };

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

export async function GET() {
  const url = process.env.PROGRAMS_SPREADSHEET_URL;
  if (!url) return NextResponse.json({ error: 'PROGRAMS_SPREADSHEET_URL not configured' }, { status: 500 });
  try {
    // Append a unique timestamp query parameter to bypass all layers of Next.js/Vercel/CDN fetch caching
    const separator = url.includes('?') ? '&' : '?';
    const fetchUrl = `${url}${separator}t=${Date.now()}`;
    const res = await fetch(fetchUrl, {
      cache: 'no-store',
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const csv = await res.text();
    const rows = parseCSV(csv);
    const programs: SheetProgram[] = rows.map((row, idx) => {
      const rawStatus = (row['status'] ?? '').toLowerCase().trim();
      let status: 'upcoming' | 'current' | 'past' = 'upcoming';
      if (rawStatus.includes('current')) {
        status = 'current';
      } else if (rawStatus.includes('past')) {
        status = 'past';
      } else if (rawStatus.includes('upcoming')) {
        status = 'upcoming';
      }

      const programName = row['program_name'] || row['program'] || row['event_name'] || '';
      const programGallery = row['view_gallery'] || row['program_gallery'] || row['event_gallery'] || '';

      return {
        id: `program-${idx}-${programName.replace(/\s+/g, '-').toLowerCase().slice(0, 30)}`,
        title: programName,
        date: row['date'] ?? '',
        time: row['time'] ?? '',
        description: row['description'] ?? '',
        poster_link: formatDriveImageUrl(row['poster_link'] ?? ''),
        registration_link: row['registration_link'] ?? '',
        location: row['location'] ?? '',
        status,
        event_gallery: programGallery.trim(),
      };
    });
    const current = programs.filter(p => p.status === 'current').sort((a, b) => parseDateSafe(a.date) - parseDateSafe(b.date));
    const upcoming = programs.filter(p => p.status === 'upcoming').sort((a, b) => parseDateSafe(a.date) - parseDateSafe(b.date));
    const past = programs.filter(p => p.status === 'past').sort((a, b) => parseDateSafe(b.date) - parseDateSafe(a.date));
    return NextResponse.json({ success: true, current, upcoming, past, all: [...current, ...upcoming, ...past] });
  } catch (err) {
    console.error('[programs API]', err);
    return NextResponse.json({ error: 'Failed to load programs' }, { status: 500 });
  }
}
