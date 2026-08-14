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

function parseCSV(csvText: string): Record<string, string>[] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField);
      rows.push(currentRow);
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }
  if (currentRow.length > 0 || currentField !== '') {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  
  return rows.slice(1).map(rowValues => {
    const rowObj: Record<string, string> = {};
    headers.forEach((h, i) => {
      rowObj[h] = (rowValues[i] ?? '').trim();
    });
    return rowObj;
  }).filter(rowObj => {
    const title = rowObj['program_name'] || rowObj['program'] || rowObj['event_name'] || '';
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
  const url = process.env.PROGRAMS_SPREADSHEET_URL || 'https://docs.google.com/spreadsheets/d/1CnnHkdQYdvPb02ihjQzfeYh5W01SPEQ-g8RSQqm30JM/export?format=csv&gid=1238367316';
  try {
    const res = await fetch(url, {
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
