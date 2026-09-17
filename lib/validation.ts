import type { AssessmentAnswer, Question } from '@/types'

export interface ValidationResult<T> {
  valid: boolean
  value?: T
  error?: string
}

const NAME_MIN_LENGTH = 2
const NAME_MAX_LENGTH = 80

export function validateName(input: unknown): ValidationResult<string> {
  if (typeof input !== 'string') {
    return { valid: false, error: 'Please enter your name.' }
  }
  const trimmed = input.trim().replace(/\s+/g, ' ')
  if (trimmed.length < NAME_MIN_LENGTH) {
    return { valid: false, error: 'Please enter your full name.' }
  }
  if (trimmed.length > NAME_MAX_LENGTH) {
    return { valid: false, error: 'That name looks too long — please shorten it.' }
  }
  return { valid: true, value: trimmed }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(input: unknown): ValidationResult<string> {
  if (typeof input !== 'string') {
    return { valid: false, error: 'Please enter your email address.' }
  }
  const trimmed = input.trim().toLowerCase()
  if (!EMAIL_REGEX.test(trimmed) || trimmed.length > 254) {
    return { valid: false, error: 'Please enter a valid email address.' }
  }
  return { valid: true, value: trimmed }
}

/**
 * Accepts Indian mobile numbers in the forms:
 *   9876543210 | +919876543210 | 919876543210 | 09876543210
 * and normalizes them to a consistent "91XXXXXXXXXX" (12-digit, no
 * leading "+") format for storage and duplicate-detection.
 */
export function normalizeWhatsappNumber(input: unknown): ValidationResult<string> {
  if (typeof input !== 'string') {
    return { valid: false, error: 'Please enter your WhatsApp number.' }
  }

  const digitsOnly = input.replace(/[^\d]/g, '')
  let tenDigit: string | null = null

  if (digitsOnly.length === 10) {
    tenDigit = digitsOnly
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    tenDigit = digitsOnly.slice(1)
  } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    tenDigit = digitsOnly.slice(2)
  } else if (digitsOnly.length === 13 && digitsOnly.startsWith('091')) {
    tenDigit = digitsOnly.slice(3)
  }

  if (!tenDigit || !/^[6-9]\d{9}$/.test(tenDigit)) {
    return { valid: false, error: 'Please enter a valid 10-digit Indian mobile number.' }
  }

  return { valid: true, value: `91${tenDigit}` }
}

export function validateConsent(input: unknown): ValidationResult<true> {
  if (input !== true) {
    return { valid: false, error: 'Please confirm you’d like to receive your result.' }
  }
  return { valid: true, value: true }
}

/**
 * Confirms `answers` is exactly one answer per known question, referencing
 * real question ids and option keys — no more, no less, no duplicates,
 * nothing unrecognized. This is what stops a tampered client request from
 * injecting scores for questions/options that don't exist.
 */
export function validateAnswers(
  input: unknown,
  questions: Question[],
): ValidationResult<AssessmentAnswer[]> {
  if (!Array.isArray(input)) {
    return { valid: false, error: 'Assessment answers are missing or invalid.' }
  }

  const questionIds = new Set(questions.map((q) => q.id))
  const seen = new Set<string>()
  const cleaned: AssessmentAnswer[] = []

  for (const raw of input) {
    if (
      typeof raw !== 'object' ||
      raw === null ||
      typeof (raw as Record<string, unknown>).questionId !== 'string' ||
      typeof (raw as Record<string, unknown>).optionKey !== 'string'
    ) {
      return { valid: false, error: 'Assessment answers are missing or invalid.' }
    }

    const { questionId, optionKey } = raw as { questionId: string; optionKey: string }
    const question = questions.find((q) => q.id === questionId)

    if (!question || !questionIds.has(questionId)) {
      return { valid: false, error: 'Assessment answers reference an unknown question.' }
    }
    if (!question.options.some((o) => o.key === optionKey)) {
      return { valid: false, error: 'Assessment answers reference an unknown option.' }
    }
    if (seen.has(questionId)) {
      return { valid: false, error: 'Duplicate answers were submitted for the same question.' }
    }

    seen.add(questionId)
    cleaned.push({ questionId, optionKey })
  }

  if (cleaned.length !== questions.length) {
    return { valid: false, error: 'Please answer every question before submitting.' }
  }

  return { valid: true, value: cleaned }
}
