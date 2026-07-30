// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\api\image-proxy\route.ts


import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    let targetUrl = imageUrl;
    
    // Normalize Google Drive URLs to direct CDN endpoint to bypass access blocks
    const driveMatch = targetUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || 
                       targetUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                       targetUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                       targetUrl.match(/[?&]docid=([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      // Append =s800 to resize using Google's high performance CDN directly (zero CPU usage on serverless!)
      targetUrl = `https://lh3.googleusercontent.com/d/${driveMatch[1]}=s800`;
    }

    const parsedUrl = new URL(targetUrl);
    const allowedHostnames = [
      'drive.google.com',
      'googleusercontent.com',
      'lh3.googleusercontent.com',
      'usercontent.google.com',
      'rink.startupmission.in',
    ];
    
    const isAllowed = allowedHostnames.some(hostname => 
      parsedUrl.hostname === hostname || parsedUrl.hostname.endsWith('.' + hostname)
    );

    if (!isAllowed) {
      return new NextResponse('Forbidden hostname', { status: 403 });
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type') || '';
    const isHtmlOrSignIn = response.url.includes('accounts.google.com') || contentType.includes('text/html');

    if (!response.ok || isHtmlOrSignIn) {
      return new NextResponse('Image not accessible or permission restricted in Google Drive', { status: 404 });
    }

    const buffer = await response.arrayBuffer();
    const outputBuffer = Buffer.from(buffer);
    const outputContentType = contentType || 'image/jpeg';

    return new Response(outputBuffer, {
      status: 200,
      headers: {
        'Content-Type': outputContentType,
        'Content-Length': outputBuffer.length.toString(),
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

