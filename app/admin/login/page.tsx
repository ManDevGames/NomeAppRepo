'use client'

import { Suspense, useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  )
}

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError('Incorrect email or password.')
      setSubmitting(false)
      return
    }

    const requested = searchParams.get('redirectTo')
    const redirectTo = requested && requested.startsWith('/') ? requested : '/admin/dashboard'
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-50 px-5">
      <div className="w-full max-w-sm rounded-3xl border border-charcoal-100 bg-cream-50 p-8 shadow-card">
        <h1 className="text-xl font-semibold text-charcoal-900">Admin Login</h1>
        <p className="mt-1 text-sm text-charcoal-500">Relationship Pattern Assessment™</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="admin-email" className="text-sm font-medium text-charcoal-800">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-full border border-charcoal-200 px-5 py-3 text-sm focus:border-rose-300 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="text-sm font-medium text-charcoal-800">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-full border border-charcoal-200 px-5 py-3 text-sm focus:border-rose-300 focus:outline-none"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-600">
              {error}
            </p>
          )}

          <Button type="submit" disabled={submitting} className="mt-2 w-full">
            {submitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
      </div>
    </main>
  )
}
