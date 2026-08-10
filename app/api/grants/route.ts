import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface SheetGrant {
  id: string;
  title: string;
  last_date: string;
  description: string;
  poster_link: string;
  registration_link: string;
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
    const firstKey = headers[0];
    return rowObj[firstKey] && rowObj[firstKey].trim() !== '';
  });
}

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
  const url = 'https://docs.google.com/spreadsheets/d/1CnnHkdQYdvPb02ihjQzfeYh5W01SPEQ-g8RSQqm30JM/export?format=csv&gid=1103807195';
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
    const grants: SheetGrant[] = rows.map((row, idx) => {
      const grantName = row['grant_name'] || '';
      return {
        id: `grant-${idx}-${grantName.replace(/\s+/g, '-').toLowerCase().slice(0, 30)}`,
        title: grantName,
        last_date: row['last_date'] ?? '',
        description: row['description'] ?? '',
        poster_link: formatDriveImageUrl(row['poster_link'] ?? ''),
        registration_link: row['registration_link'] ?? '',
      };
    });
    return NextResponse.json({ success: true, grants });
  } catch (err) {
    console.error('[grants API]', err);
    return NextResponse.json({ error: 'Failed to load grants' }, { status: 500 });
  }
}
