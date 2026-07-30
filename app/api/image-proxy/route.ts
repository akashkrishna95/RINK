import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    const parsedUrl = new URL(imageUrl);
    const allowedHostnames = [
      'drive.google.com',
      'googleusercontent.com',
      'lh3.googleusercontent.com',
      'rink.startupmission.in',
    ];
    
    const isAllowed = allowedHostnames.some(hostname => 
      parsedUrl.hostname === hostname || parsedUrl.hostname.endsWith('.' + hostname)
    );

    if (!isAllowed) {
      return new NextResponse('Forbidden hostname', { status: 403 });
    }

    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    const contentType = response.headers.get('content-type') || '';
    const isHtmlOrSignIn = response.url.includes('accounts.google.com') || contentType.includes('text/html');

    if (!response.ok || isHtmlOrSignIn) {
      return new NextResponse('Image not accessible or permission restricted in Google Drive', { status: 404 });
    }

    const buffer = await response.arrayBuffer();
    let outputBuffer = Buffer.from(buffer);
    let outputContentType = contentType || 'image/jpeg';

    // Optimize images on the fly if they are raster images (exclude SVG and GIF)
    if (outputContentType.startsWith('image/') && !outputContentType.includes('svg') && !outputContentType.includes('gif')) {
      try {
        outputBuffer = await sharp(outputBuffer)
          .resize({ width: 500, withoutEnlargement: true })
          .webp({ quality: 75 })
          .toBuffer();
        outputContentType = 'image/webp';
      } catch (sharpError) {
        console.warn('Sharp compression failed, returning original image:', sharpError);
      }
    }

    return new NextResponse(outputBuffer, {
      headers: {
        'Content-Type': outputContentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
