'use client'

import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { AnswerOption } from '@/components/assessment/AnswerOption'
import { LanguageToggle } from '@/components/i18n/LanguageToggle'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { uiText } from '@/lib/i18n/translations'
import type { Question } from '@/types'

interface QuestionCardProps {
  question: Question
  currentIndex: number
  totalQuestions: number
  selectedOptionKey?: string
  onSelect: (optionKey: string) => void
  onBack: () => void
  onNext: () => void
  isLastQuestion: boolean
}

export function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  selectedOptionKey,
  onSelect,
  onBack,
  onNext,
  isLastQuestion,
}: QuestionCardProps) {
  const { language } = useLanguage()
  const copy = uiText[language].question
  const questionText = language === 'hi' ? question.textHi : question.text

  return (
    <div className="rounded-3xl border border-charcoal-100 bg-cream-50 p-6 sm:p-10 shadow-card">
      <div className="flex justify-end">
        <LanguageToggle />
      </div>

      <div className="mt-4">
        <ProgressBar
          current={currentIndex + 1}
          total={totalQuestions}
          label={copy.questionOf(currentIndex + 1, totalQuestions)}
        />
      </div>

      <div className="mt-8 sm:mt-10">
        <span className="eyebrow">{copy.questionOf(currentIndex + 1, totalQuestions)}</span>
        <h2 className="mt-3 text-xl sm:text-2xl font-semibold leading-snug text-charcoal-900">{questionText}</h2>
      </div>

      <fieldset className="mt-8 flex flex-col gap-3">
        <legend className="sr-only">{questionText}</legend>
        {question.options.map((option) => (
          <AnswerOption
            key={option.key}
            name={question.id}
            optionKey={option.key}
            text={language === 'hi' ? option.textHi : option.text}
            selected={selectedOptionKey === option.key}
            onSelect={onSelect}
          />
        ))}
      </fieldset>

      <div className="mt-10 flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={currentIndex === 0}
          aria-label="Go to previous question"
        >
          {copy.back}
        </Button>
        <Button type="button" onClick={onNext} disabled={!selectedOptionKey}>
          {isLastQuestion ? copy.seeResult : copy.continue_}
        </Button>
      </div>
    </div>
  )
}
