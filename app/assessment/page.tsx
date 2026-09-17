'use client'

import { useRouter } from 'next/navigation'
import { QuestionCard } from '@/components/assessment/QuestionCard'
import { useAssessmentState } from '@/hooks/useAssessmentState'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { uiText } from '@/lib/i18n/translations'

export default function AssessmentPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const {
    hydrated,
    currentQuestion,
    currentIndex,
    totalQuestions,
    isLastQuestion,
    selectedOptionKey,
    selectAnswer,
    goNext,
    goBack,
  } = useAssessmentState()

  function handleNext() {
    if (isLastQuestion) {
      router.push('/assessment/details')
      return
    }
    goNext()
  }

  return (
    <main className="section-space bg-cream-50 min-h-screen">
      <div className="container-app max-w-2xl">
        {!hydrated || !currentQuestion ? (
          <div className="rounded-3xl border border-charcoal-100 bg-cream-50 p-10 text-center text-sm text-charcoal-400 shadow-card">
            {uiText[language].question.loading}
          </div>
        ) : (
          <QuestionCard
            question={currentQuestion}
            currentIndex={currentIndex}
            totalQuestions={totalQuestions}
            selectedOptionKey={selectedOptionKey}
            onSelect={selectAnswer}
            onBack={goBack}
            onNext={handleNext}
            isLastQuestion={isLastQuestion}
          />
        )}
      </div>
    </main>
  )
}
