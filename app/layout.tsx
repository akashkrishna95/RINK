import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import localFont from 'next/font/local'
import NextTopLoader from 'nextjs-toploader'
import GlobalChatbot from '@/components/GlobalChatbot'
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
})

export const metadata: Metadata = {
  title: 'RINK - Research Innovation Network Kerala',
  description: 'Connecting Innovation to Impact. Aligning India\'s top research institutions, market-ready IP, and Researchpreneurship.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
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
    <html lang="en" className={`${poppins.variable} ${gotham.variable}`}>
      <body className="font-poppins antialiased" style={{ backgroundColor: '#F4F7FB' }}>
        <NextTopLoader color="#1b60bb" showSpinner={false} height={3} />
        {children}
        <GlobalChatbot />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
