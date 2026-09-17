import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Fraunces, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { UtmCapture } from '@/components/UtmCapture'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-serif', display: 'swap' })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pattern.mindurmind.org.in'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Relationship Pattern Assessment™ | Discover Your Relationship Pattern',
    template: '%s | Relationship Pattern Assessment™',
  },
  description:
    'Understand the patterns that may be shaping the way you think, feel, and respond in relationships — with a free 5-minute self-reflection assessment.',
  openGraph: {
    title: 'Relationship Pattern Assessment™',
    description:
      'Discover your relationship pattern with a free 5-minute self-reflection assessment. No right or wrong answers — just honest reflection.',
    url: siteUrl,
    siteName: 'Relationship Pattern Assessment™',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Relationship Pattern Assessment™',
    description: 'Discover your relationship pattern with a free 5-minute self-reflection assessment.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans">
        <UtmCapture />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
