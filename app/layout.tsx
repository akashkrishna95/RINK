// C:\Users\Akash Krishna\Downloads\RINK KSUM Website\app\layout.tsx
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import localFont from 'next/font/local'
import NextTopLoader from 'nextjs-toploader'
// import RomiRedirectWidget from '@/HomePage/RomiAI/RomiRedirectWidget'
import Script from 'next/script'

import './globals.css'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const gotham = localFont({
  src: [
    {
      path: '../public/fonts/Gotham_Regular.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-gotham',
  display: 'swap',
})

const helios = localFont({
  src: [
    {
      path: '../public/fonts/HeliosExt.woff',
      weight: '400 900',
      style: 'normal',
    },
  ],
  variable: '--font-helios',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RINK - Research Innovation Network Kerala',
  description: 'Connecting Innovation to Impact. Aligning India\'s top research institutions, market-ready IP, and Researchpreneurship.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/images/favicon.png',
        type: 'image/png',
      },
    ],
    apple: '/images/favicon.png',
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
    <html lang="en" className={`${poppins.variable} ${gotham.variable} ${helios.variable}`}>
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
      </body>
    </html>
  )
}