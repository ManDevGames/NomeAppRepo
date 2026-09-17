import { createClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'

/**
 * Returns the currently authenticated Supabase user for this request, or
 * null if there isn't one. Every /admin page and /api/admin/* route must
 * call this (or rely on middleware, which does the same check) before
 * touching privileged data via lib/supabase/admin.ts.
 */
export async function getSessionUser(): Promise<User | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
