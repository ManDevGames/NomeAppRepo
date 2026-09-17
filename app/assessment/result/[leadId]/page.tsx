import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPatternById } from '@/lib/patterns'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { ResultView } from '@/components/assessment/ResultView'
import { ResultFallback } from '@/components/assessment/ResultFallback'
import { ClearAssessmentSession } from '@/components/ClearAssessmentSession'
import { TrackEvent } from '@/components/TrackEvent'
import type { LeadRow, PublicResult } from '@/types'

export const metadata: Metadata = {
  title: 'Your Relationship Pattern',
  robots: { index: false, follow: false },
}

interface ResultPageProps {
  params: { leadId: string }
}

/**
 * Fetches only the fields the result page actually needs — never the full
 * lead row (no email/WhatsApp number reaches this page), per the app's
 * privacy requirements. Uses the service-role client since `leads` has no
 * public RLS policies; a not-found/incomplete lead renders the same
 * generic "not found" state as an invalid id, so this endpoint doesn't leak
 * which ids exist.
 */
async function getPublicResult(leadId: string): Promise<PublicResult | null> {
  // Reject anything that isn't a well-formed UUID before it reaches the
  // database — cheap, and avoids a pointless query for junk input.
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidPattern.test(leadId)) return null

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('leads')
    .select('name, primary_pattern, secondary_pattern, assessment_completed')
    .eq('id', leadId)
    .maybeSingle<Pick<LeadRow, 'name' | 'primary_pattern' | 'secondary_pattern' | 'assessment_completed'>>()

  if (error || !data || !data.assessment_completed || !data.primary_pattern || !data.secondary_pattern) {
    return null
  }

  return {
    name: data.name,
    primaryPattern: data.primary_pattern,
    secondaryPattern: data.secondary_pattern,
  }
}

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

  const whatsappUrl = buildWhatsAppUrl(primary.name)

  return (
    <main className="section-space bg-cream-50">
      <ClearAssessmentSession />
      <TrackEvent event="assessment_completed" />
      <ResultView result={result} primary={primary} secondary={secondary} whatsappUrl={whatsappUrl} />
    </main>
  )
}
