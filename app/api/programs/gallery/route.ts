import { NextRequest, NextResponse } from 'next/server';

// Extracts file IDs from a public Google Drive folder URL
function extractFolderIdFromUrl(url: string): string | null {
  // formats: /drive/folders/FOLDER_ID  or  ?id=FOLDER_ID
  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) return folderMatch[1];
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return idMatch[1];
  return null;
}

export async function GET(req: NextRequest) {
  const folderUrl = req.nextUrl.searchParams.get('folderUrl');
  if (!folderUrl) return NextResponse.json({ images: [] });

  const folderId = extractFolderIdFromUrl(folderUrl);
  if (!folderId) return NextResponse.json({ images: [], error: 'Could not extract folder ID' });

  try {
    const drivePageUrl = `https://drive.google.com/drive/folders/${folderId}`;
    const res = await fetch(drivePageUrl, {
      cache: 'no-store',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
    });

    if (!res.ok) throw new Error(`Drive fetch failed: ${res.status}`);

    if (res.url.includes('accounts.google.com')) {
      return NextResponse.json({
        images: [],
        error: 'This Google Drive folder is private. Please set sharing access to "Anyone with the link can view".',
        folderId,
      });
    }

    const html = await res.text();
    const foundIds = new Set<string>();

    // Refined regex requires exactly 33 characters for Google Drive image file IDs.
    const dataMatches = html.matchAll(/"([a-zA-Z0-9_-]{33})"/g);
    for (const match of dataMatches) {
      const id = match[1];
      if (/^[a-zA-Z0-9_-]{33}$/.test(id) && !id.startsWith('__') && id !== folderId) {
        foundIds.add(id);
      }
    }

    const images = Array.from(foundIds).slice(0, 60).map(id =>
      `https://lh3.googleusercontent.com/d/${id}`
    );

    return NextResponse.json({ images, folderId });
  } catch (err) {
    console.error('[programs gallery API]', err);
    return NextResponse.json({ images: [], error: 'Failed to load gallery' });
  }
}
