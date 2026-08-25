import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Barlow, Bricolage_Grotesque } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import ScrollRestoration from '@/components/ScrollRestoration'
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
        <ScrollRestoration />
        
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
        {/* Version checker & cleanup script to unregister all service workers, delete caches, and clear local data when new code is pushed */}
        <Script id="clear-sw" strategy="beforeInteractive">
          {`
            if (typeof window !== 'undefined') {
              const currentBuildVersion = "20260825_1815";
              const savedVersion = localStorage.getItem('rink_build_version');
              
              if (savedVersion !== currentBuildVersion) {
                localStorage.clear();
                sessionStorage.clear();
                localStorage.setItem('rink_build_version', currentBuildVersion);
                
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then((registrations) => {
                    for (let registration of registrations) {
                      registration.unregister();
                    }
                  });
                }
                
                if ('caches' in window) {
                  caches.keys().then((keys) => {
                    keys.forEach((key) => {
                      caches.delete(key);
                    });
                  });
                }
                console.log('[Version Manager] New version detected (' + currentBuildVersion + '). Site data and caches reset.');
              }
            }
          `}
        </Script>
      </body>
    </html>
  )
}