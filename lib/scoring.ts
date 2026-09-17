import questionsData from '@/data/questions.json'
import type { AssessmentAnswer, PatternId, PatternScores, Question, ScoringResult } from '@/types'
import { PATTERN_ORDER } from '@/types'

const questions = questionsData.questions as unknown as Question[]

function emptyScores(): PatternScores {
  return {
    abandonment: 0,
    overthinking: 0,
    selfWorth: 0,
    trustProtection: 0,
    peoplePleasing: 0,
    repeatingPattern: 0,
  }
}

/**
 * Picks the highest-scoring pattern id from `scores`, excluding any id in
 * `exclude`. Ties break deterministically using PATTERN_ORDER (the order the
 * six patterns are declared in types/index.ts) — the earlier pattern in that
 * list wins. This must stay deterministic: never use randomness here, since
 * the same answers must always produce the same result.
 */
function highestScoring(scores: PatternScores, exclude: PatternId[] = []): PatternId {
  let best: PatternId | null = null
  let bestValue = -Infinity

  for (const id of PATTERN_ORDER) {
    if (exclude.includes(id)) continue
    const value = scores[id]
    if (value > bestValue) {
      bestValue = value
      best = id
    }
  }

  // PATTERN_ORDER always has more entries than `exclude` can reasonably
  // contain in this app (at most one, the primary pattern), so `best` is
  // never null in practice — this fallback only guards the type.
  return best ?? PATTERN_ORDER[0]
}

/**
 * Computes pattern scores from a set of answers, validated against the
 * question bank. Only answers referencing a real question id and option key
 * are counted — this is what keeps the score trustworthy even though the
 * caller (the API route) is ultimately responsible for validating the whole
 * request before calling this.
 */
export function scoreAssessment(answers: AssessmentAnswer[]): ScoringResult {
  const scores = emptyScores()

  for (const answer of answers) {
    const question = questions.find((q) => q.id === answer.questionId)
    const option = question?.options.find((o) => o.key === answer.optionKey)
    if (!option) continue

    for (const [patternId, weight] of Object.entries(option.scores)) {
      const id = patternId as PatternId
      scores[id] += weight ?? 0
    }
  }

  const primaryPattern = highestScoring(scores)
  const secondaryPattern = highestScoring(scores, [primaryPattern])

  return { scores, primaryPattern, secondaryPattern }
}

export function getQuestions(): Question[] {
  return questions
}

export function getQuestionById(id: string): Question | undefined {
  return questions.find((q) => q.id === id)
}
