'use client'

import Link from 'next/link'
import { track } from '@vercel/analytics'

interface StartAssessmentButtonProps {
  label: string
  size?: 'md' | 'lg'
  className?: string
}

export function StartAssessmentButton({ label, size = 'lg', className = '' }: StartAssessmentButtonProps) {
  const sizeClasses = size === 'lg' ? 'px-8 py-4 text-base sm:text-lg' : 'px-6 py-3 text-sm sm:text-base'

  return (
    <Link
      href="/assessment"
      onClick={() => track('assessment_started')}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-rose-400 font-medium text-white shadow-soft transition-all duration-200 hover:bg-rose-500 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 ${sizeClasses} ${className}`}
    >
      {label} →
    </Link>
  )
}
