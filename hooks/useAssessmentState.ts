'use client'

import { useCallback, useEffect, useState } from 'react'
import { getQuestions } from '@/lib/scoring'
import type { AssessmentAnswer } from '@/types'

const STORAGE_KEY = 'rpa:assessment-state'

interface PersistedState {
  answers: AssessmentAnswer[]
  currentIndex: number
}

const DEFAULT_STATE: PersistedState = { answers: [], currentIndex: 0 }

function loadState(): PersistedState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw) as PersistedState
    if (!Array.isArray(parsed.answers) || typeof parsed.currentIndex !== 'number') {
      return DEFAULT_STATE
    }
    return parsed
  } catch {
    return DEFAULT_STATE
  }
}

function saveState(state: PersistedState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // sessionStorage unavailable — the flow still works, it just won't
    // survive a refresh.
  }
}

/**
 * Client-side answer state for the one-question-per-screen assessment.
 * Answers live in sessionStorage (not Supabase) until the user reaches the
 * lead-capture step — nothing is written to the database while they're
 * still answering. Hydration is deliberately deferred to a `useEffect` (see
 * `hydrated`) so the server-rendered first paint never depends on
 * sessionStorage, avoiding a hydration mismatch.
 */
export function useAssessmentState() {
  const questions = getQuestions()
  const [state, setState] = useState<PersistedState>(DEFAULT_STATE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setState(loadState())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) saveState(state)
  }, [state, hydrated])

  const currentQuestion = questions[state.currentIndex]
  const totalQuestions = questions.length
  const isLastQuestion = state.currentIndex === totalQuestions - 1
  const selectedOptionKey = state.answers.find((a) => a.questionId === currentQuestion?.id)?.optionKey

  const selectAnswer = useCallback(
    (optionKey: string) => {
      setState((prev) => {
        const question = questions[prev.currentIndex]
        const withoutCurrent = prev.answers.filter((a) => a.questionId !== question.id)
        return { ...prev, answers: [...withoutCurrent, { questionId: question.id, optionKey }] }
      })
    },
    [questions],
  )

  const goNext = useCallback(() => {
    setState((prev) => ({ ...prev, currentIndex: Math.min(prev.currentIndex + 1, totalQuestions - 1) }))
  }, [totalQuestions])

  const goBack = useCallback(() => {
    setState((prev) => ({ ...prev, currentIndex: Math.max(prev.currentIndex - 1, 0) }))
  }, [])

  const isComplete = state.answers.length === totalQuestions

  const clear = useCallback(() => {
    setState(DEFAULT_STATE)
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [])

  return {
    hydrated,
    questions,
    currentQuestion,
    currentIndex: state.currentIndex,
    totalQuestions,
    isLastQuestion,
    selectedOptionKey,
    answers: state.answers,
    isComplete,
    selectAnswer,
    goNext,
    goBack,
    clear,
  }
}
