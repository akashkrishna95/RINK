import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Barlow, Bricolage_Grotesque } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
// import RomiRedirectWidget from '@/HomePage/RomiAI/RomiRedirectWidget'
import Script from 'next/script'

import './globals.css'

const barlow = Barlow({
  variable: '--font-barlow',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})



const bricolageGrotesque = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RINK - Research Innovation Network Kerala',
  description: 'Connecting Innovation to Impact. Aligning India\'s top research institutions, market-ready IP, and Researchpreneurship.',
  generator: 'v0.app',
  metadataBase: new URL('https://rink.startupmission.in'),
  icons: {
    icon: [
      {
        url: '/images/favicon.png',
        type: 'image/png',
      },
    ],
    apple: '/images/favicon.png',
  },
  openGraph: {
    title: 'RINK - Research Innovation Network Kerala',
    description: 'Connecting Innovation to Impact. Aligning India\'s top research institutions, market-ready IP, and Researchpreneurship.',
    images: ['/images/rink-3d-logo.webp'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RINK - Research Innovation Network Kerala',
    description: 'Connecting Innovation to Impact. Aligning India\'s top research institutions, market-ready IP, and Researchpreneurship.',
    images: ['/images/rink-3d-logo.webp'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${barlow.variable} ${bricolageGrotesque.variable}`}>
      <body className="font-poppins antialiased" style={{ backgroundColor: '#F4F7FB' }}>
        <NextTopLoader color="#1b60bb" showSpinner={false} height={3} />
        
        {children}
        
        {/* <RomiRedirectWidget /> */}
        
        {process.env.NODE_ENV === 'production' && <Analytics />}
        
        {/* Anti-download scripts for images and logos */}
        <Script id="anti-download" strategy="afterInteractive">
          {`
            document.addEventListener('contextmenu', (e) => {
              if (e.target.tagName === 'IMG' || e.target.closest('img')) {
                e.preventDefault();
              }
            }, true);
            document.addEventListener('dragstart', (e) => {
              if (e.target.tagName === 'IMG' || e.target.closest('img')) {
                e.preventDefault();
              }
            }, true);
          `}
        </Script>
        {/* Service worker registration for caching images and content */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then((reg) => console.log('[Service Worker] Registered with scope:', reg.scope))
                  .catch((err) => console.error('[Service Worker] Registration failed:', err));
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}