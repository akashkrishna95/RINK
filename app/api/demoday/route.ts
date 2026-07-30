import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const VIDEO_TITLES: Record<string, string> = {
  '4_4w6dkO1ik': 'ICAR-SUGARCANE BREEDING INSTITUTE KANNUR',
  'bY5FVptw0uI': 'MG UNIVERSITY',
  'uJnU7nZgzs8': 'Centre for Materials for Electronics Technology, CMET',
  'U0kmZCbR3nA': 'National Institute For Interdisciplinary Science and Technology, NIIST',
  'a3hbMuF5zl4': 'Central Plantation Crops Research Institute (CPCRI)',
  '5jrxaZ5w7e0': 'CENTRAL TUBER CROPS RESEARCH INSTITUTE (CTCRI)',
  'NojFCP84yls': 'KERALA UNIVERSITY OF FISHERIES & OCEAN STUDIES (KUFOS)',
  'IF-XZPllRFU': 'Centre for Development of Advanced Computing (C-DAC)',
  '8LDcim7TwwI': 'National Technology Day Special Demo Day'
};

function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const match = url.trim().match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
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
  });
}

export async function GET() {
  const url = process.env.DEMODAY_SPREADSHEET_URL || 'https://docs.google.com/spreadsheets/d/1CnnHkdQYdvPb02ihjQzfeYh5W01SPEQ-g8RSQqm30JM/export?format=csv&gid=711117033';

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

    let idx = 0;
    const videos = rows.map((row) => {
      const youtubeLink = row['youtube_link'] || row['url'] || row['link'] || '';
      const id = extractYoutubeId(youtubeLink);
      if (!id) return null;

      const title = row['title'] || row['institution'] || row['name'] || VIDEO_TITLES[id] || `Demo Day Showcase ${++idx}`;
      return { id, title };
    }).filter(Boolean);

    return NextResponse.json({ success: true, videos });
  } catch (err) {
    console.error('[demoday API]', err);
    return NextResponse.json({ error: 'Failed to load Demo Day pitches' }, { status: 500 });
  }
}
