import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Server-side Supabase helpers. Only use the service role key in server-only code
// (do NOT expose SUPABASE_SERVICE_ROLE_KEY to the browser or commit it).

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL in server environment');
}

/**
 * Create a server-side Supabase client that uses the service_role key.
 * WARNING: Only call this from trusted server code. Do NOT ship the
 * service role key to the browser.
 */
export function createServiceSupabaseClient(): SupabaseClient {
  if (!supabaseServiceRole) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in environment. Set this only on the server.');
  }
  return createClient(supabaseUrl!, supabaseServiceRole!);
}

/**
 * Create a server-side Supabase client using the anon/public key.
 * Useful for server-side requests that should obey RLS policies.
 */
export function createAnonSupabaseClient(): SupabaseClient {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!anonKey) throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY in environment');
  return createClient(supabaseUrl!, anonKey!);
}

export type { SupabaseClient };

/**
 * Extract Supabase access token from a Request's cookies or Authorization header
 * and return the authenticated user (or null).
 */
export async function getUserFromRequest(request: Request) {
  // Read cookies string (app route Request supports headers)
  const cookieHeader = request.headers.get('cookie') || ''

  const cookies = cookieHeader.split(';').map((c) => c.split('=').map((p) => p && p.trim()))
    .filter((p) => p && p[0])
    .reduce<Record<string, string>>((acc, [k, v]) => {
      if (k && v) acc[k] = decodeURIComponent(v)
      return acc
    }, {})

  const token = (request.headers.get('authorization') || '').replace('Bearer ', '')
    || cookies['sb-access-token']
    || cookies['sb:token']
    || cookies['supabase-auth-token']

  if (!token) return null

  const supabase = createServiceSupabaseClient()
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data?.user) return null
  return data.user
}
