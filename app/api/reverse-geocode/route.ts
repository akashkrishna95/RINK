import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const lat = parseFloat(req.nextUrl.searchParams.get('lat') || '');
  const lng = parseFloat(req.nextUrl.searchParams.get('lng') || '');

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json({ error: 'Invalid lat/lng' }, { status: 400 });
  }

  const roundedLat = lat.toFixed(4);
  const roundedLng = lng.toFixed(4);

  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${roundedLat}&lon=${roundedLng}&zoom=16&addressdetails=1`;
    const res = await fetch(nominatimUrl, {
      headers: { 'User-Agent': 'RINK-KSUM-Website/1.0 (rink@startupmission.in)' },
      next: { revalidate: 60 * 60 * 24 * 30 }, // 30 days — addresses don't move
    });

    if (!res.ok) {
      console.error('[GEOCODE] Nominatim returned', res.status);
      return NextResponse.json({ error: 'Geocoding failed' }, { status: 502 });
    }

    const data = await res.json();
    console.log(`[GEOCODE] resolved ${roundedLat},${roundedLng} ->`, data.display_name ? 'ok' : 'no result');

    return new NextResponse(JSON.stringify({ address: data.display_name || null }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=2592000, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    console.error('[GEOCODE] error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}