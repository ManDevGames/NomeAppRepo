'use client'

import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-50 px-5">
      <div className="max-w-md text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold text-charcoal-900">Something went wrong</h1>
        <p className="mt-3 text-sm sm:text-base text-charcoal-600">
          We ran into an unexpected problem. Please try again — if it keeps happening, come back a little later.
        </p>
        <button
          onClick={reset}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-rose-400 px-6 py-3 text-sm font-medium text-white hover:bg-rose-500"
        >
          Try Again
        </button>
      </div>
    </main>
  )
}
