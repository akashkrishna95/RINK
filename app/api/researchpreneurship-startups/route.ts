import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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
    const name = row['startup_name'] || row['name'] || '';
    return name.trim() !== '';
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
  const url = process.env.RESEARCHPRENEURSHIP_STARTUPS_SPREADSHEET_URL || 'https://docs.google.com/spreadsheets/d/1HXlzT504-AhqzfU6Nm3bktAspIjaQm2l1z45qROZrFc/export?format=csv&gid=201404811';
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
    const startups = rows.map((row) => {
      const name = row['startup_name'] || row['name'] || '';
      const logoUrl = row['startup_logo_url'] || row['logo_url'] || row['logo'] || '';
      return {
        name: name.trim(),
        logoUrl: formatDriveImageUrl(logoUrl),
      };
    }).filter(startup => {
      const hasValidName = startup.name !== '' && !startup.name.startsWith(',') && !startup.name.includes('drive.google.com') && !startup.name.includes('googleusercontent.com');
      const hasValidLogo = startup.logoUrl !== '' && (startup.logoUrl.includes('drive.google.com') || startup.logoUrl.includes('googleusercontent.com'));
      return hasValidName && hasValidLogo;
    });
    return NextResponse.json({ success: true, startups });
  } catch (err) {
    console.error('[researchpreneurship-startups API]', err);
    return NextResponse.json({ error: 'Failed to load startups' }, { status: 500 });
  }
}
