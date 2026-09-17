import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Fraunces, Inter, Noto_Sans_Devanagari, Noto_Serif_Devanagari } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { UtmCapture } from '@/components/UtmCapture'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import './globals.css'

// Runs before hydration so a previously-chosen dark theme applies to the
// very first paint (avoiding a flash of light-then-dark). Deliberately
// ignores prefers-color-scheme — the site always starts in light mode for a
// first-time visitor regardless of OS theme; dark mode is opt-in only.
const THEME_INIT_SCRIPT = `(function(){try{if(localStorage.getItem('rpa:theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-serif', display: 'swap' })
// Fraunces/Inter have no Devanagari glyphs, so Hindi text would otherwise
// fall back to an arbitrary system font (the mismatched-baseline look seen
// in the screenshot). These pair with them for the Hindi UI — see the
// `html[lang='hi']` rule in globals.css.
const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-sans-hi',
  display: 'swap',
})
const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-serif-hi',
  display: 'swap',
})

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
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${notoSansDevanagari.variable} ${notoSerifDevanagari.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <ThemeProvider>
          <LanguageProvider>
            <UtmCapture />
            {children}
            <Analytics />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
