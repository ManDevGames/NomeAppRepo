import { describe, expect, it } from 'vitest'
import {
  normalizeWhatsappNumber,
  validateAnswers,
  validateConsent,
  validateEmail,
  validateName,
} from './validation'
import { getQuestions } from './scoring'

describe('validateName', () => {
  it('rejects an empty name', () => {
    expect(validateName('').valid).toBe(false)
    expect(validateName('  ').valid).toBe(false)
  })

  it('rejects a non-string input', () => {
    expect(validateName(undefined).valid).toBe(false)
    expect(validateName(123).valid).toBe(false)
  })

  it('trims and accepts a valid name', () => {
    const result = validateName('  Priya Sharma  ')
    expect(result.valid).toBe(true)
    expect(result.value).toBe('Priya Sharma')
  })
})

describe('validateEmail', () => {
  it('rejects invalid email formats', () => {
    for (const bad of ['not-an-email', 'missing@domain', '@nodomain.com', 'spaces in@email.com']) {
      expect(validateEmail(bad).valid).toBe(false)
    }
  })

  it('accepts and lowercases a valid email', () => {
    const result = validateEmail('Someone@Example.com')
    expect(result.valid).toBe(true)
    expect(result.value).toBe('someone@example.com')
  })
})

describe('normalizeWhatsappNumber', () => {
  it('accepts a plain 10-digit number', () => {
    const result = normalizeWhatsappNumber('9876543210')
    expect(result.valid).toBe(true)
    expect(result.value).toBe('919876543210')
  })

  it('accepts +91-prefixed and 91-prefixed numbers, normalizing to the same value', () => {
    expect(normalizeWhatsappNumber('+919876543210').value).toBe('919876543210')
    expect(normalizeWhatsappNumber('919876543210').value).toBe('919876543210')
    expect(normalizeWhatsappNumber('09876543210').value).toBe('919876543210')
  })

  it('rejects numbers that are too short, too long, or start with an invalid digit', () => {
    expect(normalizeWhatsappNumber('12345').valid).toBe(false)
    expect(normalizeWhatsappNumber('12345678901234').valid).toBe(false)
    // Indian mobile numbers start with 6-9, not 5.
    expect(normalizeWhatsappNumber('5876543210').valid).toBe(false)
  })
})

describe('validateConsent', () => {
  it('rejects anything other than boolean true', () => {
    expect(validateConsent(false).valid).toBe(false)
    expect(validateConsent(undefined).valid).toBe(false)
    expect(validateConsent('true').valid).toBe(false)
  })

  it('accepts true', () => {
    expect(validateConsent(true).valid).toBe(true)
  })
})

describe('validateAnswers', () => {
  const questions = getQuestions()

  it('rejects a non-array payload', () => {
    expect(validateAnswers(null, questions).valid).toBe(false)
    expect(validateAnswers('answers', questions).valid).toBe(false)
  })

  it('rejects a payload missing answers for some questions', () => {
    const partial = [{ questionId: questions[0].id, optionKey: questions[0].options[0].key }]
    expect(validateAnswers(partial, questions).valid).toBe(false)
  })

  it('rejects an unknown question id', () => {
    const answers = questions.map((q) => ({ questionId: q.id, optionKey: q.options[0].key }))
    answers[0] = { questionId: 'not-a-real-question', optionKey: 'A' }
    expect(validateAnswers(answers, questions).valid).toBe(false)
  })

  it('rejects an unknown option key for a real question', () => {
    const answers = questions.map((q) => ({ questionId: q.id, optionKey: q.options[0].key }))
    answers[0] = { questionId: questions[0].id, optionKey: 'not-a-real-option' }
    expect(validateAnswers(answers, questions).valid).toBe(false)
  })

  it('rejects duplicate answers for the same question', () => {
    const answers = questions.map((q) => ({ questionId: q.id, optionKey: q.options[0].key }))
    answers.push({ questionId: questions[0].id, optionKey: questions[0].options[1].key })
    expect(validateAnswers(answers, questions).valid).toBe(false)
  })

  it('accepts one valid answer per question', () => {
    const answers = questions.map((q) => ({ questionId: q.id, optionKey: q.options[0].key }))
    const result = validateAnswers(answers, questions)
    expect(result.valid).toBe(true)
    expect(result.value).toHaveLength(questions.length)
  })
})
