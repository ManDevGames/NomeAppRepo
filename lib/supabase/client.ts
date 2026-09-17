import { createBrowserClient } from '@supabase/ssr'

/**
 * Browser-side Supabase client, used only by client components (currently:
 * the admin login form). Uses the public anon key — safe to ship to the
 * browser, and constrained by RLS.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
