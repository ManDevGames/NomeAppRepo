import 'server-only'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Privileged Supabase client using the service-role key, which bypasses
 * Row Level Security entirely.
 *
 * SECURITY: this must only ever run in trusted server-side code — Route
 * Handlers and Server Components under /api or /admin, after the caller has
 * already been verified (e.g. an authenticated admin session, or the
 * server's own validated submit-assessment flow). Never import this file
 * from a "use client" component, and never forward SUPABASE_SERVICE_ROLE_KEY
 * to the browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase admin client is missing required environment variables.')
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
