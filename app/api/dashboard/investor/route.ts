import { NextResponse } from 'next/server'
import { createServiceSupabaseClient, getUserFromRequest } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    // Derive authenticated user from session
    const user = await getUserFromRequest(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createServiceSupabaseClient()

    // Ensure this user is an investor
    const { data: profile, error: pErr } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (pErr || !profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    if (profile.role !== 'investor') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const investorId = user.id

    // saved startups count
    const { count: saved_count } = await supabase.from('saved_startups').select('*', { count: 'exact' }).eq('investor_id', investorId)

    // recent matches
    const { data: matches } = await supabase.from('matches').select('*, startups(*)').eq('investor_id', investorId).order('created_at', { ascending: false }).limit(10)

    // preferences from investors table
    const { data: investor } = await supabase.from('investors').select('*').eq('user_id', investorId).single()

    return NextResponse.json({ saved_count: saved_count || 0, recent_matches: matches || [], preferences: investor || null })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 })
  }
}
