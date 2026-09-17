import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth'
import { getLeadDetail } from '@/lib/admin-data'
import { getPatternById } from '@/lib/patterns'
import { getQuestionById } from '@/lib/scoring'
import { PatternBreakdownChart } from '@/components/admin/PatternBreakdownChart'
import { PATTERN_ORDER } from '@/types'

export const metadata: Metadata = {
  title: 'Lead Detail',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

interface LeadDetailPageProps {
  params: { leadId: string }
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const user = await getSessionUser()
  if (!user) {
    redirect('/admin/login')
  }

  const detail = await getLeadDetail(params.leadId)

  if (!detail) {
    return (
      <main className="min-h-screen bg-cream-100">
        <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8">
          <Link href="/admin/dashboard" className="text-sm text-charcoal-500 hover:text-rose-500">
            ← Back to dashboard
          </Link>
          <p className="mt-6 text-sm text-charcoal-600">This lead could not be found.</p>
        </div>
      </main>
    )
  }

  const { lead, responses, scores } = detail
  const primary = lead.primary_pattern ? getPatternById(lead.primary_pattern) : null
  const secondary = lead.secondary_pattern ? getPatternById(lead.secondary_pattern) : null

  const scoreRows = PATTERN_ORDER.map((id) => ({
    name: getPatternById(id)?.name ?? id,
    count: scores[id],
  }))

  return (
    <main className="min-h-screen bg-cream-100">
      <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8">
        <Link href="/admin/dashboard" className="text-sm text-charcoal-500 hover:text-rose-500">
          ← Back to dashboard
        </Link>

        <h1 className="mt-4 text-2xl font-semibold text-charcoal-900">{lead.name}</h1>

        <section className="mt-6 rounded-2xl border border-charcoal-100 bg-white p-6 shadow-soft">
          <h2 className="text-base font-semibold text-charcoal-900">Lead Information</h2>
          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-charcoal-400">WhatsApp</dt>
              <dd className="text-sm text-charcoal-700">{lead.whatsapp_number}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-charcoal-400">Email</dt>
              <dd className="text-sm text-charcoal-700">{lead.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-charcoal-400">Created</dt>
              <dd className="text-sm text-charcoal-700">{new Date(lead.created_at).toLocaleString('en-IN')}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-charcoal-400">Completed</dt>
              <dd className="text-sm text-charcoal-700">{lead.assessment_completed ? 'Yes' : 'No'}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-charcoal-400">UTM Source</dt>
              <dd className="text-sm text-charcoal-700">{lead.utm_source ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-charcoal-400">UTM Medium</dt>
              <dd className="text-sm text-charcoal-700">{lead.utm_medium ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-charcoal-400">UTM Campaign</dt>
              <dd className="text-sm text-charcoal-700">{lead.utm_campaign ?? '—'}</dd>
            </div>
          </dl>
        </section>

        <section className="mt-6 rounded-2xl border border-charcoal-100 bg-white p-6 shadow-soft">
          <h2 className="text-base font-semibold text-charcoal-900">Result</h2>
          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-charcoal-400">Primary Pattern</dt>
              <dd className="text-sm text-charcoal-700">{primary?.name ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-charcoal-400">Secondary Pattern</dt>
              <dd className="text-sm text-charcoal-700">{secondary?.name ?? '—'}</dd>
            </div>
          </dl>
        </section>

        <div className="mt-6">
          <PatternBreakdownChart rows={scoreRows} />
        </div>

        <section className="mt-6 rounded-2xl border border-charcoal-100 bg-white p-6 shadow-soft">
          <h2 className="text-base font-semibold text-charcoal-900">Answers</h2>
          <div className="mt-4 flex flex-col gap-4">
            {responses.map((response) => {
              const question = getQuestionById(response.question_id)
              const option = question?.options.find((o) => o.key === response.selected_option)
              return (
                <div key={response.id} className="border-b border-charcoal-50 pb-4 last:border-0 last:pb-0">
                  <p className="text-sm font-medium text-charcoal-800">{question?.text ?? response.question_id}</p>
                  <p className="mt-1 text-sm text-charcoal-600">{option?.text ?? response.selected_option}</p>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}
