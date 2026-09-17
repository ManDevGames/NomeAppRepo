import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPatternById } from '@/lib/patterns'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { PatternCard } from '@/components/ui/PatternCard'
import { TriggerChip } from '@/components/ui/TriggerChip'
import { PatternCycle } from '@/components/ui/PatternCycle'
import { WhatsAppCTA } from '@/components/assessment/WhatsAppCTA'
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
        <div className="container-app max-w-lg text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-charcoal-900">We couldn&rsquo;t find that result</h1>
          <p className="mt-4 text-sm sm:text-base text-charcoal-600">
            This link may have expired or the assessment wasn&rsquo;t completed. You&rsquo;re welcome to take it
            again.
          </p>
          <Link
            href="/assessment"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-rose-400 px-6 py-3 text-sm font-medium text-white hover:bg-rose-500"
          >
            Retake the Assessment
          </Link>
        </div>
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
        <div className="container-app max-w-lg text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-charcoal-900">Something went wrong</h1>
          <p className="mt-4 text-sm sm:text-base text-charcoal-600">
            We&rsquo;re having trouble loading this result right now. Please try again shortly.
          </p>
        </div>
      </main>
    )
  }

  const whatsappUrl = buildWhatsAppUrl(primary.name)

  return (
    <main className="section-space bg-cream-50">
      <ClearAssessmentSession />
      <TrackEvent event="assessment_completed" />

      <div className="container-app max-w-3xl flex flex-col gap-14">
        <div className="text-center">
          <span className="eyebrow">{result.name}&rsquo;s Result</span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold text-charcoal-900">Your Relationship Pattern</h1>
        </div>

        <PatternCard pattern={primary} variant="primary" />
        <PatternCard pattern={secondary} variant="secondary" />

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-charcoal-900">You May Experience</h2>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {primary.experiencePoints.map((point) => (
              <div key={point} className="rounded-2xl border border-charcoal-100 bg-cream-50 p-4 shadow-soft">
                <p className="text-sm leading-relaxed text-charcoal-700">{point}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-charcoal-900">Common Triggers</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {primary.triggers.map((trigger) => (
              <TriggerChip key={trigger}>{trigger}</TriggerChip>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-charcoal-900">Your Pattern Cycle</h2>
          <div className="mt-6">
            <PatternCycle cycle={primary.cycle} />
          </div>
        </section>

        <p className="rounded-2xl bg-charcoal-50 p-5 text-center text-sm leading-relaxed text-charcoal-500">
          This is a self-awareness tool, not a clinical diagnosis. Your result reflects your answers today — it
          isn&rsquo;t a fixed label, and it can change as you do.
        </p>

        <section className="rounded-3xl border border-charcoal-100 bg-blush-50 p-7 sm:p-10 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-charcoal-900">Want to work deeper on this?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm sm:text-base leading-relaxed text-charcoal-600">
            You can connect with us directly on WhatsApp to talk through your result and explore it further — no
            pressure, just a conversation.
          </p>
          <div className="mt-7">
            <WhatsAppCTA href={whatsappUrl} />
          </div>
        </section>
      </div>
    </main>
  )
}
