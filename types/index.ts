// Core domain types shared between the question/pattern content (JSON),
// the scoring engine, the database layer, and the UI.

/** Stable, machine-readable identifiers for the six relationship patterns. */
export type PatternId =
  | 'abandonment'
  | 'overthinking'
  | 'selfWorth'
  | 'trustProtection'
  | 'peoplePleasing'
  | 'repeatingPattern'

/** Canonical ordering of patterns, used only to break scoring ties deterministically. */
export const PATTERN_ORDER: PatternId[] = [
  'abandonment',
  'overthinking',
  'selfWorth',
  'trustProtection',
  'peoplePleasing',
  'repeatingPattern',
]

export interface QuestionOption {
  key: string
  text: string
  /** Hindi/Hinglish translation of `text`, shown when the language toggle is set to Hindi. */
  textHi: string
  scores: Partial<Record<PatternId, number>>
}

export interface Question {
  id: string
  text: string
  /** Hindi/Hinglish translation of `text`, shown when the language toggle is set to Hindi. */
  textHi: string
  options: QuestionOption[]
}

export interface PatternCycle {
  trigger: string
  thought: string
  emotion: string
  reaction: string
  impact: string
  repeat: string
}

export interface Pattern {
  id: PatternId
  name: string
  /** The short Hindi/English "inner thought" headline shown alongside the pattern name. */
  headline: string
  shortDescription: string
  experiencePoints: string[]
  triggers: string[]
  cycle: PatternCycle
}

export interface AssessmentAnswer {
  questionId: string
  optionKey: string
}

export interface UtmParams {
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
}

export type PatternScores = Record<PatternId, number>

export interface ScoringResult {
  scores: PatternScores
  primaryPattern: PatternId
  secondaryPattern: PatternId
}

/** Body accepted by POST /api/submit-assessment. */
export interface SubmitAssessmentRequest {
  name: string
  whatsapp: string
  email: string
  consent: boolean
  answers: AssessmentAnswer[]
  utm: UtmParams
}

export interface SubmitAssessmentResponse {
  leadId: string
}

// ---- Database row shapes (mirrors supabase/migrations/0001_init.sql) ----

export interface LeadRow {
  id: string
  name: string
  whatsapp_number: string
  email: string
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  created_at: string
  assessment_completed: boolean
  primary_pattern: PatternId | null
  secondary_pattern: PatternId | null
}

export interface ResponseRow {
  id: string
  lead_id: string
  question_id: string
  selected_option: string
  created_at: string
}

export interface ScoreRow {
  id: string
  lead_id: string
  pattern_name: PatternId
  score_value: number
}

/** Minimal, non-PII projection of a lead used on the public result page. */
export interface PublicResult {
  primaryPattern: PatternId
  secondaryPattern: PatternId
  name: string
}
