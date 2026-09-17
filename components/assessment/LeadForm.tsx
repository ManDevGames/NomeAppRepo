'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { track } from '@vercel/analytics'
import { Button } from '@/components/ui/Button'
import { getStoredUtm } from '@/lib/utm'
import type { AssessmentAnswer, SubmitAssessmentRequest, SubmitAssessmentResponse } from '@/types'

interface LeadFormProps {
  answers: AssessmentAnswer[]
}

interface FormErrors {
  name?: string
  whatsapp?: string
  email?: string
  consent?: string
  form?: string
}

export function LeadForm({ answers }: LeadFormProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrors({})

    const nextErrors: FormErrors = {}
    if (name.trim().length < 2) nextErrors.name = 'Please enter your full name.'
    if (!/^\d{10}$/.test(whatsapp.replace(/[^\d]/g, '').replace(/^91/, '').replace(/^0/, '')))
      nextErrors.whatsapp = 'Please enter a valid 10-digit WhatsApp number.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = 'Please enter a valid email address.'
    if (!consent) nextErrors.consent = 'Please confirm you’d like to receive your result.'

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setSubmitting(true)

    const body: SubmitAssessmentRequest = {
      name,
      whatsapp,
      email,
      consent,
      answers,
      utm: getStoredUtm(),
    }

    try {
      const res = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        setErrors({ form: data?.error ?? 'Something went wrong. Please try again.' })
        setSubmitting(false)
        return
      }

      const data = (await res.json()) as SubmitAssessmentResponse
      track('lead_submitted')
      router.push(`/assessment/result/${data.leadId}`)
    } catch {
      setErrors({ form: 'We couldn’t reach the server. Please check your connection and try again.' })
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div>
        <label htmlFor="lead-name" className="text-sm font-medium text-charcoal-800">
          Name
        </label>
        <input
          id="lead-name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'lead-name-error' : undefined}
          className="mt-2 w-full rounded-full border border-charcoal-200 px-5 py-3 text-sm focus:border-rose-300 focus:outline-none"
          placeholder="Your name"
        />
        {errors.name && (
          <p id="lead-name-error" className="mt-1.5 text-xs text-rose-500">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="lead-whatsapp" className="text-sm font-medium text-charcoal-800">
          WhatsApp Number
        </label>
        <input
          id="lead-whatsapp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          aria-invalid={!!errors.whatsapp}
          aria-describedby={errors.whatsapp ? 'lead-whatsapp-error' : undefined}
          className="mt-2 w-full rounded-full border border-charcoal-200 px-5 py-3 text-sm focus:border-rose-300 focus:outline-none"
          placeholder="98765 43210"
        />
        {errors.whatsapp && (
          <p id="lead-whatsapp-error" className="mt-1.5 text-xs text-rose-500">
            {errors.whatsapp}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="lead-email" className="text-sm font-medium text-charcoal-800">
          Email
        </label>
        <input
          id="lead-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'lead-email-error' : undefined}
          className="mt-2 w-full rounded-full border border-charcoal-200 px-5 py-3 text-sm focus:border-rose-300 focus:outline-none"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p id="lead-email-error" className="mt-1.5 text-xs text-rose-500">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-charcoal-700">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? 'lead-consent-error' : undefined}
            className="mt-1 h-4 w-4 shrink-0 rounded border-charcoal-300 text-rose-400 focus:ring-rose-300"
          />
          <span>I'd like to receive my Relationship Pattern result.</span>
        </label>
        {errors.consent && (
          <p id="lead-consent-error" className="mt-1.5 text-xs text-rose-500">
            {errors.consent}
          </p>
        )}
      </div>

      {errors.form && (
        <p role="alert" className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-600">
          {errors.form}
        </p>
      )}

      <Button type="submit" size="lg" disabled={submitting} className="mt-2 w-full">
        {submitting ? 'Calculating your relationship pattern…' : 'Get My Result'}
      </Button>
    </form>
  )
}
