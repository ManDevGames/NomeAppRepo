'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LeadForm } from '@/components/assessment/LeadForm'
import { useAssessmentState } from '@/hooks/useAssessmentState'

export default function AssessmentDetailsPage() {
  const router = useRouter()
  const { hydrated, isComplete, answers } = useAssessmentState()

  useEffect(() => {
    if (hydrated && !isComplete) {
      router.replace('/assessment')
    }
  }, [hydrated, isComplete, router])

  if (!hydrated || !isComplete) {
    return (
      <main className="section-space bg-cream-50 min-h-screen">
        <div className="container-app max-w-lg">
          <div className="rounded-3xl border border-charcoal-100 bg-cream-50 p-10 text-center text-sm text-charcoal-400 shadow-card">
            Loading…
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="section-space bg-cream-50 min-h-screen">
      <div className="container-app max-w-lg">
        <div className="mb-8 text-center">
          <span className="eyebrow">Almost there</span>
          <h1 className="mt-3 text-2xl sm:text-3xl font-semibold text-charcoal-900">
            Where should we send your result?
          </h1>
          <p className="mt-3 text-sm sm:text-base text-charcoal-500">
            We&rsquo;ll use these only to personalise and share your Relationship Pattern result.
          </p>
        </div>

        <div className="rounded-3xl border border-charcoal-100 bg-cream-50 p-6 sm:p-10 shadow-card">
          <LeadForm answers={answers} />
        </div>
      </div>
    </main>
  )
}
