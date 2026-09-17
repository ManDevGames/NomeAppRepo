import type { Metadata } from 'next'
import { getPublicResult } from '@/lib/result'
import { getPatternById } from '@/lib/patterns'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { ResultView } from '@/components/assessment/ResultView'
import { ResultFallback } from '@/components/assessment/ResultFallback'
import { ClearAssessmentSession } from '@/components/ClearAssessmentSession'
import { TrackEvent } from '@/components/TrackEvent'

export const metadata: Metadata = {
  title: 'Your Relationship Pattern',
  robots: { index: false, follow: false },
}

interface ResultPageProps {
  params: { leadId: string }
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pattern.mindurmind.org.in'

export default async function ResultPage({ params }: ResultPageProps) {
  const result = await getPublicResult(params.leadId)

  if (!result) {
    return (
      <main className="section-space bg-cream-50 min-h-screen flex items-center">
        <ResultFallback variant="notFound" />
      </main>
    )
  }

  const primary = getPatternById(result.primaryPattern)
  const secondary = getPatternById(result.secondaryPattern)

  if (!primary || !secondary) {
    // Content-data mismatch (e.g. patterns.json was edited after this lead
    // was scored) — fail safely rather than crash or show a broken page.
    return (
      <main className="section-space bg-cream-50 min-h-screen flex items-center">
        <ResultFallback variant="error" />
      </main>
    )
  }

  // The PDF is generated on demand by /api/result-pdf/[leadId] (see that
  // route) — the link below is what actually gets the result into
  // WhatsApp, since wa.me can pre-fill message text but can't attach a file.
  const pdfUrlEn = `${siteUrl}/api/result-pdf/${params.leadId}`
  const pdfUrlHi = `${siteUrl}/api/result-pdf/${params.leadId}?lang=hi`
  const whatsappUrlEn = buildWhatsAppUrl({ primaryPatternName: primary.name, pdfUrl: pdfUrlEn, language: 'en' })
  const whatsappUrlHi = buildWhatsAppUrl({ primaryPatternName: primary.nameHi, pdfUrl: pdfUrlHi, language: 'hi' })

  return (
    <main className="section-space bg-cream-50">
      <ClearAssessmentSession />
      <TrackEvent event="assessment_completed" />
      <ResultView
        result={result}
        primary={primary}
        secondary={secondary}
        whatsappUrlEn={whatsappUrlEn}
        whatsappUrlHi={whatsappUrlHi}
        pdfUrlEn={pdfUrlEn}
        pdfUrlHi={pdfUrlHi}
      />
    </main>
  )
}
