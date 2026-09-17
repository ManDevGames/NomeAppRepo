import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Server-side Supabase client bound to the current request's auth cookies.
 * Uses the public anon key and is subject to RLS — this is "who is signed
 * in right now", not a privileged client. Use this to check whether an
 * admin session exists (e.g. in Server Components and Route Handlers under
 * /admin); use `lib/supabase/admin.ts` for the actual privileged data reads
 * once you've confirmed a session exists.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options)
            }
          } catch {
            // Called from a Server Component render — cookies can't be
            // written here. Session refresh already happens in
            // middleware.ts, so this is safe to ignore.
          }
        },
      },
    },
  )
}
