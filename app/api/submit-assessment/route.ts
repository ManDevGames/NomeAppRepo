import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getQuestions, scoreAssessment } from '@/lib/scoring'
import {
  validateAnswers,
  validateConsent,
  validateEmail,
  validateName,
  normalizeWhatsappNumber,
} from '@/lib/validation'
import { sanitizeUtm } from '@/lib/utm'
import type { SubmitAssessmentRequest, SubmitAssessmentResponse } from '@/types'

export const runtime = 'nodejs'

const DUPLICATE_WINDOW_HOURS = 24

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(request: Request) {
  let body: Partial<SubmitAssessmentRequest>

  try {
    body = await request.json()
  } catch {
    return errorResponse('We couldn’t read your submission. Please try again.', 400)
  }

  const nameResult = validateName(body.name)
  if (!nameResult.valid) return errorResponse(nameResult.error!, 400)

  const emailResult = validateEmail(body.email)
  if (!emailResult.valid) return errorResponse(emailResult.error!, 400)

  const whatsappResult = normalizeWhatsappNumber(body.whatsapp)
  if (!whatsappResult.valid) return errorResponse(whatsappResult.error!, 400)

  const consentResult = validateConsent(body.consent)
  if (!consentResult.valid) return errorResponse(consentResult.error!, 400)

  const answersResult = validateAnswers(body.answers, getQuestions())
  if (!answersResult.valid) return errorResponse(answersResult.error!, 400)

  const name = nameResult.value!
  const email = emailResult.value!
  const whatsapp = whatsappResult.value!
  const answers = answersResult.value!

  const utm = sanitizeUtm(body.utm)

  let supabase
  try {
    supabase = createAdminClient()
  } catch (err) {
    console.error('submit-assessment: admin client init failed', err)
    return errorResponse('Something went wrong on our end. Please try again shortly.', 500)
  }

  // Duplicate-submission guard: same normalized WhatsApp number within the
  // last 24 hours. Server-side only — never trust a client-supplied flag.
  const windowStart = new Date(Date.now() - DUPLICATE_WINDOW_HOURS * 60 * 60 * 1000).toISOString()
  const { data: recentLead, error: duplicateCheckError } = await supabase
    .from('leads')
    .select('id')
    .eq('whatsapp_number', whatsapp)
    .gte('created_at', windowStart)
    .limit(1)
    .maybeSingle()

  if (duplicateCheckError) {
    console.error('submit-assessment: duplicate check failed', duplicateCheckError)
    return errorResponse('Something went wrong on our end. Please try again shortly.', 500)
  }

  if (recentLead) {
    return errorResponse(
      'It looks like you recently completed this assessment. Please use your previous result.',
      409,
    )
  }

  // Scoring happens here, in trusted server code — the browser only ever
  // submits raw answers, never final scores.
  const { scores, primaryPattern, secondaryPattern } = scoreAssessment(answers)

  const rpcResponses = answers.map((a) => ({
    question_id: a.questionId,
    selected_option: a.optionKey,
  }))
  const rpcScores = Object.entries(scores).map(([pattern_name, score_value]) => ({
    pattern_name,
    score_value,
  }))

  const { data: leadId, error: submitError } = await supabase.rpc('submit_assessment', {
    p_name: name,
    p_whatsapp_number: whatsapp,
    p_email: email,
    p_utm_source: utm.utm_source ?? null,
    p_utm_medium: utm.utm_medium ?? null,
    p_utm_campaign: utm.utm_campaign ?? null,
    p_responses: rpcResponses,
    p_scores: rpcScores,
    p_primary_pattern: primaryPattern,
    p_secondary_pattern: secondaryPattern,
  })

  if (submitError || !leadId) {
    console.error('submit-assessment: rpc failed', submitError)
    return errorResponse('Something went wrong saving your result. Please try again.', 500)
  }

  const response: SubmitAssessmentResponse = { leadId: leadId as string }
  return NextResponse.json(response, { status: 201 })
}
